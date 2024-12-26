import express from "express";
import { create } from "../controller/course.controller.js";
const router=express();

router.post('/create',create)
export default router