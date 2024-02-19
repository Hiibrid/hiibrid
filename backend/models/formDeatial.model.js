
import mongoose, { Schema } from "mongoose";

const formdetail  = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    formName:{
      type: Schema.Types.ObjectId,
      ref:"Form"
    }
},{timestamps: true})

export const formDetail = mongoose.model("formDetail", formdetail)