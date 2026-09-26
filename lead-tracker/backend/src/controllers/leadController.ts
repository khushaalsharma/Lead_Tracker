import { Request, Response, NextFunction } from "express";
import {
  createLead,
  getLeadById,
  listLeads,
  searchLeads,
  updateLeadStatus,
} from "../models/lead";

export async function handleCreateLead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const lead = await createLead(req.body);
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
}

export async function handleListLeads(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { q } = req.query;
    const leads =
      typeof q === "string" && q.trim().length > 0
        ? await searchLeads(q.trim())
        : await listLeads();
    res.json(leads);
  } catch (err) {
    next(err);
  }
}

export async function handleGetLead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.json(lead);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateLeadStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const lead = await updateLeadStatus(req.params.id, req.body.status);
    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.json(lead);
  } catch (err) {
    next(err);
  }
}
