import express from "express";
import {getCapsulesController, getCapsuleByIdController, createCapsuleController, updateCapsuleController, deleteCapsuleController} from "../controllers/capsuleController.js";
import validateCapsule from "../middlewares/validateCapsule.js";

const router = express.Router();

router.get("/", getCapsulesController);
router.get("/:id", getCapsuleByIdController);
router.post("/", validateCapsule, createCapsuleController);
router.put("/:id", validateCapsule, updateCapsuleController);
router.delete("/:id", deleteCapsuleController);

export default router;
