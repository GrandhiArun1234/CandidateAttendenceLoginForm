import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  candidateName: { type: String, required: true },
  phone: { type: String, required: true },
  project: { type: String, required: true },
  date: { type: String, required: true },
});

export default mongoose.model("Attendance", AttendanceSchema);
