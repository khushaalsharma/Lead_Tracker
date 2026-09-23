import { useEffect, useState } from "react";
import LeadForm from "./components/LeadForm";
import LeadList from "./components/LeadList";
import LeadSearch from "./components/LeadSearch";
import { createLead, fetchLeads, updateLeadStatus } from "./api/leadApi";
import { CreateLeadInput, Lead, LeadStatus } from "./types/lead";

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadLeads = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeads(query || undefined);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input so we don't hit the API on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadLeads(search);
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCreate = async (input: CreateLeadInput) => {
    const newLead = await createLead(input);
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    const previous = leads;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await updateLeadStatus(id, status);
    } catch (err) {
      setLeads(previous);
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lead Tracker</h1>
        <p>Create, search, and manage your sales leads.</p>
      </header>

      <LeadForm onSubmit={handleCreate} />

      <div className="card">
        <h2>Leads</h2>
        <LeadSearch value={search} onChange={setSearch} />
        {error && <div className="error-banner">{error}</div>}
        <LeadList leads={leads} loading={loading} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}

export default App;
