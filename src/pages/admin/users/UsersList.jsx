import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/GlobalContext";

const roleColors = {
  admin: "bg-blue-500 text-white",
  user: "bg-green-500 text-white",
  editor: "bg-yellow-500 text-black",
};

const UsersList = () => {
  const { user } = useContext(GlobalContext); // Admin token
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("User not logged in");

      const { data } = await axios.get("http://localhost:3000/api/auth/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data && Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch users"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("User not logged in");

      console.log(id)
      await axios.delete(`http://localhost:3000/api/auth/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted user from state
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || err.message || "Failed to delete user");
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!users.length) return <div>No users found</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b border-gray-200 text-left text-sm text-gray-500">#</th>
            <th className="p-2 border-b border-gray-200 text-left text-sm text-gray-500">Name</th>
            <th className="p-2 border-b border-gray-200 text-left text-sm text-gray-500">Email</th>
            <th className="p-2 border-b border-gray-200 text-left text-sm text-gray-500">Role</th>
            <th className="p-2 border-b border-gray-200 text-left text-sm text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="p-2 text-gray-400 text-sm">{idx + 1}</td>
              <td className="p-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                  {u.fullName?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="font-medium text-gray-800">{u.fullName}</span>
              </td>
              <td className="p-2 text-gray-700 text-sm">{u.email}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    roleColors[u.role] || "bg-gray-300 text-gray-800"
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td className="p-2 flex gap-3">
                <button
                  onClick={() => handleDelete(u._id)}
                  className="px-3 py-1 border border-red-400 text-red-600 rounded hover:bg-red-50 transition-colors text-sm cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
