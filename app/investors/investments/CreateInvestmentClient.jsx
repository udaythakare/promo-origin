"use client";

import { useState } from "react";
import CreateInvestmentModal from "../components/CreateInvestmentModal";

export default function CreateInvestmentClient({ vendors, onCreated }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        + Add New Investment
      </button>

      {open && (
        <CreateInvestmentModal
          vendors={vendors}
          onClose={() => setOpen(false)}
          onCreated={onCreated}
        />
      )}
    </>
  );
}
