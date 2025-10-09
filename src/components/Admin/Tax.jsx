import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaxes,
  insertTax,
  updateTax,
  deleteTax,
} from "../../redux/Slices/TaxSlice";
import { fetchTaxGroups } from "../../redux/Slices/TaxGroupSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shield, ChevronDown, ChevronUp, Plus, Edit2, Trash2 } from "lucide-react";
import Pagination from "../common/Pagination";



const Tax = () => {
  const dispatch = useDispatch();
  const { data: taxes, loading } = useSelector((state) => state.taxes);
  const { data: groups } = useSelector((state) => state.taxGroups);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editTax, setEditTax] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "", group_id: "", percentage: "" });
  const [deleteTaxData, setDeleteTaxData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchTaxes()).unwrap().catch(() => toast.error("Failed to fetch taxes!"));
    dispatch(fetchTaxGroups()).unwrap().catch(() => toast.error("Failed to fetch tax groups!"));
  }, [dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Add Tax ---
  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.group_id || !formData.percentage) {
      toast.error("Please fill all fields.");
      return;
    }

    if (taxes.find((t) => t.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error("Tax name already exists.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      group_id: Number(formData.group_id),
      percentage: parseFloat(formData.percentage),
    };

    dispatch(insertTax(payload))
      .unwrap()
      .then(() => {
        toast.success("Tax added successfully!");
        setFormData({ name: "", group_id: "", percentage: "" });
        setShowAddForm(false);
      })
      .catch((err) => {
        console.error("Add Tax Error:", err);
        toast.error(err.response?.data?.message || "Failed to add tax. Check your input.");
      });
  };

  // --- Update Tax ---
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    if (!editTax.name || !editTax.group_id || !editTax.percentage) {
      toast.error("Please fill all fields.");
      return;
    }

    if (taxes.find((t) => t.name.toLowerCase() === editTax.name.toLowerCase() && t.id !== editTax.id)) {
      toast.error("Tax name already exists.");
      return;
    }

    const payload = {
      id: editTax.id,
      data: {
        name: editTax.name.trim(),
        group_id: Number(editTax.group_id),
        percentage: parseFloat(editTax.percentage),
      },
    };

    dispatch(updateTax(payload))
      .unwrap()
      .then(() => {
        toast.success("Tax updated successfully!");
        setEditTax(null);
      })
      .catch((err) => {
        console.error("Update Tax Error:", err);
        toast.error(err.response?.data?.message || "Failed to update tax. Check your input.");
      });
  };

  // --- Delete Tax ---
  const confirmDelete = () => {
    if (!deleteTaxData) return;

    dispatch(deleteTax(deleteTaxData.id))
      .unwrap()
      .then(() => {
        toast.success("Tax deleted successfully!");
        setDeleteTaxData(null);
      })
      .catch((err) => {
        console.error("Delete Tax Error:", err);
        toast.error(
          err.response?.data?.message || "Failed to delete tax. It may be linked to other records."
        );
      });
  };

  const filteredData = taxes.filter(
    (tax) =>
      tax.id.toString().includes(search) ||
      tax.name.toLowerCase().includes(search.toLowerCase())
  );



  
    // Pagination logic
      const [searching, setSearching] = useState("");
      const [page, setPage] = useState(1);
      const limit =5;
      const totalPages = Math.ceil(filteredData.length / limit);
      const startIndex = (page - 1) * limit;
      const currentData =filteredData.slice(startIndex, startIndex + limit);
    
      useEffect(() => {
        setPage(1);
      }, [searching]);


  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="bg-blue-500 rounded-t px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex flex-col w-full md:max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
              <Shield size={28} color="white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Taxes</h2>
          </div>
          <p className="text-white text-sm mb-3">Manage all tax entries</p>
          <input
            type="text"
            placeholder="Search by S.No or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-white text-blue-500 font-semibold px-6 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
        >
          <Plus size={18} /> Add Tax
        </button>
      </div>

 {loading ? (
  // ✅ Loading Spinner
  <div className="flex items-center justify-center h-[400px]">
    <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5"></span>
    <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
  </div>
) : (
  <>
    {/* ✅ Tax List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Taxes: {filteredData.length}
      </div>

      {/* ✅ Desktop View */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Name</div>
          <div>Group</div>
          <div>Percentage (%)</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col py-4 gap-2 mt-2">
          { currentData.length > 0 ? (
             currentData.map((tax, index) => (
              <div
                key={tax.id}
                className="grid grid-cols-5 gap-2 px-6 py-3 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>
                <div>{tax.name}</div>
                <div>{groups.find((g) => g.id === Number(tax.group_id))?.name || "—"}</div>
                <div>{tax.percentage}</div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() =>
                      editTax?.id === tax.id ? setEditTax(null) : setEditTax(tax)
                    }
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTaxData(tax)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-black text-lg">No taxes found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        { currentData.length > 0 ? (
           currentData.map((tax) => (
            <div
              key={tax.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{tax.name}</p>
                  <p className="text-gray-600 text-sm">
                    {groups.find((g) => g.id === Number(tax.group_id))?.name || "—"}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === tax.id ? null : tax.id)}
                  className={`transform transition-transform duration-300 ${
                    expandedId === tax.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === tax.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Percentage: </span>
                    {tax.percentage}%
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() =>
                        editTax?.id === tax.id ? setEditTax(null) : setEditTax(tax)
                      }
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTaxData(tax)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="flex items-center justify-center text-lg text-black">
            No taxes found.
          </p>
        )}
      </div>

      {/* ✅ Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  </>
)}

      {/* Add Tax Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Add Tax</h3>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tax Name"
                className="border p-2 rounded w-full"
              />
              <select
                name="group_id"
                value={formData.group_id}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
                placeholder="Percentage"
                className="border p-2 rounded w-full"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tax Modal */}
      {editTax && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Tax</h3>
            <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={editTax.name}
                onChange={(e) => setEditTax({ ...editTax, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <select
                name="group_id"
                value={editTax.group_id}
                onChange={(e) =>
                  setEditTax({ ...editTax, group_id: Number(e.target.value) })
                }
                className="border p-2 rounded w-full"
              >
                <option value="">Select Group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                name="percentage"
                value={editTax.percentage}
                onChange={(e) =>
                  setEditTax({ ...editTax, percentage: parseFloat(e.target.value) })
                }
                className="border p-2 rounded w-full"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditTax(null)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Tax Modal */}
      {deleteTaxData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete <strong>{deleteTaxData.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTaxData(null)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tax;
