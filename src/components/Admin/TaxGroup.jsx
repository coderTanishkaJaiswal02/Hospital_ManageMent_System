import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaxGroups,
  insertTaxGroup,
  updateTaxGroup,
  deleteTaxGroup,
} from "../../redux/Slices/TaxGroupSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shield } from "lucide-react";

const TaxGroups = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.taxGroups);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "" });
  const [showNameErrorModal, setShowNameErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState(null);

  useEffect(() => {
    dispatch(fetchTaxGroups())
      .unwrap()
      .catch(() => toast.error("Failed to fetch groups!"));
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (data.some((g) => g.name.toLowerCase() === formData.name.toLowerCase())) {
      setShowNameErrorModal(true);
      return;
    }
    dispatch(insertTaxGroup(formData))
      .unwrap()
      .then(() => {
        toast.success("Group added!");
        setFormData({ name: "" });
        setShowAddForm(false);
        dispatch(fetchTaxGroups());
      })
      .catch(() => toast.error("Failed to add group!"));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (
      data.some(
        (g) =>
          g.name.toLowerCase() === editGroup.name.toLowerCase() &&
          g.id !== editGroup.id
      )
    ) {
      setShowNameErrorModal(true);
      return;
    }
    dispatch(updateTaxGroup({ id: editGroup.id, data: editGroup }))
      .unwrap()
      .then(() => {
        toast.success("Group updated!");
        setEditGroup(null);
        dispatch(fetchTaxGroups());
      })
      .catch(() => toast.error("Failed to update group!"));
  };

  const confirmDelete = (id) => {
    setDeleteGroupId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    dispatch(deleteTaxGroup(deleteGroupId))
      .unwrap()
      .then(() => {
        toast.success("Group deleted!");
        dispatch(fetchTaxGroups());
      })
      .catch(() => toast.error("Failed to delete group!"));
    setShowDeleteModal(false);
    setDeleteGroupId(null);
  };

  const filteredData = data.filter(
    (group) =>
      group.id.toString().includes(search) ||
      group.name.toLowerCase().includes(search.toLowerCase())
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
            <h2 className="text-2xl font-semibold text-white">Tax Groups</h2>
          </div>
          <p className="text-white text-sm mb-3">Manage all tax groups</p>
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
          {showAddForm ? "Close Form" : "Add Group"}
        </button>
      </div>

      {/* Total */}
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
            placeholder="Group Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Group
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
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((group) => (
              <React.Fragment key={group.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{group.id}</td>
                  <td className="px-4 py-2">{group.name}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() =>
                        setEditGroup(editGroup?.id === group.id ? null : group)
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      {editGroup?.id === group.id ? "Cancel" : "Edit"}
                    </button>
                    <button
                      onClick={() => confirmDelete(group.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {editGroup?.id === group.id && (
                  <tr>
                    <td colSpan="3" className="bg-gray-50 p-4">
                      <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-2">
                        <div className="flex justify-end mb-2">
                          <button
                            type="button"
                            onClick={() => setEditGroup(null)}
                            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                          >
                            Close
                          </button>
                        </div>
                        <input
                          type="text"
                          value={editGroup.name}
                          onChange={(e) =>
                            setEditGroup({ ...editGroup, name: e.target.value })
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

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredData.map((group) => (
          <div
            key={group.id}
            className="border rounded-lg p-4 shadow bg-white flex flex-col justify-between"
          >
            <h3 className="text-lg font-semibold text-blue-600">
              {group.id} - {group.name}
            </h3>

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() =>
                  setEditGroup(editGroup?.id === group.id ? null : group)
                }
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                {editGroup?.id === group.id ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={() => confirmDelete(group.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {editGroup?.id === group.id && (
              <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-2 mt-2">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => setEditGroup(null)}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
                <input
                  type="text"
                  value={editGroup.name}
                  onChange={(e) =>
                    setEditGroup({ ...editGroup, name: e.target.value })
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
                </div>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* Name exists modal */}
      {showNameErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full flex flex-col gap-4">
            <p className="text-red-500">
              This name already exists! Please enter a new name.
            </p>
            <input
              type="text"
              value={formData.name || editGroup?.name}
              onChange={(e) =>
                editGroup
                  ? setEditGroup({ ...editGroup, name: e.target.value })
                  : setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <button
              onClick={() => setShowNameErrorModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full flex flex-col gap-4">
            <p>Are you sure you want to delete this group?</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxGroups;
