import { Router } from "express";
import mongoose from "mongoose";


let router = Router();

router.route("/").get((req,res)=>{
    res.send("done")
})

export default router;