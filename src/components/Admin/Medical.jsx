// src/components/MedicalDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllItems, addItem, updateItem, deleteItem } from "../../redux/Slices/MedicalSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pen, Trash2, Plus, Search, Shield, ChevronDown, ChevronUp, Edit } from "lucide-react";
import Pagination from "../common/Pagination";
import ToggleCell from "../common/ToggleCell";

const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
    <span className="text-blue-500 font-semibold text-lg">Loading...</span>
  </div>
);

const Medical = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.medical);

  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    email: "",
    phone: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const inputRef = useRef(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAllItems());
  }, [dispatch]);

  useEffect(() => {
    if (showAddModal && inputRef.current) inputRef.current.focus();
  }, [showAddModal]);

  const handleAddOrUpdate = async () => {
    try {
      if (!editId) {
        const emailExists = (items || []).some(
          (item) => item.email.toLowerCase() === formData.email.toLowerCase()
        );
        const phoneExists = (items || []).some(
          (item) => item.phone === formData.phone
        );

        if (emailExists) {
          toast.error("Email already exists! Please use another email.");
          return;
        }

        if (phoneExists) {
          toast.error("Phone number already exists! Please use another number.");
          return;
        }
      }

      if (editId) {
        await dispatch(updateItem({ id: editId, ...formData })).unwrap();
        toast.success("Medical Updated Successfully");
      } else {
        await dispatch(addItem({ ...formData })).unwrap();
        toast.success("Medical Added Successfully");
      }

      setEditId(null);
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        email: "",
        phone: "",
      });
      setShowAddModal(false);
    } catch {
      toast.error(editId ? "Failed to Update Medical" : "Failed to Add Medical");
    }
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      address: item.address,
      city: item.city,
      state: item.state,
      email: item.email,
      phone: item.phone,
    });
    setShowAddModal(true);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
 // Pagination logic
      const [searching, setSearching] = useState("");
      const [page, setPage] = useState(1);
      const limit =5;
      const totalPages = Math.ceil(filteredItems.length / limit);
      const startIndex = (page - 1) * limit;
      const currentData =filteredItems.slice(startIndex, startIndex + limit);
    
      useEffect(() => {
        setPage(1);
      }, [searching]);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-blue-500 rounded-t px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col w-full md:max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
              <Shield size={28} color="white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Medicals Dashboard
            </h2>
          </div>
          <p className="text-white text-sm mb-3">Manage medical roles and permissions</p>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Medicals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-md border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-blue-500 font-semibold px-4 sm:px-6 py-2 rounded hover:bg-gray-100 w-full sm:w-auto flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" /> Add Form
        </button>
      </div>

     {/* Loading Overlay */}
{loading ? (
  <div className="flex items-center justify-center h-[400px]">
    <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5 "></span>
    <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
  </div>
) : (
  <>
    {/* Medical List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Medicals: {filteredItems.length}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-8 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Name</div>
          <div>Address</div>
          <div>City</div>
          <div>State</div>
          <div>Email</div>
          <div>Phone</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-6 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-8 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div><ToggleCell text={(currentPage - 1) * itemsPerPage + index + 1} /></div>
                <div><ToggleCell text={item.name}/></div>
                <div><ToggleCell text={item.address} /></div>
                <div><ToggleCell text={item.city}/></div>
                <div><ToggleCell text={item.state}/></div>
                <div><ToggleCell text={item.email}/></div>
                <div><ToggleCell text={item.phone}/></div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit size={18} /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(item)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-20">
              <p className="text-black">No medicals found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((item, index) => (
            <div
              key={item.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-blue-600">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.city}</p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className={`transform transition-transform duration-300 ${
                    expandedId === item.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === item.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p><span className="font-semibold">S.No: </span>{(currentPage - 1) * itemsPerPage + index + 1}</p>
                  <p><span className="font-semibold">Address: </span>{item.address}</p>
                  <p><span className="font-semibold">State: </span>{item.state}</p>
                  <p><span className="font-semibold">Email: </span>{item.email}</p>
                  <p><span className="font-semibold">Phone: </span>{item.phone}</p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(item)}
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
          <p className="flex items-center text-xl text-black">No medicals found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}
    </div>
  </>
)}


      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {editId ? <Pen className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editId ? "Edit Medical" : "Add New Medical"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {["name","address","city","state","email","phone"].map((field) => (
                <input
                  key={field}
                  ref={field==="name"?inputRef:null}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={(e)=>setFormData({...formData,[field]:e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditId(null);
                  setFormData({ name:"", address:"", city:"", state:"", email:"", phone:"" });
                }}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdate}
                className={`px-3 py-1 text-white rounded flex items-center gap-1 ${editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"}`}
              >
                {editId ? <Pen className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete this medical:{" "}
              <span className="font-bold">{confirmDelete.name}</span>?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await dispatch(deleteItem(confirmDelete.id)).unwrap();
                    toast.success(`Medical "${confirmDelete.name}" Deleted Successfully`);
                  } catch {
                    toast.error("Failed to Delete Medical");
                  }
                  setConfirmDelete(null);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medical;
