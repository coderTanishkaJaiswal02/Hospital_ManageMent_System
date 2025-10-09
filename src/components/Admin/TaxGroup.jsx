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
import { Shield, PlusCircle, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Pagination from "../common/Pagination";

const TaxGroups = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.taxGroups);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "" });
  const [showNameErrorModal, setShowNameErrorModal] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchTaxGroups()).unwrap().catch(() => toast.error("Failed to fetch groups!"));
  }, [dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
        setShowAddModal(false);
        dispatch(fetchTaxGroups());
      })
      .catch(() => toast.error("Failed to add group!"));
  };

  const handleEditSubmit = (e) => {
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
        setShowEditModal(false);
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

  const filteredData = data.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
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
    <div className="max-w-6xl mx-auto flex flex-col">
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
            placeholder="Search by Name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-blue-500 font-semibold px-6 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
        >
          <PlusCircle size={20} /> Add Group
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
    {/* ✅ Group List Section */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Groups: {filteredData.length}
      </div>

      {/* ✅ Desktop Version */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Name</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col py-4 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((group, index) => (
              <div
                key={group.id}
                className="grid grid-cols-3 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>
                <div className="font-medium">{group.name}</div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditGroup(group);
                      setShowEditModal(true);
                    }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(group.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-24">
              <p className="text-black text-lg">No groups found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Mobile Version */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((group, index) => (
            <div
              key={group.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-blue-600">
                    {(currentPage - 1) * itemsPerPage + index + 1}. {group.name}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === group.id ? null : group.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === group.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === group.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700">
                  <p>No additional information</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditGroup(group);
                        setShowEditModal(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(group.id)}
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
            No groups found.
          </p>
        )}
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>

          {currentPage > 2 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-100"
              >
                1
              </button>
              {currentPage > 3 && <span>...</span>}
            </>
          )}

          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                num === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`}
            >
              {num}
            </button>
          ))}

          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <span>...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-100"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
        {/* ✅ Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  </>
)}


      {/* ---------------- POPUPS ---------------- */}
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Tax Group</h3>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              <input type="text" name="name" placeholder="Group Name" value={formData.name} onChange={handleChange} required className="border p-2 rounded"/>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Tax Group</h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <input type="text" name="name" placeholder="Group Name" value={editGroup.name} onChange={(e)=>setEditGroup({...editGroup,name:e.target.value})} required className="border p-2 rounded"/>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={()=>{setShowEditModal(false);setEditGroup(null)}} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this group?</p>
            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowDeleteModal(false)} className="px-4 py-2 rounded border hover:bg-gray-100">Cancel</button>
              <button onClick={handleDeleteConfirmed} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Name Error Modal */}
      {showNameErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Error</h3>
            <p className="mb-4">Group name already exists!</p>
            <div className="flex justify-end">
              <button onClick={()=>setShowNameErrorModal(false)} className="px-4 py-2 rounded border hover:bg-gray-100">OK</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaxGroups;
