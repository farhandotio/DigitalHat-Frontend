// src/pages/account/Settings.jsx
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "../../api/axiosConfig";

export default function Settings() {
  const { user = {}, reloadProfile } = useOutletContext();
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const onSave = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    setMsg("");
    try {
      await axios.put("/api/user/profile", form);
      setMsg("Profile updated.");
      reloadProfile();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Account Settings
      </h1>
      <form onSubmit={onSave} className="space-y-4 max-w-md">
        <div>
          <label className="text-sm text-gray-600">Full name</label>
          <input
            value={form.fullName}
            onChange={(e) =>
              setForm((s) => ({ ...s, fullName: e.target.value }))
            }
            className="w-full p-3 border  "
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            className="w-full p-3 border  "
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={saving}
            className="px-4 py-2 bg-orange-500 text-white  "
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          {msg && <div className="text-sm text-gray-600">{msg}</div>}
        </div>
      </form>
    </div>
  );
}
