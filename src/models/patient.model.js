import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    age : Number,
    gender : {
         type: String,
         enum: ['Male','Female','Other']
    },
    contact : {
        type: String,
        index : true
    },
    assignedDoctor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy : {
         type: mongoose.Schema.Types.ObjectId,
         ref : 'User'
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
} ,
    {timestamps : true}
);

// For searching by name/contact
PatientSchema.index({ name: 'text',
                     contact: 'text' });

export const Patient = mongoose.model('Patient' , PatientSchema);
