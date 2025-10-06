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
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

const Medicine = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.medicines);

  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editMedicine, setEditMedicine] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [expandedId, setExpandedId] = useState(null);

  const initialFormData = {
    brand_name: "",
    generic_name: "",
    form: "",
    strength: "",
    hsn_code: "",
    total_quantity: "",
  };
  const [formData, setFormData] = useState(initialFormData);

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
    if (
      !formData.brand_name.trim() ||
      !formData.generic_name.trim() ||
      !formData.form.trim() ||
      !formData.strength.trim() ||
      !formData.hsn_code.trim() ||
      !formData.total_quantity.trim()
    ) {
      return toast.error("Please fill all required fields");
    }

    const payload = { ...formData, total_quantity: formData.total_quantity || "0" };
    dispatch(insertMedicine(payload))
      .unwrap()
      .then(() => {
        toast.success("Medicine added successfully!");
        setFormData(initialFormData);
        setShowAddForm(false);
        dispatch(fetchMedicines());
      })
      .catch(() => toast.error("Failed to add medicine!"));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (
      !editMedicine.brand_name.trim() ||
      !editMedicine.generic_name.trim() ||
      !editMedicine.form.trim() ||
      !editMedicine.strength.trim() ||
      !editMedicine.hsn_code.trim() ||
      !editMedicine.total_quantity.trim()
    ) {
      return toast.error("Please fill all required fields");
    }

    const payload = { ...editMedicine, total_quantity: editMedicine.total_quantity || "0" };
    dispatch(updateMedicine({ id: editMedicine.id, data: payload }))
      .unwrap()
      .then(() => {
        toast.success("Medicine updated successfully!");
        setEditMedicine(null);
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

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-blue-500 rounded px-8 py-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
                <Shield size={28} color="white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Medicines</h2>
            </div>
            <p className="text-white text-sm mt-1">Manage all Medicines data</p>
          </div>
          <button
            onClick={() => { setShowAddForm(!showAddForm); setEditMedicine(null); }}
            className="bg-white text-blue-500 font-semibold px-6 py-3 rounded hover:bg-gray-100"
          >
            {showAddForm ? "Close Form" : "Add Medicine"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white"
        />
      </div>

      {/* Total Medicines */}
      <div className="text-gray-700 font-semibold">Total Medicines: {filteredMedicines.length}</div>

      {/* Add Form */}
      {showAddForm && !editMedicine && (
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded shadow flex flex-col gap-4">
          {["brand_name", "generic_name", "form", "strength", "hsn_code", "total_quantity"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={formData[field] ?? ""}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          ))}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Medicine
          </button>
        </form>
      )}

      {/* Desktop Table */}
      {!loading && filteredMedicines.length > 0 && (
        <div className="hidden md:block overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Total Qty</th>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Brand Name</th>
                <th className="px-4 py-2 text-left">Generic Name</th>
                <th className="px-4 py-2 text-left">Form</th>
                <th className="px-4 py-2 text-left">Strength</th>
                <th className="px-4 py-2 text-left">HSN Code</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((med) => (
                <React.Fragment key={med.id}>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">{med.total_quantity}</td>
                    <td className="px-4 py-2">{med.id}</td>
                    <td className="px-4 py-2">{med.brand_name}</td>
                    <td className="px-4 py-2">{med.generic_name}</td>
                    <td className="px-4 py-2">{med.form}</td>
                    <td className="px-4 py-2">{med.strength}</td>
                    <td className="px-4 py-2">{med.hsn_code}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => { setEditMedicine(med); setShowAddForm(false); }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(med.id, med.brand_name)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {editMedicine?.id === med.id && (
                    <tr>
                      <td colSpan="8" className="px-4 py-2 bg-gray-50">
                        <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                          {["brand_name", "generic_name", "form", "strength", "hsn_code", "total_quantity"].map((field) => (
                            <input
                              key={field}
                              type="text"
                              name={field}
                              value={editMedicine[field] ?? ""}
                              onChange={handleChange}
                              className="border p-2 rounded w-full"
                              required
                            />
                          ))}
                          <div className="flex gap-2 mt-2">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                              Update
                            </button>
                            <button type="button" onClick={() => setEditMedicine(null)} className="bg-gray-300 px-4 py-2 rounded">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredMedicines.map((med) => (
          <div key={med.id} className="border rounded-lg p-4 shadow bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-600">
                {med.brand_name} - {med.form} ({med.strength})
              </h3>
              <button
                onClick={() => setExpandedId(expandedId === med.id ? null : med.id)}
                className="p-1"
              >
                {expandedId === med.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <p className="text-gray-700 font-medium">Total Qty: {med.total_quantity}</p>

            {expandedId === med.id && (
              <div className="mt-2 text-sm space-y-1">
                <p>ID: {med.id}</p>
                <p>Generic Name: {med.generic_name}</p>
                <p>HSN Code: {med.hsn_code}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => { setEditMedicine(med); setShowAddForm(false); }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(med.id, med.brand_name)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {editMedicine?.id === med.id && (
              <form onSubmit={handleUpdate} className="flex flex-col gap-2 mt-2">
                {["brand_name", "generic_name", "form", "strength", "hsn_code", "total_quantity"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={editMedicine[field] ?? ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                  />
                ))}
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Update
                  </button>
                  <button type="button" onClick={() => setEditMedicine(null)} className="bg-gray-300 px-4 py-2 rounded">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-lg">
              Are you sure you want to delete <strong>{deleteModal.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete
              </button>
              <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Medicine;
