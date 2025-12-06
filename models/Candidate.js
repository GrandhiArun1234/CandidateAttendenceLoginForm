import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const candidateSchema = new mongoose.Schema(
  {
    candidateId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔐 FIXED: Encrypt Password Before Saving (NO next)
candidateSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("Candidate", candidateSchema);
