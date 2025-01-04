import express from "express";
import { showstatistic, state } from "../controller/exercisestate.controller.js";

const router=express();

router.post('/save',state)
router.get('/statistics',showstatistic)
export default router