import { Request, Response, NextFunction } from "express";
import {
  createLead,
  getLeadById,
  listLeads,
  updateLeadStatus,
} from "../models/lead";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

function positiveInteger(value: unknown, fallback: number, maximum?: number): number {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return fallback;
  }

  const parsed = Number(value);
  if (parsed < 1) {
    return fallback;
  }

  return maximum ? Math.min(parsed, maximum) : parsed;
}

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
    const { q, page, pageSize } = req.query;
    const currentPage = positiveInteger(page, 1);
    const currentPageSize = positiveInteger(pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const query = typeof q === "string" && q.trim().length > 0 ? q.trim() : undefined;
    const leads = await listLeads(currentPage, currentPageSize, query);
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
