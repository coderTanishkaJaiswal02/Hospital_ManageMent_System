import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchReceptions,
  fetchQualifications,
  fetchUsers,
  insertReception,
  updateReception,
  deleteReception,
} from "../../redux/Slices/ReceptionSlice";
import { Search, Shield, Trash2, Edit, PlusCircle, MoreVertical, ChevronUp, ChevronDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleCell from "../common/ToggleCell";
import Pagination from "../common/Pagination";

export default function Receptions() {
  const dispatch = useDispatch();
  const { receptions, users, qualifications, loading } = useSelector(
    (state) => state.receptions
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    qualification_id: "",
    husband_or_father_name: "",
    emergency_contact: "",
    address: "",
    joining_date: "",
    shift: "",
  });

  // Load data
  useEffect(() => {
    dispatch(fetchReceptions());
    dispatch(fetchUsers());
    dispatch(fetchQualifications());
  }, [dispatch]);

  const filteredReceptions = receptions.filter((r) =>
    (users[r.user_id]?.name || "").toLowerCase().includes(search.toLowerCase())
  );

   // Pagination logic
      const [searching, setSearching] = useState("");
      const [page, setPage] = useState(1);
      const limit =5;
      const totalPages = Math.ceil(filteredReceptions.length / limit);
      const startIndex = (page - 1) * limit;
      const currentData =filteredReceptions.slice(startIndex, startIndex + limit);
    
      useEffect(() => {
        setPage(1);
      }, [searching]);
  

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteReception(id)).unwrap();
      toast.success("Reception deleted successfully! 🎉");
      dispatch(fetchReceptions());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({
      user_id: "",
      qualification_id: "",
      husband_or_father_name: "",
      emergency_contact: "",
      address: "",
      joining_date: "",
      shift: "",
    });
    setEditData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = editData
      ? {
          address: formData.address,
          joining_date: formData.joining_date,
          shift: formData.shift,
          husband_or_father_name: formData.husband_or_father_name,
          qualification_id: Number(formData.qualification_id),
          emergency_contact: formData.emergency_contact,
        }
      : {
          ...formData,
          user_id: Number(formData.user_id),
          qualification_id: Number(formData.qualification_id),
          clinic_id: 1,
        };

    try {
      if (!editData) {
        await dispatch(insertReception(payload)).unwrap();
        toast.success("Reception added successfully! 🎉");
      } else {
       await dispatch(updateReception({ user_id: editData.user_id, payload })).unwrap();
        toast.success("Reception updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchReceptions());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        qualification_id: editData.qualification_id || "",
        husband_or_father_name: editData.husband_or_father_name || "",
        emergency_contact: editData.emergency_contact || "",
        address: editData.address || "",
        joining_date: editData.joining_date || "",
        shift: editData.shift || "",
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
                Receptions Management
              </h1>
              {/* <p className="text-white hidden md:block">Manage system suppliers</p> */}
            </div>
          </div>
          <button
             onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-white text-blue-600 px-4 py-2 rounded-md"
          >
            + New Reception
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
          <input
              type="text"
              placeholder="Search receptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-1 rounded w-full text-black outline-none"
            />
          </div>
        </div>
      </div>


{/* Loading Overlay */}
{loading ? (
  <div className="flex items-center justify-center h-[400px]">
    <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5"></span>
    <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
  </div>
) : (
  <>
    {/* Receptions List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Receptions: {filteredReceptions.length}
      </div>

      {/* Desktop Table (Grid Layout) */}
      <div className="hidden md:block">
        <div className="grid grid-cols-8 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>ID</div>
          <div>Name</div>
          <div>Qualification</div>
          <div>Email</div>
          <div>Father/Husband</div>
          <div>Phone</div>
          <div>Address</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-2 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((r, index) => (
              <div
                key={r.id}
                className="grid grid-cols-8 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div><ToggleCell text={r.id} /></div>
                <div><ToggleCell text={users[r.user_id]?.name} /></div>
                <div><ToggleCell text={qualifications[r.qualification_id]?.degree} /></div>
                <div><ToggleCell text={users[r.user_id]?.email} /></div>
                <div><ToggleCell text={r.husband_or_father_name} /></div>
                <div><ToggleCell text={r.emergency_contact} /></div>
                <div><ToggleCell text={r.address} /></div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => { setEditData(r); setShowForm(true); }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit size={18} /> Update
                  </button>
                  <button
                    onClick={() => setDeleteId(r.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-6">
              <p className="text-black">No receptions found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((r) => (
            <div key={r.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{users[r.user_id]?.name}</p>
                  <p className="text-gray-600 text-sm">
                    {qualifications[r.qualification_id]?.degree}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  className={`transform transition-transform duration-300 ${
                    expandedId === r.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === r.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p><span className="font-semibold">Email: </span>{users[r.user_id]?.email}</p>
                  <p><span className="font-semibold">Father/Husband: </span>{r.husband_or_father_name}</p>
                  <p><span className="font-semibold">Phone: </span>{r.emergency_contact}</p>
                  <p><span className="font-semibold">Address: </span>{r.address}</p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setEditData(r); setShowForm(true); }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(r.id)}
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
          <p className="flex items-center text-xl text-black">No receptions found.</p>
        )}
      </div>
         {/* ✅ Pagination added here */}
       <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  </>
)}



      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editData ? "Edit Reception" : "Add Reception"}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">

<div>
             <label className="block font-semibold mb-1">User</label>
              {/* User dropdown only in Add */}
              {!editData && (
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Select User</option>
                  {Object.values(users).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              )}
</div>
              {/* Qualification */}
              <div>
                   <label className="block font-semibold mb-1">Qualification</label>
              <select
                value={formData.qualification_id}
                onChange={(e) => setFormData({ ...formData, qualification_id: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Qualification</option>
                {Object.values(qualifications).map((q) => (
                  <option key={q.id} value={q.id}>{q.degree}</option>
                ))}
              </select>
</div>

<div>
     <label className="block font-semibold mb-1">Husband /Father Name</label>
              <input
                type="text"
                value={formData.husband_or_father_name}
                onChange={(e) => setFormData({ ...formData, husband_or_father_name: e.target.value })}
                placeholder="Husband/Father Name"
                className="w-full border p-2 rounded"
                required
              />
</div>
<div>   <label className="block font-semibold mb-1">Emergency Number</label>
              <input
                type="text"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                placeholder="Phone"
                className="w-full border p-2 rounded"
                required
              />
</div>
<div>
     <label className="block font-semibold mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
                className="w-full border p-2 rounded"
                required
              />
</div>

<div>
     <label className="block font-semibold mb-1">Joining Date</label>
              {/* Joining Date */}
              <input
                type="date"
                value={formData.joining_date}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
</div>
<div>
     <label className="block font-semibold mb-1">Shift</label>
              {/* Shift */}
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
               
                <option value="">Select Shift</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
</div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-xl  hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
                  {editData ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this reception?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded-xl" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






