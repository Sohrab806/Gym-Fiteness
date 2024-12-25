import express from "express";
import { trainerform } from "../controller/trainer.controller.js";

const router=express();

router.post('/apply',trainerform);
export default router
