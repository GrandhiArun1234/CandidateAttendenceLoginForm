import express from "express";
import Attendance from "../models/Attendance.js";
import { submitAttendance, getAllAttendance, checkAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/", submitAttendance);
router.get("/", getAllAttendance);

// NEW ROUTE
router.get("/check/:candidateId/:date", checkAttendance);

router.get("/candidate/:candidateId", async (req, res) => {
  try {
    const { candidateId } = req.params;
    const records = await Attendance.find({ candidateId }).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidate attendance" });
  }
});





export default router;
