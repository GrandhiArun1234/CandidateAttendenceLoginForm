import express from "express";
import { submitAttendance, getAllAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/", submitAttendance);
router.get("/", getAllAttendance);

export default router;
