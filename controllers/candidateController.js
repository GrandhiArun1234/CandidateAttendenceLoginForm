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

    // FORMAT VALIDATION
    if (!/^\d{10}$/.test(phone))
      return res.status(400).json({ message: "Phone must be 10 digits" });

    if (!/^\d{12}$/.test(aadhar))
      return res.status(400).json({ message: "Aadhar must be 12 digits" });

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan))
      return res.status(400).json({ message: "Invalid PAN format" });

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc))
      return res.status(400).json({ message: "Invalid IFSC format" });

    if (account.length < 8)
      return res.status(400).json({ message: "Account must be at least 8 digits" });

    // 🔥 DUPLICATE CHECK (ALL REQUIRED FIELDS)
    const duplicate = await Candidate.findOne({
      $or: [
        { candidateId },
        { phone },
        { aadhar },
        { pan },
        { account },
      ],
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Duplicate found: ID, Phone, Aadhar, PAN or Account exists",
      });
    }

    // CREATE NEW CANDIDATE
    const candidate = await Candidate.create(req.body);

    res.status(201).json({ message: "Candidate added successfully", candidate });
  } catch (error) {
    console.error("🔥 ADD CANDIDATE ERROR:", error);

    // MongoDB unique error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }

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

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

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

    // FORMAT VALIDATION
    if (phone && !/^\d{10}$/.test(phone))
      return res.status(400).json({ message: "Phone must be 10 digits" });

    if (aadhar && !/^\d{12}$/.test(aadhar))
      return res.status(400).json({ message: "Aadhar must be 12 digits" });

    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan))
      return res.status(400).json({ message: "Invalid PAN format" });

    if (ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc))
      return res.status(400).json({ message: "Invalid IFSC format" });

    if (account && account.length < 8)
      return res.status(400).json({ message: "Account must be at least 8 digits" });

    // 🔥 DUPLICATE CHECK ON UPDATE (EXCLUDE SELF)
    const duplicate = await Candidate.findOne({
      _id: { $ne: id },
      $or: [
        { phone },
        { aadhar },
        { pan },
        { account },
      ],
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ message: "Duplicate data already exists for another candidate" });
    }

    // UPDATE FIELDS
    Object.assign(candidate, req.body);

    await candidate.save();

    res.json({ message: "Candidate updated successfully" });
  } catch (error) {
    console.error("UPDATE ERROR:", error.message);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }

    res.status(500).json({ message: "Error updating candidate", error });
  }
};

// =====================================
// DELETE CANDIDATE
// =====================================
export const deleteCandidate = async (req, res) => {
  try {
    const deleted = await Candidate.findByIdAndDelete(req.params.id);

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
