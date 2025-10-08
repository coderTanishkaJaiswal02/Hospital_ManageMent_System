import React, { useEffect, useState } from "react"; //Govind Varfa
import { useDispatch, useSelector } from "react-redux";
import { fetchData, createUser, updateUser, deleteUser } from "../../redux/Slices/brandsSlice";
import { Trash2, Search, Settings, Shield, ChevronDown } from "lucide-react";
import ToggleCell from "../common/ToggleCell";
import Pagination from "../common/Pagination"; // <-- import your Pagination component
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Brands = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.brand ?? { data: [], loading: false });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: "" });
    setShowForm(false);
    setFormError("");
  };

  const handleEditClick = (brand) => {
    setEditId(brand.id);
    setFormData({ name: brand.name || "" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newName = (formData.name || "").trim().toLowerCase();
    if (!newName) {
      setFormError("Name is required");
      return;
    }
    const duplicate = Array.isArray(data)
      ? data.find((b) => b.name && b.name.trim().toLowerCase() === newName && b.id !== editId)
      : null;
    if (duplicate) {
      setFormError("Brand already exists");
      return;
    }
    try {
      if (editId) {
        await dispatch(updateUser({ id: editId, updatedUser: formData })).unwrap();
        toast.success("Brand updated successfully!");
      } else {
        await dispatch(createUser(formData)).unwrap();
        toast.success("Brand added successfully!");
      }
      resetForm();
      dispatch(fetchData());
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const confirmDeleteBrand = async () => {
    if (confirmDelete) {
      try {
        await dispatch(deleteUser(confirmDelete)).unwrap();
        toast.success("Brand deleted successfully!");
        dispatch(fetchData());
      } catch {
        toast.error("Delete failed!");
      }
      setConfirmDelete(null);
    }
  };

  // Filtered data
  const filteredData = Array.isArray(data)
    ? data.filter((brand) => brand.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  // Pagination logic
  const [page, setPage] = useState(1);
  const limit = 5;
  const totalPages = Math.ceil(filteredData.length / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filteredData.slice(startIndex, startIndex + limit);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="md:px-2 min-w-full bg-gray-50 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 gap-2 rounded-b-none rounded-lg md:px-4 md:py-8 py-4 border-collapse">
        <div className="flex px-4 flex-row justify-between sm:items-center">
          <div className="flex justify-items-center gap-3">
            <div className="bg-blue-400 flex items-center justify-center rounded-xl border border-blue-300 p-2">
              <Shield size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl text-white font-bold">Brand Management</h1>
              <p className="text-white hidden md:block">Manage system brands</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-white text-blue-600 px-4 py-2 rounded-md">
            + New Brand
          </button>
        </div>

        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-1 rounded w-full text-black outline-none"
            />
          </div>
        </div>
      </div>

      {/* Loading or List */}
      {loading ? (
        <div className="flex justify-center py-8 h-[300px]">
          <span className="animate-spin border-2 mt-2 border-blue-500 border-t-transparent rounded-full w-5 h-5"></span>
          <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-t-none shadow p-4">
            <div className="text-lg font-semibold border-b pb-2 mb-4">Total Brands: {filteredData.length}</div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
                <div>S.No</div>
                <div>Name</div>
                <div className="text-center">Actions</div>
              </div>

              <div className="flex flex-col py-6 gap-2 mt-2">
                {currentData.map((brand, index) => (
                  <div
                    key={brand.id}
                    className="grid grid-cols-3 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
                  >
                    <div>{(page - 1) * limit + index + 1}</div>
                    <div>
                      <ToggleCell text={brand.name} limit={30} />
                    </div>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(brand)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        <Settings size={18} /> Update
                      </button>
                      <button
                        onClick={() => setConfirmDelete(brand.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col gap-4">
              {currentData.length > 0 ? (
                currentData.map((brand) => (
                  <div key={brand.id} className="border rounded-lg shadow p-4 bg-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{brand.name}</p>
                      </div>
                      <button
                        onClick={() => setExpandedId(expandedId === brand.id ? null : brand.id)}
                        className={`transform transition-transform duration-300 ${
                          expandedId === brand.id ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>

                    {expandedId === brand.id && (
                      <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEditClick(brand)}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            <Settings size={16} /> Update
                          </button>
                          <button
                            onClick={() => setConfirmDelete(brand.id)}
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
                <p className="text-gray-500">No brands found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="bg-white p-4 mt-4 rounded-b-lg shadow flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </div>
        </>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this brand?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBrand}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{editId ? "Update Brand" : "Add Brand"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
