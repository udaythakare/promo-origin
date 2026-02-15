"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateInvestmentModal from "../components/CreateInvestmentModal";

export default function CreateInvestmentClient({ vendors, onCreated }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="
          flex items-center justify-center gap-2
          bg-green-600 text-white
          px-5 py-2.5
          rounded-xl
          font-medium
          shadow-md
          transition-all duration-200
          hover:bg-green-700 hover:shadow-lg
          active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-green-400
          w-full sm:w-auto
        "
      >
        <Plus size={18} />
        <span>Add New Investment</span>
      </button>

      {/* Modal */}
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
