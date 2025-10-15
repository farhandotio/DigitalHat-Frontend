// src/pages/account/Addresses.jsx
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "../../api/axiosConfig";

export default function Addresses() {
  const { addresses = [], reloadAddresses } = useOutletContext();
  const [local, setLocal] = useState(addresses || []);

  const removeAddress = async (id) => {
    try {
      await axios.delete(`/api/addresses/${id}`);
      setLocal((p) => p.filter((a) => a._id !== id && a.id !== id));
      reloadAddresses();
    } catch (err) {
      console.error("Failed to remove address", err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Addresses</h1>

      {local?.length ? (
        <div className="space-y-4">
          {local.map((a) => (
            <div
              key={a._id || a.id}
              className="p-4 bg-white    shadow-sm border"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{a.fullName || a.name}</p>
                  <p className="text-sm text-gray-500">{a.phone}</p>
                  <p className="text-sm text-gray-500">
                    {[a.street, a.city, a.postalCode, a.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeAddress(a._id || a.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">You have no saved addresses.</div>
      )}
    </div>
  );
}
