import { getCapsules, getCapsuleById, createCapsule, updateCapsuleById, deleteCapsuleById } from "../services/capsuleService.js";

export const getCapsulesController = async (req, res) => {
  try {
    const data = await getCapsules(req.query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching capsules: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCapsuleByIdController = async (req, res) => {
  try {
    const capsule = await getCapsuleById(req.params.id);

    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    res.json(capsule);
  } catch (err) {
    console.error("Error fetching capsule:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCapsuleController = async (req, res) => {
  try {
    const newCapsule = await createCapsule(req.body);
    res.status(201).json(newCapsule);
  } catch (err) {
    console.error("Error inserting capsule:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCapsuleController = async (req, res) => {
  try {
    const updatedCapsule = await updateCapsuleById(req.params.id, req.body);

    if (!updatedCapsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    res.json(updatedCapsule);
  } catch (err) {
    console.error("Error updating capsule:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCapsuleController = async (req, res) => {
  try {
    const wasDeleted = await deleteCapsuleById(req.params.id);

    if (!wasDeleted) {
      return res.status(404).json({ error: "Capsule not found" });
    }

    res.json({ message: "Capsule deleted successfully" });
  } catch (err) {
    console.error("Error deleting capsule:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
