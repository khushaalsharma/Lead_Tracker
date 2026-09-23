import pool from "../config/db";

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "WON";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  created_at: string;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
}

export const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "LOST",
  "WON",
];

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const { name, email, phone, status = "NEW" } = input;
  const result = await pool.query<Lead>(
    `INSERT INTO leads (name, email, phone, status)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, phone, status, created_at`,
    [name, email, phone, status]
  );
  return result.rows[0];
}

export async function listLeads(): Promise<Lead[]> {
  const result = await pool.query<Lead>(
    `SELECT id, name, email, phone, status, created_at
     FROM leads
     ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function searchLeads(query: string): Promise<Lead[]> {
  const result = await pool.query<Lead>(
    `SELECT id, name, email, phone, status, created_at
     FROM leads
     WHERE LOWER(name) LIKE LOWER($1)
        OR LOWER(email) LIKE LOWER($1)
        OR phone LIKE $1
        OR status::text = UPPER($2)
     ORDER BY created_at DESC`,
    [`%${query}%`, query]
  );
  return result.rows;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const result = await pool.query<Lead>(
    `SELECT id, name, email, phone, status, created_at FROM leads WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead | null> {
  const result = await pool.query<Lead>(
    `UPDATE leads SET status = $2 WHERE id = $1
     RETURNING id, name, email, phone, status, created_at`,
    [id, status]
  );
  return result.rows[0] ?? null;
}
