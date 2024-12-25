import express from "express";
import {  addworkoutuser,createWorkout, deletexcercise, getworkout, userworkout } from "../controller/excercise.controller.js";
const router=express();

router.get('/',getworkout)
router.post('/',createWorkout)
router.put('/',addworkoutuser)

router.get('/userworkout',userworkout)
router.delete('/:id',deletexcercise)
export default router