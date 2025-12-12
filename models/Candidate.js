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

    college: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    aadhar: {
      type: String,
      required: true,
      unique: true,
      minlength: 12,
      maxlength: 12,
    },

    pan: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 10,
      maxlength: 10,
    },

    ifsc: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 11,
      maxlength: 11,
      // ❌ DO NOT MAKE UNIQUE
    },

    branch: {
      type: String,
      required: true,
    },

    account: {
      type: String,
      required: true,
      minlength: 8,
      unique: true,   // ✅ Add this so duplicate accounts are not allowed
    },
  },
  { timestamps: true }
);

// HASH PASSWORD BEFORE SAVE
candidateSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// HASH PASSWORD BEFORE UPDATE
candidateSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
});

export default mongoose.model("Candidate", candidateSchema);
