import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  insertUser,
  updateUser,
  deleteUser,
  fetchRole,
  resetPassword,
  updatePassword,
} from "../../redux/Slices/UsersSlice";
import { Search, Shield, Trash2, Edit, ChevronDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleCell from "../common/ToggleCell";
import Pagination from "../common/Pagination";

export default function User() {
  const dispatch = useDispatch();
  const { users, role, loading } = useSelector((state) => state.users);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    password: "",
    password_confirmation: "",
    role_id: "",
  });

  // New state for password forms
  const [mode, setMode] = useState("form"); // "form" | "changePassword" | "forgotPassword"
  const [old_password, setold_password] = useState("");
  const [new_password, setnew_password] = useState("");
  const [new_password_confirmation, setnew_password_confirmation] = useState("");

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchRole());
  }, [dispatch]);

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
      const [searching, setSearching] = useState("");
      const [page, setPage] = useState(1);
      const limit =5;
      const totalPages = Math.ceil(filteredUsers.length / limit);
      const startIndex = (page - 1) *  limit;
      const currentData =filteredUsers.slice(startIndex, startIndex + limit);
    
      useEffect(() => {
        setPage(1);
      }, [searching]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile_no: "",
      password: "",
      password_confirmation: "",
      role_id: "",
    });
    setEditData(null);
    setMode("form");
    setold_password("");
    setnew_password("");
   setnew_password_confirmation("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editData) {
        await dispatch(insertUser(formData)).unwrap();
        toast.success("User added successfully! 🎉");
      } else {
        await dispatch(updateUser({ id: editData.id, payload: formData })).unwrap();
        toast.success("User updated successfully! 🎉");
      }
      resetForm();
      setShowForm(false);
      dispatch(fetchUser());
    } catch (error) {
      console.error("Update error:", error);
      toast.error(editData ? "Update failed 🚫" : "Add failed 🚫");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User deleted successfully! 🗑️");
      dispatch(fetchUser());
    } catch {
      toast.error("Delete failed 🚫");
    }
    setDeleteId(null);
  };

  // Auto-fill edit form
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        email: editData.email || "",
        mobile_no: editData.mobile_no || "",
        password: "",
        password_confirmation: "",
        role_id: editData.role_id || "",
      });
    }
  }, [editData]);

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
   

     <div className="  bg-gradient-to-r from-blue-500 to-blue-600 gap-2 rounded-b-none rounded-lg  md:px-4 md:py-8 py-4 border-collapse">
        <div className="flex px-4 flex-row justify-between sm:items-center ">
          <div className="flex justify-items-center gap-3">
            <div className="bg-blue-400  flex items-center justify-center rounded-xl border border-blue-300 p-2">
              <Shield size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl  sm:text-2xl text-white font-bold">
                User Management
              </h1>
              {/* <p className="text-white hidden md:block">Manage system suppliers</p> */}
            </div>
          </div>
          <button
          onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-md"
          >
            + New User
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-1 rounded w-full text-black outline-none"
            />
          </div>
        </div>
      </div>

      {/* ✅ Loading State */}
{loading ? (
  <div className="flex items-center justify-center h-[400px]">
    <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5"></span>
    <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
  </div>
) : (
  <>
    {/* ✅ User List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Users: {filteredUsers.length}
      </div>

      {/* ✅ Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Name</div>
          <div>Email</div>
          <div>Mobile</div>
          <div>Role</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-6 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((u, index) => (
              <div
                key={u.id}
                className="grid grid-cols-6 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div>{(page - 1) *  limit + index + 1}</div>

                <div>
                  <ToggleCell text={u.name} limit={10} width="150px" />
                </div>
                <div>
                  <ToggleCell text={u.email} limit={10} width="150px" />
                </div>
                <div>
                  <ToggleCell text={u.mobile_no} limit={10} />
                </div>
                <div>
                  <ToggleCell text={role[u.role_id]?.name} limit={10} />
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditData(u);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit size={18} />
                    Update
                  </button>
                  <button
                    onClick={() => setDeleteId(u.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-black">No users found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((u, index) => (
            <div
              key={u.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-gray-600 text-sm">{u.email}</p>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === u.id ? null : u.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === u.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === u.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Mobile: </span>
                    {u.mobile_no}
                  </p>
                  <p>
                    <span className="font-semibold">Role: </span>
                    {role[u.role_id]?.name}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(u);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(u.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="flex items-center text-xl text-black">No users found.</p>
        )}
      </div>
       <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  </>
)}


      {/* Add/Edit/Password Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            {mode === "form" && (
              <>
                <h3 className="text-lg font-semibold mb-4">{editData ? "Edit User" : "Add User"}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                <div>   
                   <label className="block font-semibold mb-1">Name</label>
                   <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter Full Name"
                    className="w-full border p-2 rounded"
                    required
                  />
                  </div>
                <div> 
                   <label className="block font-semibold mb-1">Email</label> 
                    <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder=" Enter Email"
                    className="w-full border p-2 rounded"
                    required
                  />
                  </div>
                <div>   
                   <label className="block font-semibold mb-1">Mobile Number</label>
                   <input
                    type="text"
                    value={formData.mobile_no}
                    onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                    placeholder="Enter Mobile Number"
                    className="w-full border p-2 rounded"
                    required
                  />
</div>
                  {!editData && (
                    <>
                    <div> 
                       <label className="block font-semibold mb-1">Password</label>
                         <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter Password"
                        className="w-full border p-2 rounded"
                        required
                      />
                      </div>
                    <div>   <label className="block font-semibold mb-1"> Confirm Password</label>  <input
                        type="password"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        placeholder=" Enter Confirm Password"
                        className="w-full border p-2 rounded"
                        required
                      />
                      </div>
                    </>
                  )}
              <div>
                 <label className="block font-semibold mb-1">Role</label>
                  <select
                    value={formData.role_id}
                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="">Select Role</option>
                    {role && Object.values(role).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  </div>

                  {editData && (
                    <div className="flex justify-between text-sm mt-2">
                      <button type="button" className="text-blue-600 hover:underline" onClick={() => setMode("forgotPassword")}>
                        Forgot Password?
                      </button>
                      <button type="button" className="text-blue-600 hover:underline" onClick={() => setMode("changePassword")}>
                        Change Password
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 border rounded-xl">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
                      {editData ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Change Password Form */}
            {mode === "changePassword" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await dispatch(updatePassword({ id: editData.id, old_password, new_password, new_password_confirmation })).unwrap();
                      toast.success("Password updated successfully! 🔐");
                      setMode("form");
                      setold_password(""); setnew_password(""); setnew_password_confirmation("");
                    } catch {
                      toast.error("Failed to update password 🚫");
                    }
                  }}
                  className="space-y-3"
                >
                  <input type="password" placeholder="Old Password" value={old_password} onChange={(e) => setold_password(e.target.value)} className="w-full border p-2 rounded" required />
                  <input type="password" placeholder="New Password" value={new_password} onChange={(e) => setnew_password(e.target.value)} className="w-full border p-2 rounded" required />
                  <input type="password" placeholder="Confirm New Password" value={new_password_confirmation} onChange={(e) => setnew_password_confirmation(e.target.value)} className="w-full border p-2 rounded" required />

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setMode("form")} className="px-4 py-2 border rounded-xl">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">Update Password</button>
                  </div>
                </form>
              </>
            )}

            {/* Forgot Password Form */}
            {mode === "forgotPassword" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Forgot Password</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await dispatch(resetPassword({ email: editData.email })).unwrap();
                      toast.success("Reset link sent to email! 📧");
                      setMode("form");
                    } catch {
                      toast.error("Failed to send reset link 🚫");
                    }
                  }}
                  className="space-y-3"
                >
                  <input type="email" placeholder="Email" value={editData.email} readOnly className="w-full border p-2 rounded bg-gray-100" />
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setMode("form")} className="px-4 py-2 border rounded-xl">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">Send Reset Link</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


