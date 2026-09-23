import { CreateLeadInput, Lead, LeadStatus } from "../types/lead";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:4000/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      body.errors?.join(", ") || body.error || `Request failed with ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}

export async function fetchLeads(query?: string): Promise<Lead[]> {
  const url = query
    ? `${API_BASE_URL}/leads?q=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/leads`;
  const res = await fetch(url);
  return handleResponse<Lead[]>(res);
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const res = await fetch(`${API_BASE_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<Lead>(res);
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead> {
  const res = await fetch(`${API_BASE_URL}/leads/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Lead>(res);
}
