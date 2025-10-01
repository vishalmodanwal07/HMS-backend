import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";
import {Bill} from "../models/bill.model.js";

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

export {
  createBill,
  getBillsByPatient,
  getBillById,
  updateBillStatus,
  deleteBill,
}