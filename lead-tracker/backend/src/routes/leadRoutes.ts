import { Router } from "express";
import {
  handleCreateLead,
  handleGetLead,
  handleListLeads,
  handleUpdateLeadStatus,
} from "../controllers/leadController";
import { validateCreateLead, validateStatusUpdate } from "../middleware/validateLead";

const router = Router();

// GET /api/leads           -> list all leads
// GET /api/leads?q=term    -> search leads by name/email/phone/status
router.get("/", handleListLeads);

// GET /api/leads/:id
router.get("/:id", handleGetLead);

// POST /api/leads
router.post("/", validateCreateLead, handleCreateLead);

// PATCH /api/leads/:id/status
router.patch("/:id/status", validateStatusUpdate, handleUpdateLeadStatus);

export default router;
