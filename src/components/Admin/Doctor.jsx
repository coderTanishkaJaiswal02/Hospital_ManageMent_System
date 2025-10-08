import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctor,
  fetchUsers,
  fetchQualifications,
  insertDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../redux/Slices/DoctorSlice";
import {
  Search,
  Trash2,
  Edit,
  PlusCircle,
  ChevronUp,
  Shield,
  ChevronDown,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleCell from "../common/ToggleCell";
import Pagination from "../common/Pagination";

export default function DoctorUI() {
  const dispatch = useDispatch();
  const { doctor, users, qualifications, loading } = useSelector(
    (state) => state.doctor
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    user_id: "",
    qualification_id: "",
    specialization: "",
    registration_number: "",
    experience: "",
    about: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    dispatch(fetchDoctor());
    dispatch(fetchUsers());
    dispatch(fetchQualifications());
  }, [dispatch]);

  const filteredDoctors = doctor.filter((doc) =>
    (users[doc.user_id]?.name || doc.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Pagination logic
    const [searching, setSearching] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10; // items per page
    const totalPages = Math.ceil(filteredDoctors.length / limit);
    const startIndex = (page - 1) * limit;
    const currentData = filteredDoctors.slice(startIndex, startIndex + limit);

    // Reset to page 1 when search term changes
    useEffect(() => {
      setPage(1);
    }, [searching]);
  
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDoctor(id)).unwrap();
      toast.success("Doctor deleted successfully! 🎉");
      dispatch(fetchDoctor());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    try {
      if (!editData) {
        await dispatch(insertDoctor(payload)).unwrap();
        toast.success("Doctor added successfully! 🎉");
      } else {
        await dispatch(updateDoctor({ user_id: editData.user_id, payload })).unwrap();
        toast.success("Doctor updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchDoctor());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      user_id: "",
      qualification_id: "",
      specialization: "",
      registration_number: "",
      experience: "",
      about: "",
      address: "",
      city: "",
    });
    setEditData(null);
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        user_id: editData.user_id || "",
        qualification_id: editData.qualification_id || "",
        specialization: editData.specialization || "",
        registration_number: editData.registration_number || "",
        experience: editData.experience || "",
        about: editData.about || "",
        address: editData.address || "",
        city: editData.city || "",
      });
    }
  }, [editData]);

  return (
    <div className="p-2 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
       <div className="  bg-gradient-to-r from-blue-500 to-blue-600 gap-2 rounded-b-none rounded-lg  md:px-4 md:py-8 py-4 border-collapse">
        <div className="flex px-4 flex-row justify-between sm:items-center ">
          <div className="flex justify-items-center gap-3">
            <div className="bg-blue-400  flex items-center justify-center rounded-xl border border-blue-300    p-2 md:px-4 md:py-2">
              <Shield size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl  sm:text-2xl text-white font-bold">
                Doctor Management
              </h1>
              <p className="text-white hidden md:block">Manage system Doctors</p> 
            </div>
          </div>
          <button
             onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-md"
          >
            + New Doctor
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
               type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            
              className="px-4 py-1 rounded w-full text-black outline-none"
            />
          </div>
        </div>
      </div>

    

      {loading ? (
  <div className="flex items-center justify-center h-[400px]">
    <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5"></span>
    <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
  </div>
) : (
  <>
    {/* Doctor List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Doctors: {filteredDoctors.length}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Name</div>
          <div>Specialization</div>
          <div>Qualification</div>
          <div>Experience</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-6 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((doc, index) => (
              <div
                key={doc.id}
                className="grid grid-cols-6 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div>{index + 1}</div>
                <div>
                  <ToggleCell text={doc.name} limit={15} />
                </div>
                <div>
                  <ToggleCell text={doc.specialization} limit={15} />
                </div>
                <div>
                  <ToggleCell text={qualifications[doc.qualification_id]?.degree} limit={15} />
                </div>
                <div>
                  <ToggleCell text={doc.experience} limit={10} />
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditData(doc);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit size={16} /> Update
                  </button>
                  <button
                    onClick={() => setDeleteId(doc.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-black">No doctors found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((doc, index) => (
            <div key={doc.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-gray-600 text-sm">{doc.specialization}</p>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === doc.id ? null : doc.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === doc.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === doc.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Qualification: </span>
                    {qualifications[doc.qualification_id]?.degree}
                  </p>
                  <p>
                    <span className="font-semibold">Experience: </span>
                    {doc.experience}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(doc);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(doc.id)}
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
          <p className="flex items-center text-xl text-black">
            No doctors found.
          </p>
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
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Doctor" : "Add Doctor"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              
             <div>
              <label className="block font-semibold mb-1">Name</label>
                <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Doctor Name"
                className="w-full border p-2 rounded"
                required
              />
              </div>
             
             <div>
              <label className="block font-semibold mb-1">Specialization</label>
                <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Specialization"
                className="w-full border p-2 rounded"
              />
              </div>
             <div>
              <label className="block font-semibold mb-1">Experience</label>
                <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Experience"
                className="w-full border p-2 rounded"
              />
              </div>
             <div>
              <label className="block font-semibold mb-1">City</label>
                <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="w-full border p-2 rounded"
              />
              </div>
              <div>
                <label className="block font-semibold mb-1">Registration</label>
                  <input
                type="text"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                placeholder="registration_number"
                className="w-full border p-2 rounded"
              />
              </div>
              <div>
               
                <label className="block font-semibold mb-1">About</label>
                  <input
                type="text"
                value={formData.about}
                onChange={(e) => setFormData({ ...formData,  about: e.target.value })}
                placeholder=" About"
                className="w-full border p-2 rounded"
              />
              </div>
              {/* Dropdowns */}
              <div >
                 <label className="block font-semibold mb-1">Qualification</label>
              <select
                value={formData.qualification_id}
                onChange={(e) => setFormData({ ...formData, qualification_id: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Qualification</option>
                {Object.values(qualifications).map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.degree}
                  </option>
                ))}
              </select>
</div>
<div>
   <label className="block font-semibold mb-1">User</label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">Select User</option>
                {Object.values(users).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.full_name}
                  </option>
                ))}
              </select>
</div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
                >
                  {editData ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this doctor?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded-xl" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600" onClick={() => handleDelete(deleteId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

