"use client";

import { useState } from "react";
import { updateBusinessInfo } from "@/actions/businessInfoAction";

export default function BusinessInfoForm({ businessInfo = {} }) {
  const [formData, setFormData] = useState(businessInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateBusinessInfo(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update business info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Business Info</h2>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="space-y-4">
        <input
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border p-2 rounded"
          placeholder="Business Name"
        />

        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border p-2 rounded"
          placeholder="Description"
        />
      </div>

      {isEditing && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      )}
    </div>
  );
}
