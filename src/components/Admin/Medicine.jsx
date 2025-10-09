import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMedicines,
  insertMedicine,
  updateMedicine,
  deleteMedicine,
} from "../../redux/Slices/MedicineSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shield, ChevronDown, ChevronUp, Plus, Pen, Trash2, X, Edit } from "lucide-react";
import Pagination from "../common/Pagination";
import ToggleCell from "../common/ToggleCell";

const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
    <span className="text-blue-500 font-semibold text-lg">Loading...</span>
  </div>
);

const Medicine = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.medicines);

  const [search, setSearch] = useState("");
  const [editMedicine, setEditMedicine] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [expandedId, setExpandedId] = useState(null);
  const [modalType, setModalType] = useState(null); // "add" or "edit"

  const initialFormData = {
    brand_name: "",
    generic_name: "",
    form: "",
    strength: "",
    hsn_code: "",
    total_quantity: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchMedicines())
      .unwrap()
      .catch(() => toast.error("Failed to fetch medicines"));
  }, [dispatch]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (editMedicine) {
      setEditMedicine({ ...editMedicine, [e.target.name]: value });
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => !String(val).trim())) {
      return toast.error("Please fill all required fields");
    }
    dispatch(insertMedicine(formData))
      .unwrap()
      .then(() => {
        toast.success("Medicine added successfully!");
        setFormData(initialFormData);
        setModalType(null);
        dispatch(fetchMedicines());
      })
      .catch(() => toast.error("Failed to add medicine!"));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (Object.values(editMedicine).some((val) => !String(val).trim())) {
      return toast.error("Please fill all required fields");
    }
    dispatch(updateMedicine({ id: editMedicine.id, data: editMedicine }))
      .unwrap()
      .then(() => {
        toast.success("Medicine updated successfully!");
        setEditMedicine(null);
        setModalType(null);
        dispatch(fetchMedicines());
      })
      .catch(() => toast.error("Failed to update medicine!"));
  };

  const handleDeleteClick = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };
  const confirmDelete = () => {
    dispatch(deleteMedicine(deleteModal.id))
      .unwrap()
      .then(() => toast.success("Medicine deleted successfully!"))
      .catch(() => toast.error("Failed to delete medicine!"));
    setDeleteModal({ open: false, id: null, name: "" });
  };
  const cancelDelete = () => setDeleteModal({ open: false, id: null, name: "" });

  const filteredMedicines = data.filter((med) =>
    med.brand_name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
       const [searching, setSearching] = useState("");
       const [page, setPage] = useState(1);
       const limit =5;
       const totalPages = Math.ceil(filteredMedicines.length / limit);
       const startIndex = (page - 1) * limit;
       const currentData =filteredMedicines.slice(startIndex, startIndex + limit);
     
       useEffect(() => {
         setPage(1);
       }, [searching]);
  

  // Reset page on search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="-p-4 max-w-6xl mx-auto flex flex-col">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="bg-blue-500 rounded-t-xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
              <Shield size={28} color="white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Medicines</h2>
          </div>
          <p className="text-white text-sm mb-2">Manage all medicines data</p>
          <input
            type="text"
            placeholder="Search by Brand Name..."
            value={search}
            onChange={handleSearch}
            className="w-full max-w-lg border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
          />
        </div>
        <button
          onClick={() => { setModalType("add"); setEditMedicine(null); }}
          className="bg-white text-blue-500 font-semibold px-4 py-2 rounded hover:shadow-lg transition-shadow duration-300 flex items-center gap-2 -mt-2"
        >
          <Plus className="w-4 h-4" /> Add Medicine
        </button>
      </div>

      {/* Loading or Medicines */}
     {/* Loading Overlay */}
{loading ? (
  <div className="flex items-center justify-center h-[400px]">
    <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5"></span>
    <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
  </div>
) : (
  <>
    {/* Medicines List */}
    <div className="bg-white rounded rounded-t-none shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Medicines: {filteredMedicines.length}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        {/* Header Row */}
        <div className="grid grid-cols-8 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Total Qty</div>
          <div>Brand Name</div>
          <div>Generic Name</div>
          <div>Form</div>
          <div>Strength</div>
          <div>HSN Code</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Data Rows */}
        <div className="flex flex-col py-6 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((med, index) => (
              <div
                key={med.id}
                className="grid grid-cols-8 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>
                <div>{med.total_quantity}</div>
                <div>
                  <ToggleCell text={med.brand_name} limit={15} />
                </div>
                <div>
                  <ToggleCell text={med.generic_name} limit={15} />
                </div>
                <div>{med.form}</div>
                <div>{med.strength}</div>
                <div>{med.hsn_code}</div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditMedicine(med);
                      setModalType("edit");
                    }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Pen size={18} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(med.id, med.brand_name)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-black">No medicines found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((med, index) => (
            <div
              key={med.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-black">
                    {(currentPage - 1) * itemsPerPage + index + 1}.{" "}
                    {med.brand_name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Form: {med.form} | Qty: {med.total_quantity}
                  </p>
                </div>

                {/* Expand toggle */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === med.id ? null : med.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === med.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === med.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Generic Name:</span>{" "}
                    {med.generic_name}
                  </p>
                  <p>
                    <span className="font-semibold">Strength:</span>{" "}
                    {med.strength}
                  </p>
                  <p>
                    <span className="font-semibold">HSN Code:</span>{" "}
                    {med.hsn_code}
                  </p>

                  <div className="flex gap-2 mt-2 justify-end">
                    <button
                      onClick={() => {
                        setEditMedicine(med);
                        setModalType("edit");
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(med.id, med.brand_name)}
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
            No medicines found.
          </p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  </>
)}


      {/* Add/Edit Modal */}
      {(modalType === "add" || modalType === "edit") && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => { setModalType(null); setEditMedicine(null); }}
              className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">{modalType === "add" ? "Add Medicine" : "Edit Medicine"}</h2>
            <form onSubmit={modalType === "add" ? handleAddSubmit : handleUpdate} className="flex flex-col gap-3">
              {["brand_name", "generic_name", "form", "strength", "hsn_code", "total_quantity"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace("_", " ").toUpperCase()}
                  value={(modalType === "add" ? formData : editMedicine)[field] ?? ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              ))}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {modalType === "add" ? "Add" : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => { setModalType(null); setEditMedicine(null); }}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-lg">Are you sure you want to delete <strong>{deleteModal.name}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicine;
