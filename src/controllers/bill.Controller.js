import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";
import {Bill} from "../models/bill.model.js";
import PDFDocument from "pdfkit";
import { Patient } from "../models/patient.model.js";
import mongoose from "mongoose";

const createBill = asyncHandler(async(req , res)=>{
  const { patientId, items } = req.body;
  if (!patientId || !items || items.length === 0) {
    throw new ApiError(400, "patientId and items are required");
  }
  const totalAmount = items.reduce((sum, item) => sum + Number(item.cost), 0);
   
  // generate unique invoice number
  const invoiceNumber = "INV-" + Date.now();
   const bill = await Bill.create({
    patientId,
    invoiceNumber,
    items,
    totalAmount,
    createdBy: req.user._id,
  });
   return res
    .status(201)
    .json(new ApiResponse(201, bill, "Bill created successfully"));
});

const getBillsByPatient = asyncHandler(async(req , res)=>{
  const {id} = req.params.patientId;
   const bills = await Bill.find(id)
    .populate("createdBy", "name email role")
    .sort({ createdDate: -1 });
    return res
    .status(200)
    .json(new ApiResponse(200, bills, "Bills fetched successfully"));
});


const  getBillById = asyncHandler(async(req , res)=>{
  const bill = await Bill.findById(req.params.id).populate(
    "createdBy",
    "name email role"
  );
   if (!bill) throw new ApiError(404, "Bill not found");

  return res
    .status(200)
    .json(new ApiResponse(200, bill, "Bill fetched successfully"));
});

const updateBillStatus = asyncHandler(async(req , res)=>{
 const { paymentStatus } = req.body;

  const bill = await Bill.findById(req.params.id);
  if (!bill) throw new ApiError(404, "Bill not found");

  if (!["Pending", "Paid", "Partial"].includes(paymentStatus)) {
    throw new ApiError(400, "Invalid payment status");
  }
 bill.paymentStatus = paymentStatus;
  await bill.save();

  return res
    .status(200)
    .json(new ApiResponse(200, bill, "Bill updated successfully"));
});

const   deleteBill = asyncHandler(async(req , res)=>{
 const bill = await Bill.findById(req.params.id);
  if (!bill) throw new ApiError(404, "Bill not found");

  await bill.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Bill deleted successfully"));
});

const downloadInvoice = asyncHandler(async (req, res) => {
  const billId = req.params.id;
  
  if (!mongoose.Types.ObjectId.isValid(billId)) {
    throw new ApiError(400, "Invalid bill ID format");
  }
  const bill = await Bill.findById(billId)
    .populate("patientId")
    .populate("createdBy", "name email");

  if (!bill) throw new ApiError(404, "Bill not found");


  // Prepare PDF
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // Headers for file download
  const fileName = `${bill.invoiceNumber || "invoice"}_${bill._id}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  // Pipe PDF into response
  doc.pipe(res);

  // Utilities
  const currencyFormatter = (value) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: process.env.CURRENCY_CODE || "INR",
        maximumFractionDigits: 2,
      }).format(Number(value || 0));
    } catch {
      return `₹${Number(value || 0).toFixed(2)}`;
    }
  };

  const formatDate = (d) => {
    const date = d ? new Date(d) : new Date();
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  // Document content
  // 1) Header / Hospital name
  const hospitalName = process.env.HOSPITAL_NAME || "Hospital Management System";
  doc.fontSize(18).text(hospitalName, { align: "center" });
  doc.moveDown(0.3);

  // 2) Invoice Title
  doc.fontSize(14).text("Invoice", { align: "center", underline: true });
  doc.moveDown(0.8);

  // 3) Invoice metadata (left) and patient info (right)
  const leftX = doc.x;
  const rightX = 350;

  // Invoice metadata
  doc.fontSize(10).text(`Invoice No: ${bill.invoiceNumber}`, leftX, doc.y);
  doc.text(`Date: ${formatDate(bill.createdDate || bill.createdAt || new Date())}`);
  doc.text(`Payment Status: ${bill.paymentStatus}`);
  doc.moveDown(0.5);

  // Patient info (right column)
  const patient = bill.patientId || {};
  const patientInfoTop = doc.y - 40;
  doc.fontSize(10).text(`Patient Name: ${patient.name || "-"}`, rightX, patientInfoTop);
  doc.text(`Contact: ${patient.contact || "-"}`, { continued: false, indent: 0, align: "left" });
  doc.text(`Age/Gender: ${patient.age ?? "-"} / ${patient.gender || "-"}`);
  if (patient.address) {
    doc.text(`Address: ${patient.address}`, { width: 200 });
  }
  doc.moveDown(1);

  // 4) Table header for items
  doc.moveTo(leftX, doc.y).lineTo(550, doc.y).stroke();
  doc.fontSize(11).text("Sr", leftX + 2, doc.y + 6, { width: 30 });
  doc.text("Description", leftX + 40, doc.y + 6, { width: 340 });
  doc.text("Amount", rightX + 40, doc.y + 6, { width: 80, align: "right" });
  doc.moveDown(1);
  doc.moveTo(leftX, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  // 5) Items rows
  const items = Array.isArray(bill.items) ? bill.items : [];
  let idx = 1;
  items.forEach((it) => {
    // page break handling
    if (doc.y > 720) {
      doc.addPage();
    }
    doc.fontSize(10).text(String(idx), leftX + 2, doc.y, { width: 30 });
    doc.text(it.description || "-", leftX + 40, doc.y, { width: 340 });
    doc.text(currencyFormatter(it.cost || 0), rightX + 40, doc.y, { width: 80, align: "right" });
    doc.moveDown(0.7);
    idx++;
  });

  // 6) Totals
  doc.moveDown(0.5);
  doc.moveTo(leftX, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
  doc.fontSize(11).text("Subtotal", leftX + 40, doc.y, { continued: true });
  doc.text(currencyFormatter(bill.totalAmount), rightX + 40, doc.y, { width: 80, align: "right" });
  doc.moveDown(0.7);

  // If you have taxes / discounts extend here (example placeholders)
  // doc.text("Tax (0%)", leftX+40, doc.y, {continued: true});
  // doc.text(currencyFormatter(0), rightX+40, doc.y, {width:80, align:'right'});

  doc.moveDown(0.7);
  doc.fontSize(12).text("Total", leftX + 40, doc.y, { continued: true, bold: true });
  doc.text(currencyFormatter(bill.totalAmount), rightX + 40, doc.y, { width: 80, align: "right" });

  doc.moveDown(1.5);

  // 7) Payment info & footer
  doc.fontSize(10).text(`Payment Method: ${bill.paymentMethod || "N/A"}`);
  doc.text(`Generated By: ${bill.createdBy ? bill.createdBy.name : "System"}`);
  doc.moveDown(1);

  doc.fontSize(9).text("Thank you for choosing our hospital. Get well soon!", { align: "center" });

  // finalize PDF
  doc.end();
});

export {
  createBill,
  getBillsByPatient,
  getBillById,
  updateBillStatus,
  deleteBill,
  downloadInvoice
}