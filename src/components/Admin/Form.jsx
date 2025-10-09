// src/components/Admin/Form.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, addItem, updateItem, deleteItem } from "../../redux/Slices/FormSlices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shield, Plus, Pen, Trash2, Search } from "lucide-react";
import Pagination from "../common/Pagination";
import ToggleCell from "../common/ToggleCell";

// Simple spinner
const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
    <span className="text-blue-500 font-semibold text-lg">Loading...</span>
  </div>
);

const Form = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.Forms);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [newFormName, setNewFormName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const inputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    if (showAddModal && inputRef.current) inputRef.current.focus();
  }, [showAddModal]);

  const handleAdd = () => {
    if (!newFormName.trim()) {
      toast.error("Form name cannot be empty!");
      return;
    }

    dispatch(addItem(newFormName))
      .unwrap()
      .then(() => toast.success("Data Added Successfully"))
      .catch(() => toast.error("Failed to Add Data"));

    setNewFormName("");
    setShowAddModal(false);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    await dispatch(updateItem({ id: editId, name: editName }))
      .unwrap()
      .then(() => toast.success("Data Updated Successfully"))
      .catch(() => toast.error("Failed to Update Data"));

    await dispatch(fetchData());
    setEditId(null);
    setEditName("");
  };

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteItem(deleteTargetId))
      .unwrap()
      .then(() =>
        toast.success("Item Deleted Successfully", { style: { background: "green", color: "white" } })
      )
      .catch(() => toast.error("Failed to Delete Item"));

    setShowConfirmModal(false);
    setDeleteTargetId(null);
  };

  // Filter data by search term
  const filteredData = data.filter((item) =>
    typeof item.name === "string" && item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="p-4 sm:p-6 max-w-6xl mx-auto flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
  <div className="bg-blue-500 rounded-t px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col w-full md:max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
              <Shield size={28} color="white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Form Dashboard</h2>
          </div>
          <p className="text-white text-sm mb-3">Manage System roles and permission</p>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Forms..."
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


{loading ? (
  // ✅ Loading Overlay
  <div className="flex items-center justify-center h-[400px]">
    <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5"></span>
    <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
  </div>
) : (
  <>
    {/* ✅ Forms List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Forms: {filteredData.length}
      </div>

      {/* ✅ Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Name</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-4 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-3 gap-2 px-6 py-3 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>
                <div>
                  <ToggleCell text={item.name} limit={20} />
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditId(item.id);
                      setEditName(item.name);
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Pen size={16} /> Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(item.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-black text-lg">No forms found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((item, index) => (
            <div key={item.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                </div>
               
              </div>

             
                <div className="mt-3 border-t pt-3 text-sm text-gray-700">
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditId(item.id);
                        setEditName(item.name);
                        setShowAddModal(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Pen size={16} /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(item.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
             
            </div>
          ))
        ) : (
          <p className="flex justify-center items-center text-lg text-black">
            No forms found.
          </p>
        )}
      </div>

      {/* ✅ Pagination */}
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


      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {editId ? <Pen className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editId ? "Edit Form" : "Add New Form"}
            </h2>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter Form Name"
              value={editId ? editName : newFormName}
              onChange={(e) => editId ? setEditName(e.target.value) : setNewFormName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={() => { setShowAddModal(false); setEditId(null); setEditName(""); setNewFormName(""); }}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={editId ? handleUpdate : handleAdd}
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
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this form?</p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button onClick={() => setShowConfirmModal(false)} className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
