import Candidate from "../models/Candidate.js";

console.log("🔥 candidateController.js Loaded");


// =====================================
// ADD NEW CANDIDATE
// =====================================
export const addCandidate = async (req, res) => {
  console.log("📥 Incoming Body:", req.body);

  try {
    const {
      candidateId,
      name,
      phone,
      password,
      project,
      college,
      location,
      aadhar,
      pan,
      ifsc,
      branch,
      account,
    } = req.body;

    // REQUIRED FIELD CHECK
    if (
      !candidateId ||
      !name ||
      !phone ||
      !password ||
      !project ||
      !college ||
      !location ||
      !aadhar ||
      !pan ||
      !ifsc ||
      !branch ||
      !account
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // VALIDATION CHECKS
    if (!/^\d{10}$/.test(phone)) return res.status(400).json({ message: "Phone must be 10 digits" });
    if (!/^\d{12}$/.test(aadhar)) return res.status(400).json({ message: "Aadhar must be 12 digits" });
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return res.status(400).json({ message: "Invalid PAN format" });
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return res.status(400).json({ message: "Invalid IFSC format" });
    if (account.length < 8) return res.status(400).json({ message: "Account number must be at least 8 digits!" });

    // DUPLICATE CHECK
    const duplicate = await Candidate.findOne({
      $or: [
        { candidateId },
        { phone },
        { aadhar },
        { pan }
      ],
    });

    if (duplicate) {
      return res.status(400).json({ message: "Candidate already registered" });
    }

    // CREATE NEW CANDIDATE
    const candidate = await Candidate.create({
      candidateId,
      name,
      phone,
      password,
      project,
      college,
      location,
      aadhar,
      pan,
      ifsc,
      branch,
      account,
    });

    res.status(201).json({ message: "Candidate added successfully", candidate });
  } catch (error) {
    console.error("🔥 ADD CANDIDATE ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// =====================================
// GET ALL CANDIDATES
// =====================================
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error });
  }
};


// =====================================
// UPDATE CANDIDATE
// =====================================
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      password,
      project,
      college,
      location,
      aadhar,
      pan,
      ifsc,
      branch,
      account,
    } = req.body;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // VALIDATION
    if (!/^\d{10}$/.test(phone)) return res.status(400).json({ message: "Phone must be 10 digits" });
    if (!/^\d{12}$/.test(aadhar)) return res.status(400).json({ message: "Aadhar must be 12 digits" });
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return res.status(400).json({ message: "Invalid PAN format" });
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) return res.status(400).json({ message: "Invalid IFSC format" });
    if (account.length < 8) return res.status(400).json({ message: "Account number must be at least 8 digits" });

    // UPDATE FIELDS
    candidate.name = name ?? candidate.name;
    candidate.phone = phone ?? candidate.phone;
    candidate.project = project ?? candidate.project;

    candidate.college = college ?? candidate.college;
    candidate.location = location ?? candidate.location;
    candidate.aadhar = aadhar ?? candidate.aadhar;
    candidate.pan = pan ?? candidate.pan;
    candidate.ifsc = ifsc ?? candidate.ifsc;
    candidate.branch = branch ?? candidate.branch;
    candidate.account = account ?? candidate.account;

    if (password) candidate.password = password; // Will hash automatically

    await candidate.save();

    res.json({ message: "Candidate updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error });
  }
};


// =====================================
// DELETE CANDIDATE
// =====================================
export const deleteCandidate = async (req, res) => {
  try {
    const candidateId = req.params.id;

    const deleted = await Candidate.findByIdAndDelete(candidateId);

    if (!deleted) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// =====================================
// GET SINGLE CANDIDATE BY candidateId
// =====================================
export const getSingleCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      candidateId: req.params.candidateId,
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
