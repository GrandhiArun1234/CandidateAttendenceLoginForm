import Attendance from "../models/Attendance.js";

export const submitAttendance = async (req, res) => {
  try {
    const { candidateId, candidateName, phone, project, date } = req.body;

    if (!candidateId || !candidateName || !phone || !project || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newAttendance = new Attendance({
      candidateId,
      candidateName,
      phone,
      project,
      date,
    });

    await newAttendance.save();

    res.status(200).json({ message: "Attendance stored successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find().sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
};
