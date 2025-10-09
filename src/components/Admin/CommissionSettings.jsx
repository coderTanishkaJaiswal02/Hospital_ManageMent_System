import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  fetchDoctors,
  createUser,
  updateUser,
  deleteUser,
} from "../../redux/Slices/CommissionSettingsSlice";
import { Search, Shield, Trash2, Edit, ChevronDown } from "lucide-react";
import Pagination from "../common/Pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CommissionSettings() {
  const dispatch = useDispatch();
  const { data: commissions = [], loading = false, doctors = {} } =
    useSelector((state) => state.commission_settings ?? {});

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    doctor_id: "",
    type: "",
    source: "",
    value: "",
    calculation_type: "Flat",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null); // <-- Added state

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchData());
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (!showForm) {
      setForm({
        doctor_id: "",
        type: "",
        source: "",
        value: "",
        calculation_type: "Flat",
      });
      setEditing(null);
      setError("");
    }
  }, [showForm]);

  // Filter + sort by newest
  const filtered = [...commissions]
    .filter((c) => {
      const doctorName = doctors?.[c.doctor_id]?.name || "";
      const searchable = `${c.doctor_id} ${doctorName} ${c.type} ${c.source}`.toLowerCase();
      return searchable.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => b.id - a.id);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filtered.slice(startIndex, startIndex + limit);

  useEffect(() => setPage(1), [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.doctor_id) {
      setError("Please select a doctor");
      return;
    }
    try {
      if (editing) {
        await dispatch(updateUser({ id: editing.id, updatedUser: form })).unwrap();
        toast.success("Commission updated successfully");
      } else {
        await dispatch(createUser(form)).unwrap();
        toast.success("Commission added successfully!");
      }
      dispatch(fetchData());
      setShowForm(false);
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({
      doctor_id: c.doctor_id || "",
      type: c.type || "",
      source: c.source || "",
      value: c.value || "",
      calculation_type: c.calculation_type || "Flat",
    });
    setShowForm(true);
  };

  const confirmDelete = (id) => setDeleteId(id);

  const doDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteUser(deleteId)).unwrap();
      toast.success("Commission deleted");
      dispatch(fetchData());
    } catch {
      toast.error("Delete failed");
    }
    setDeleteId(null);
  };

  return (
    <div className="p-0 bg-white min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 gap-2 rounded-b-none rounded-lg md:px-4 md:py-8 py-4">
        <div className="flex px-4 flex-row justify-between sm:items-center">
          <div className="flex justify-items-center gap-3">
            <div className="bg-blue-400 flex items-center justify-center rounded-xl border border-blue-300 p-2">
              <Shield size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl text-white font-bold">
                Commission Settings
              </h1>
              <p className="text-white hidden md:block">Manage doctor commissions</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
              setForm({
                doctor_id: "",
                type: "",
                source: "",
                value: "",
                calculation_type: "Flat",
              });
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-md"
          >
            + New Commission
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search by doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-1 rounded w-full text-black outline-none"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-8 h-8"></span>
          <span className="ml-2 text-xl text-blue-600">Loading...</span>
        </div>
      )}

      {/* Commission List */}
      {!loading && (
        <>
          <div className="bg-white shadow p-4">
            <div className="text-lg font-semibold border-b pb-2 mb-0">
              Total Commissions: {filtered.length}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded shadow p-0">
            <div className="grid grid-cols-7 gap-1 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
              <div>S.No</div>
              <div>Doctor</div>
              <div>Type</div>
              <div>Source</div>
              <div>Value</div>
              <div>Calculation</div>
              <div className="text-center">Actions</div>
            </div>
            <div className="flex flex-col py-4 gap-2 mt-2">
              {currentData.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No commissions found.
                </div>
              ) : (
                currentData.map((c, idx) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-7 gap-2 px-6 py-4 border-b rounded-lg hover:bg-gray-50 shadow-sm bg-white hover:shadow-md transition items-center"
                  >
                    <div>{startIndex + idx + 1}</div>
                    <div>{doctors[c.doctor_id]?.name || `Doctor #${c.doctor_id}`}</div>
                    <div>{c.type}</div>
                    <div>{c.source}</div>
                    <div>{c.value}</div>
                    <div>{c.calculation_type}</div>
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleEdit(c)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        <Edit size={16} /> Update
                      </button>
                      <button
                        onClick={() => confirmDelete(c.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="bg-white p-4 mt-0 rounded-b-lg shadow flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4 mt-4 px-4">
            {currentData.length === 0 ? (
              <p className="text-gray-500 text-center">No commissions found.</p>
            ) : (
              currentData.map((c, idx) => (
                <div key={c.id} className="border rounded-lg shadow p-4 bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        {startIndex + idx + 1}. {doctors[c.doctor_id]?.name || `Doctor #${c.doctor_id}`}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Type: {c.type} | Source: {c.source}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                      className={`transform transition-transform duration-300 ${
                        expandedId === c.id ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>

                  {expandedId === c.id && (
                    <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                      <p>
                        <span className="font-semibold">Value:</span> {c.value}
                      </p>
                      <p>
                        <span className="font-semibold">Calculation:</span> {c.calculation_type}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(c)}
                          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          <Edit size={16} /> Update
                        </button>
                        <button
                          onClick={() => confirmDelete(c.id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Mobile Pagination */}
          <div className="md:hidden bg-white p-4 mt-0 rounded-b-lg shadow flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editing ? "Edit Commission" : "Add Commission"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={form.doctor_id}
                onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Doctor</option>
                {Object.values(doctors).map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Type"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="Source"
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="Value"
                className="border p-2 rounded w-full"
              />
              <select
                value={form.calculation_type}
                onChange={(e) =>
                  setForm({ ...form, calculation_type: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                <option value="Flat">Flat</option>
                <option value="Percentage">Percentage</option>
              </select>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
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
                  {editing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="font-semibold text-lg mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this commission?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border rounded-xl"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                onClick={doDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommissionSettings;
