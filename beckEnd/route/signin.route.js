import express from "express";
import { signin } from "../controller/signin.controller.js";
import { getusers } from "../controller/signin.controller.js";
const router=express();

router.post('/',signin)
router.get('/',getusers)
export default router