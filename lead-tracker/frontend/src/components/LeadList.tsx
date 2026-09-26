import { Lead, LEAD_STATUSES, LeadStatus } from "../types/lead";
import StatusBadge from "./StatusBadge";

interface Props {
  leads: Lead[];
  loading: boolean;
  onStatusChange: (id: string, status: LeadStatus) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function LeadList({ leads, loading, onStatusChange }: Props) {
  if (loading) {
    return <div className="empty-state">Loading leads...</div>;
  }

  if (leads.length === 0) {
    return <div className="empty-state">No leads found.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Created</th>
          <th>Update</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td>{lead.name}</td>
            <td>{lead.email}</td>
            <td>{lead.phone}</td>
            <td>
              <StatusBadge status={lead.status} />
            </td>
            <td>{formatDate(lead.created_at)}</td>
            <td>
              <select
                value={lead.status}
                onChange={(e) =>
                  onStatusChange(lead.id, e.target.value as LeadStatus)
                }
              >
                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeadList;
