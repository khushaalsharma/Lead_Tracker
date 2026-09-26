import { LeadStatus } from "../types/lead";

interface Props {
  status: LeadStatus;
}

function StatusBadge({ status }: Props) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}

export default StatusBadge;
