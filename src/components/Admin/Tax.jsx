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
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

const Tax = () => {
  const dispatch = useDispatch();
  const { data: taxes, loading, error } = useSelector((state) => state.taxes);
  const { data: groups } = useSelector((state) => state.taxGroups);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editTax, setEditTax] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    group_id: "",
    percentage: "",
  });
  const [deleteTaxData, setDeleteTaxData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchTaxes())
      .unwrap()
      .then(() => toast.success("Taxes fetched successfully!"))
      .catch(() => toast.error("Failed to fetch taxes!"));
    dispatch(fetchTaxGroups())
      .unwrap()
      .catch(() => toast.error("Failed to fetch tax groups!"));
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (taxes.find((t) => t.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error("Tax name already exists.");
      return;
    }
    dispatch(insertTax(formData))
      .unwrap()
      .then(() => {
        toast.success("Tax added successfully!");
        setFormData({ name: "", group_id: "", percentage: "" });
        setShowAddForm(false);
      })
      .catch(() => toast.error("Failed to add tax!"));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (
      taxes.find(
        (t) =>
          t.name.toLowerCase() === editTax.name.toLowerCase() && t.id !== editTax.id
      )
    ) {
      toast.error("Tax name already exists.");
      return;
    }
    dispatch(updateTax({ id: editTax.id, data: editTax }))
      .unwrap()
      .then(() => {
        toast.success("Tax updated successfully!");
        setEditTax(null);
      })
      .catch(() => toast.error("Failed to update tax!"));
  };

  const confirmDelete = () => {
    if (!deleteTaxData) return;
    dispatch(deleteTax(deleteTaxData.id))
      .unwrap()
      .then(() => toast.success("Tax deleted successfully!"))
      .catch(() => toast.error("Failed to delete tax!"))
      .finally(() => setDeleteTaxData(null));
  };

  const filteredData = taxes.filter(
    (tax) =>
      tax.id.toString().includes(search) ||
      tax.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="bg-blue-500 rounded px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
            placeholder="Search by ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
          />
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-white text-blue-500 font-semibold px-6 py-2 rounded hover:bg-gray-100"
        >
          {showAddForm ? "Close Form" : "Add Tax"}
        </button>
      </div>

      {/* Total count */}
      <div className="text-gray-700 font-semibold mt-2">
        Total ID: {filteredData.length}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white p-6 rounded shadow flex flex-col gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Tax Name"
            value={formData.name}
            onChange={handleChange}
            required
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
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            name="percentage"
            placeholder="Percentage"
            value={formData.percentage}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Tax
          </button>
        </form>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Group</th>
              <th className="px-4 py-2 text-left">Percentage (%)</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((tax) => (
              <tr key={tax.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{tax.id}</td>
                <td className="px-4 py-2">{tax.name}</td>
                <td className="px-4 py-2">
                  {groups.find((g) => g.id === Number(tax.group_id))?.name || "—"}
                </td>
                <td className="px-4 py-2">{tax.percentage}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() =>
                      editTax?.id === tax.id ? setEditTax(null) : setEditTax(tax)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTaxData(tax)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredData.map((tax) => (
          <div
            key={tax.id}
            className="border rounded-lg p-4 shadow bg-white flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-600">
                {tax.id} - {tax.name} ({groups.find((g) => g.id === Number(tax.group_id))?.name || "—"})
              </h3>
              <button
                onClick={() =>
                  setExpandedId(expandedId === tax.id ? null : tax.id)
                }
                className="p-1"
              >
                {expandedId === tax.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>

            {expandedId === tax.id && (
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <strong>Percentage:</strong> {tax.percentage}%
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() =>
                  editTax?.id === tax.id ? setEditTax(null) : setEditTax(tax)
                }
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteTaxData(tax)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {/* Edit Form inside card */}
            {editTax?.id === tax.id && (
              <form
                onSubmit={handleUpdateSubmit}
                className="flex flex-col gap-2 mt-2"
              >
                <input
                  type="text"
                  name="name"
                  value={editTax.name}
                  onChange={(e) =>
                    setEditTax({ ...editTax, name: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  required
                />
                <select
                  name="group_id"
                  value={editTax.group_id || ""}
                  onChange={(e) =>
                    setEditTax({ ...editTax, group_id: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Group</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  name="percentage"
                  value={editTax.percentage}
                  onChange={(e) =>
                    setEditTax({ ...editTax, percentage: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  required
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTax(null)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* Delete Modal */}
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
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tax;
