import { NextFunction, Request, Response } from "express";
import { LEAD_STATUSES } from "../models/lead";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export function validateCreateLead(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { name, email, phone, status } = req.body ?? {};
  const errors: string[] = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("name is required and must be at least 2 characters");
  }
  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    errors.push("a valid email is required");
  }
  if (!phone || typeof phone !== "string" || !PHONE_REGEX.test(phone)) {
    errors.push("a valid phone number is required");
  }
  if (status !== undefined && !LEAD_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${LEAD_STATUSES.join(", ")}`);
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateStatusUpdate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { status } = req.body ?? {};

  if (!status || !LEAD_STATUSES.includes(status)) {
    res
      .status(400)
      .json({ errors: [`status must be one of: ${LEAD_STATUSES.join(", ")}`] });
    return;
  }

  next();
}
