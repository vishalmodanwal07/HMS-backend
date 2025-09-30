import mongoose, {  Schema } from "mongoose";

const BillSchema = new Schema({
     patientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Patient',
          required: true
         },
     invoiceNumber : {
        type : String,
        unique : true
        },
     items: [
       { description: String, cost: Number }
       ],  
     totalAmount: { 
         type: Number,
         required: true
       },
    paymentStatus: {
         type: String, 
         enum: ['Pending','Paid','Partial'], 
         default: 'Pending' 
        }, 
}, {
    timestamps : true
});

export const Bill = mongoose.model('Bill' , BillSchema);