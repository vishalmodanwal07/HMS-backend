import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";
import {TreatmentRecord} from "../models/treatmentRecord.model.js";

const createTreatmentRecord = asyncHandler(async(req , res)=>{
  const { patientId, diagnosis, medication, date } = req.body;
  if (!patientId) throw new ApiError(400, "PatientId is required");
  const treatment = await TreatmentRecord.create({
    patientId,
    doctorId: req.user._id, // doctor comes from token
    diagnosis,
    medication,
    date: date || Date.now()
  });
   return res
    .status(201)
    .json(new ApiResponse(201, treatment, "Treatment record created successfully"));
});

const getTreatmentsByPatient = asyncHandler(async(req , res)=>{
 const { patientId } = req.params;
 const treatments = await TreatmentRecord.find({ patientId })
    .populate("doctorId", "name email role")
    .sort({ date: -1 });
 return res
    .status(200)
    .json(new ApiResponse(200, treatments, "Treatment records fetched successfully"));

});

const getTreatmentById = asyncHandler(async(req , res)=>{
const {id} = req.params.id;
const treatment = await TreatmentRecord.findById(id).populate("doctorId", "name email");
 if (!treatment) throw new ApiError(404, "Treatment record not found");
   return res
    .status(200)
    .json(new ApiResponse(200, treatment, "Treatment record fetched successfully"));
});

const updateTreatment = asyncHandler(async(req , res)=>{
 const { diagnosis, medication, date } = req.body;
 const treatment = await TreatmentRecord.findById(req.params.id);
 if (!treatment) throw new ApiError(404, "Treatment record not found");
  // only creator doctor or admin can update
  if (treatment.doctorId.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
    throw new ApiError(403, "Not authorized to update this treatment");
  }
   treatment.diagnosis = diagnosis || treatment.diagnosis;
  treatment.medication = medication || treatment.medication;
  treatment.date = date || treatment.date;
  await treatment.save();
   return res
    .status(200)
    .json(new ApiResponse(200, treatment, "Treatment updated successfully"));
});

const deleteTreatment = asyncHandler(async(req , res)=>{
   const treatment = await TreatmentRecord.findById(req.params.id);
  if (!treatment) throw new ApiError(404, "Treatment record not found");

  await treatment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Treatment deleted successfully"));
});

export {
  createTreatmentRecord,
  getTreatmentsByPatient,
  getTreatmentById,
  updateTreatment,
  deleteTreatment
};
