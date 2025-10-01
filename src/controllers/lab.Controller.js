import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";
import {LabReport} from "../models/lab.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";

const uploadReport = asyncHandler(async(req , res)=>{
  const { patientId, reportName, notes } = req.body;
  console.log("Uploaded file:", req.file);
  console.log("Body data:", req.body);

  if (!patientId) throw new ApiError(400, "patientId is required");
  if (!req.file) throw new ApiError(400, "Report file is required");
  const uploaded = await uploadOnCloudinary(req.file.path);
  if (!uploaded) throw new ApiError(500, "Cloudinary upload failed");
    const report = await LabReport.create({
    patientId,
    uploadedBy: req.user._id,
    reportName: reportName || req.file.originalname,
    fileUrl: uploaded.secure_url,
    publicId: uploaded.public_id,
    notes,
    uploadDate: new Date(),
  });
   return res
    .status(201)
    .json(new ApiResponse(201, report, "Lab report uploaded successfully"));

});

const  getReportsByPatient = asyncHandler(async(req , res)=>{
  const reports = await LabReport.find({ patientId: req.params.patientId })
    .populate("uploadedBy", "name email role")
    .sort({ uploadDate: -1 });
     return res
    .status(200)
    .json(new ApiResponse(200, reports, "Reports fetched successfully"));
});

const getReportById = asyncHandler(async(req , res)=>{
   const report = await LabReport.findById(req.params.id).populate(
    "uploadedBy",
    "name email role"
  );
  if (!report) throw new ApiError(404, "Report not found");
   return res
    .status(200)
    .json(new ApiResponse(200, report, "Report fetched successfully"));
});

const  deleteReport = asyncHandler(async(req , res)=>{
  const report = await LabReport.findById(req.params.id);
  if (!report) throw new ApiError(404, "Report not found");

  // Delete from Cloudinary
  if (report.publicId) {
    await cloudinary.uploader.destroy(report.publicId);
  }

  await report.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Report deleted successfully"));
});

export {
     uploadReport,
     getReportsByPatient,
     getReportById,
     deleteReport,
}
