import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
addressLine:{
    type: String,
    required: true
},
pinCode:{
    type: Number,
    required: true
},
distic:{
    type: String,
    required: true
},
tehshil:{
    type: String,
    required: true
},
user:{
    
}
},{timestamps: true})


export const Address = mongoose.model("Address", addressSchema);