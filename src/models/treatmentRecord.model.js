import mongoose, { mongo, Schema } from "mongoose";

const TreatmentSchema = new Schema({
    patientId : {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Patient', 
         required: true 
    },
    doctorId: { 
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true 
    },
    diagnosis: String,
    medication: String,
    date : {
        type : Date,
        deafult : Date.now
    }
},
    {timestamps : true}
)

export const TreatmentRecord = mongoose.model('TreatmentRecord' , TreatmentSchema);