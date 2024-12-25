import express from "express";
import { accept, getapplications, reject, trainerform } from "../controller/trainer.controller.js";

const router=express();

router.post('/apply',trainerform);
router.get('/',getapplications);
router.put('/accept',accept);
router.delete('/reject"',reject);
export default router
