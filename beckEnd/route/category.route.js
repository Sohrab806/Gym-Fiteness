import express from "express";
import { getCate } from "../controller/category.controller.js";

const router=express();

router.post('/match',getCate)
export default router