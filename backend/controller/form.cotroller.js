import { Form } from "../models/from.model.js"
import { formDetail } from "../models/formDeatial.model.js";

import { ApiResponse } from "../utils/apiResponse.js";
import expressError from "../utils/expressError.js";

const formAddcontroller = async(req,res)=>{
  let formData = req.body;
  console.log(formData);              
  if(!formData){
    throw new expressError(400, "Data not available")
  }
  let newForm = await Form.create(formData); 
  res.status(201).json(
    new ApiResponse(200, newForm, " Form added succesfully")
)
};

const formSubmit = async(req,res)=>{
  let form = await formDetail.create({
   user: req.user._id,
  });
  console.log(form);
  res.send("done");
}



export{formAddcontroller,formSubmit}