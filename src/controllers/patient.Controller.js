import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";
import { Patient } from "../models/patient.model.js";

const createPatient = asyncHandler(async(req , res)=>{
 const {name , age , gender , contact , assignedDoctor}=req.body;
 if (!name || !gender || !contact) {
    throw new ApiError(400, "Name, gender, and contact are required");
  }
   const patient = await Patient.create({
    name,
    age,
    gender,
    contact,
    assignedDoctor: assignedDoctor || null,
    createdBy: req.user._id
  });
  return res
    .status(201)
    .json(new ApiResponse(201, patient, "Patient created successfully"));
});


//list patients with pagination 
const getPatients = asyncHandler(async(req , res)=>{
    const { page = 1, limit = 10, q, doctor } = req.query;
    const filter = {};
  if (q) filter.$text = { $search: q };
  if (doctor) filter.assignedDoctor = doctor;
  const total = await Patient.countDocuments(filter);
  const patients = await Patient.find(filter)
    .populate("assignedDoctor", "name email")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
    return res
    .status(200)
    .json(new ApiResponse(200, { total, page, limit, patients }, "Patients fetched successfully"));
});
 

const   getPatientById = asyncHandler(async(req , res)=>{
    const {id} = req.params.id;
    const patient = await Patient.findById(id).populate("assignedDoctor", "name" , "email");
    if (!patient) throw new ApiError(404, "Patient not found");
    return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient fetched successfully"));
});

const  updatePatient = asyncHandler(async(req , res)=>{
    const {id} =  req.params.id;
    const { name, age, gender, contact, assignedDoctor } = req.body;
    const patient = await Patient.findByIdAndUpdate(
     id,
    { name, age, gender, contact, assignedDoctor },
    { new: true }
  );
  if (!patient) throw new ApiError(404, "Patient not found");
  return res
  .status(200)
  .json(new ApiResponse(200, patient, "Patient updated successfully"));
});

const  assignDoctor = asyncHandler(async(req , res)=>{
      const {id} = req.params.id;
      const { doctorId } = req.body;
      if (!doctorId) throw new ApiError(400, "DoctorId is required");
       const patient = await Patient.findByIdAndUpdate(
     id,
    { assignedDoctor: doctorId },
    { new: true }
  );
   if (!patient) throw new ApiError(404, "Patient not found");
   return res
   .status(200)
   .json(new ApiResponse(200, patient, "Doctor assigned successfully"));
});

const  deletePatient = asyncHandler(async(req , res)=>{
    const {id} = req.params.id;
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) throw new ApiError(404, "Patient not found");
    return res.status(200).json(new ApiResponse(200, null, "Patient deleted successfully"));
});

export {  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  assignDoctor,
  deletePatient}