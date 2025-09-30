import mongoose, {  Schema } from "mongoose";

const LabReportSchema = new Schema({
     patientId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Patient', 
         required: true },
     uploadedBy: { 
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true }, // Lab staff 
     uploadDate: { 
          type: Date,
          default: Date.now 
        },
     reportName: String,  
     fileUrl: String,     // Cloudinary secure URL
     publicId: String,    // Cloudinary unique file ID  
} ,
     {timestamps : true});

// For quick lookup by patient
LabReportSchema.index({ patientId: 1, uploadDate: -1 });

export const LabReport = mongoose.model('LabReport' , LabReportSchema) ;