import Candidate from "../models/Candidate.js";
import bcrypt from "bcryptjs";

export const loginUser = async (req, res) => {
  try {
    const { idOrPhone, password } = req.body;

    // Admin Login
    if (idOrPhone === "admin" && password === "admin789") {
      return res.status(200).json({
        message: "Admin login successful",
        type: "admin",
        name: "Admin",
        id: "admin",
      });
    }

    // Candidate login using ID or Phone
    const candidate = await Candidate.findOne({
      $or: [{ candidateId: idOrPhone }, { phone: idOrPhone }],
    });

    if (!candidate) {
      return res.status(400).json({ message: "User not found" });
    }

    // Password check
    const valid = await bcrypt.compare(password, candidate.password);

    if (!valid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      message: "Login Successful",
      type: "candidate",
      name: candidate.name,
      id: candidate.candidateId,
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
