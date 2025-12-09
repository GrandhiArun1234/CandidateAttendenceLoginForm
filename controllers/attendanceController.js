import Attendance from "../models/Attendance.js";

// =============================
// SUBMIT ATTENDANCE (ONE PER DAY)
// =============================
export const submitAttendance = async (req, res) => {
  try {
    const { candidateId, candidateName, phone, project, date } = req.body;

    if (!candidateId || !candidateName || !phone || !project || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ❗ Check if attendance already exists for this candidate today
    const alreadyExists = await Attendance.findOne({ candidateId, date });

    if (alreadyExists) {
      return res.status(400).json({
        message: "Attendance already submitted today!",
      });
    }

    // Save attendance
    const attendance = await Attendance.create({
      candidateId,
      candidateName,
      phone,
      project,
      date,
    });

    return res.status(201).json({
      message: "Attendance submitted successfully!",
      attendance,
    });

  } catch (error) {
    return res.status(500).json({ 
      message: "Server error", 
      error 
    });
  }
};

// =============================
// GET ALL ATTENDANCE RECORDS
// =============================
export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });

    return res.status(200).json(records);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching records",
      error
    });
  }
};
// =============================
// CHECK IF ATTENDANCE EXISTS (NEW)
// =============================
export const checkAttendance = async (req, res) => {
  try {
    const { candidateId, date } = req.params;

    const exists = await Attendance.findOne({ candidateId, date });

    return res.status(200).json({ exists: !!exists });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};
