import express from "express";
import { allcourse, approve, create, pending } from "../controller/course.controller.js";
import { reject } from "../controller/trainer.controller.js";
const router=express();

router.post('/create',create)
router.get('/pending',pending)
router.put('/approve',approve)
router.put('/reject',reject)
router.get('/approved',allcourse)
export default router