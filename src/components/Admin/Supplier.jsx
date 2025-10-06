import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchdata,
  insertData,
  updateData,
  deleteData,
} from "../../redux/Slices/SupplierSlice";

// ✅ Lucide-react icons
import { Trash2, Search,  Shield, ChevronUp, Edit, ChevronDown, Ambulance} from "lucide-react";

// ✅ Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleCell from "../common/ToggleCell";

const Supplier = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.Supplier);
  

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    dispatch(fetchdata());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await dispatch(updateData({ id: editId, formData })).unwrap();
        toast.success("Supplier updated successfully!");
      } else {
        await dispatch(insertData(formData)).unwrap();
        toast.success("Supplier added successfully!");
      }
      resetForm();
      dispatch(fetchdata()); // refresh list
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: "", description: "", address: "", city: "" });
    setShowForm(false);
  };

  const handleEditClick = (post) => {
    setEditId(post.id);
    setFormData({
      name: post.name || "",
      description: post.description || "",
      address: post.address || "",
      city: post.city || "",
    });
    setShowForm(true);
  };

  const confirmDeleteSupplier = async () => {
    if (confirmDelete) {
      try {
        await dispatch(deleteData(confirmDelete)).unwrap();
        toast.success("Supplier deleted successfully!");
        dispatch(fetchdata());
      } catch {
        toast.error("Delete failed!");
      }
      setConfirmDelete(null);
    }
  };

  const filteredData = Array.isArray(data)
    ? data.filter((post) => {
        const query = search.toLowerCase();
        return (
          (post.name && post.name.toLowerCase().includes(query)) ||
          (post.description &&
            post.description.toLowerCase().includes(query)) ||
          (post.city && post.city.toLowerCase().includes(query))
        );
      })
    : [];

    

  return (
    <div className="md:px-2 min-w-full bg-gray-50 min-h-screen relative">
      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />
     
      {/* Header */}
      <div className="  bg-gradient-to-r from-blue-500 to-blue-600 gap-2 rounded-b-none rounded-lg  md:px-4 md:py-8 py-4 border-collapse">
        <div className="flex px-4 flex-row justify-between sm:items-center ">
          <div className="flex justify-items-center gap-3">
            <div className="bg-blue-400  flex items-center justify-center rounded-xl border border-blue-300 p-2">
              <Ambulance size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl  sm:text-2xl text-white font-bold">
                Supplier Management
              </h1>
              {/* <p className="text-white hidden md:block">Manage system suppliers</p> */}
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-md"
          >
            + New Supplier
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search suppliers..."
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

      ):(
      <>
  {/* Supplier List */}
      <div className="bg-white rounded  rounded-t-none shadow p-4">
        <div className="text-lg font-semibold border-b pb-2 mb-4">
          Total Suppliers: {filteredData.length}
        </div>


        {/* Desktop version */}

<div className="hidden md:block">
 
  <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
    <div>S.No</div>
    <div>Name</div>
    <div>Description</div>
    <div>Address</div>
    <div>City</div>
    <div className="text-center">Actions</div>
  </div>

  <div className="flex flex-col py-6 gap-2 mt-2">
    {filteredData.length > 0 ? (
      filteredData.map((post, index) => (
        <div
          key={post.id}
          className="grid grid-cols-6 gap-2  px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
        >
          <div >{index + 1}</div>

       
          <div>
            <ToggleCell text={post.name} limit={10} />
          </div>
          <div>
            <ToggleCell text={post.description} limit={10} />
          </div>
          <div>
            <ToggleCell text={post.address} limit={10} />
          </div>
          <div>
            <ToggleCell text={post.city} limit={10} />
          </div>

          
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleEditClick(post)}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              <Edit size={18} />
              Update
            </button>
            <button
              onClick={() => setConfirmDelete(post.id)}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      ))
    ) : (
      <div className="flex justify-center items-center ">
      <p className=" text-black">No suppliers found.</p>
      </div>
    )}
  </div>
</div> 
        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-4">
          {filteredData.length > 0 ? (
            filteredData.map((post, index) => (
              <div
                key={post.id}
                className="border rounded-lg shadow p-4 bg-white"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{post.name}</p>
                    <p className="text-gray-600 text-sm">{post.city}</p>
                  </div>
                     <button
                  onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                  className={`transform transition-transform duration-300 ${
                  expandedId === post.id ? "rotate-180" : "rotate-0"
                  }`}
                  >
                  <ChevronDown size={20} />
                  </button>
                </div>

                {expandedId === post.id && (
                  <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                    <p>
                      <span className="font-semibold">Description: </span>
                      {post.description}
                    </p>
                    <p>
                      <span className="font-semibold">Address: </span>
                      {post.address}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditClick(post)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        <Edit size={16} />
                        Update
                      </button>
                      <button
                        onClick={() => setConfirmDelete(post.id)}
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
            <p className= "flex items-center text-xl text-black">No suppliers found.</p>
          )}
          
        </div>
        </div>
        </>
)}  
       
    {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this supplier?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSupplier}
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
            <h2 className="text-lg font-semibold mb-4">
              {editId ? "Update Supplier" : "Add Supplier"}
            </h2>
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
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
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

export default Supplier;
