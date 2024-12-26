import express from "express";
import { accept, getapplications, gettrainers, reject, trainerform, update } from "../controller/trainer.controller.js";

const router=express();

router.post('/apply',trainerform);
router.post('/fire',update);
router.get('/',getapplications);
router.get('/gettrainers',gettrainers);
router.put('/accept',accept);
router.delete('/reject"',reject);
export default router
