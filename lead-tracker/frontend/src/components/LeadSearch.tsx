import { ChangeEvent } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function LeadSearch({ value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name, email, phone, or status..."
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export default LeadSearch;
