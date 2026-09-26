export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "WON";

export const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "LOST",
  "WON",
];

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
}

export interface LeadInputPayload {
  name: string;
  email: string;
  phone: string;
  ext: string;
}
