import mongoose, { Schema }  from "mongoose";

const formSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    startdate:{
        type: String,
        required: true
    }, 
     eligibility:{
        type: String,
        required: true
    },
    notice:{
        type: String, //from cloudinry
        required: true
    },
    price:{
        type: Number,
        required: true
    }
},{timestamps: true});



export const Form = mongoose.model("Form", formSchema);