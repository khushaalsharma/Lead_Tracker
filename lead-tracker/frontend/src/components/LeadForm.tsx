import { FormEvent, useState } from "react";
import { CreateLeadInput, LeadInputPayload } from "../types/lead";

interface Props {
  onSubmit: (input: LeadInputPayload) => Promise<void>;
}

const EMPTY_FORM: LeadInputPayload = { name: "", email: "", phone: "", ext: "" };

function LeadForm({ onSubmit }: Props) {
  const [form, setForm] = useState<LeadInputPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof LeadInputPayload) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if(!form.phone || form.phone.length !== 10){
        window.alert("Phone number must be 10 digits!");
      }else{
        await onSubmit(form);
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>New Lead</h2>
      {error && <div className="error-banner">{error}</div>}
      <div className="form-grid">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="jane@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="ext">Ext</label>
          <input
            id="ext"
            value={form.ext}
            onChange={handleChange("ext")}
            placeholder="+91"
          />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="98765 43210"
            required
          />
        </div>
        <div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Lead"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default LeadForm;
