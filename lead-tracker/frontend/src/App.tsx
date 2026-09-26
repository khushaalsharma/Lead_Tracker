import { useEffect, useState } from "react";
import LeadForm from "./components/LeadForm";
import LeadList from "./components/LeadList";
import LeadSearch from "./components/LeadSearch";
import { createLead, fetchLeads, updateLeadStatus } from "./api/leadApi";
import { CreateLeadInput, Lead, LeadInputPayload, LeadStatus } from "./types/lead";

const PAGE_SIZE = 10;

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadLeads = async (query: string, requestedPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeads(requestedPage, PAGE_SIZE, query || undefined);
      setLeads(data.leads);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input so we don't hit the API on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadLeads(search, page);
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = async (input: LeadInputPayload) => {
    const lead: CreateLeadInput = {
      name: input.name,
      email: input.email,
      phone:
        !input.ext || input.ext === ""
          ? `+91 ${input.phone}`
          : `${input.ext} ${input.phone}`,
    };
    await createLead(lead);
    setPage(1);
    await loadLeads(search, 1);
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
        <LeadSearch value={search} onChange={handleSearchChange} />
        {error && <div className="error-banner">{error}</div>}
        <LeadList leads={leads} loading={loading} onStatusChange={handleStatusChange} />
        {!loading && (
          <div className="pagination" aria-label="Lead pagination">
            <span>
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
              {Math.min(page * PAGE_SIZE, total)} of {total}
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page * PAGE_SIZE >= total}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
