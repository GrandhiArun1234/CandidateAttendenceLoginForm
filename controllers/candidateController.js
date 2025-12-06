import Candidate from "../models/Candidate.js";

console.log("🔥 candidateController.js Loaded");

// ================================
// ADD NEW CANDIDATE
// ================================
export const addCandidate = async (req, res) => {
  console.log("📥 Incoming Body:", req.body);

  try {
    const { candidateId, name, phone, password, project } = req.body;

    console.log("🔍 Checking required fields...");

    if (!candidateId || !name || !phone || !password || !project) {
      console.log("❌ Missing field detected");
      return res.status(400).json({ message: "All fields required" });
    }

    console.log("🔎 Checking duplicates for:", { candidateId, phone });

    const exists = await Candidate.findOne({
      $or: [{ phone }, { candidateId }],
    });

    console.log("🟡 Duplicate Result:", exists);

    if (exists) {
      console.log("❌ Duplicate candidate found");
      return res.status(400).json({ message: "Candidate already exists" });
    }

    console.log("🟢 Creating new candidate...");

    const candidate = await Candidate.create({
      candidateId,
      name,
      phone,
      password,
      project,
    });

    console.log("✅ Candidate Created:", candidate);

    res.status(201).json({ message: "Candidate added", candidate });
  } catch (error) {
    console.error("🔥 ADD CANDIDATE ERROR:", error.message);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ================================
// GET ALL CANDIDATES
// ================================
export const getCandidates = async (req, res) => {
  console.log("📥 Fetching all candidates...");

  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });

    console.log("📤 Candidates sent:", candidates.length);

    res.status(200).json(candidates);
  } catch (error) {
    console.error("🔥 GET CANDIDATES ERROR:", error.message);

    res.status(500).json({
      message: "Error fetching candidates",
      error: error.message,
    });
  }
};

// ================================
// UPDATE CANDIDATE
// ================================
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, password, project } = req.body;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Update fields
    if (name) candidate.name = name;
    if (phone) candidate.phone = phone;
    if (project) candidate.project = project;

    // If password changed, re-hash
    if (password) candidate.password = password; // pre-save hook will hash it

    await candidate.save();

    res.json({ message: "Candidate updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error });
  }
};



export const deleteCandidate = async (req, res) => {
  try {
    const candidateId = req.params.id;

    const deleted = await Candidate.findByIdAndDelete(candidateId);

    if (!deleted) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate deleted successfully" });

  } catch (error) {
    console.error("🔥 DELETE CANDIDATE ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
