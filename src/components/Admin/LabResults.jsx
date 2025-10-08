import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  createUser,
  updateUser,
  deleteUser,
  fetchlabBooking,
} from "../../redux/Slices/LabResultSlice";
import {
  Search,
  Shield,
  Trash2,
  Edit,
  PlusCircle,
  ChevronDown,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleCell from "../common/ToggleCell";
import Pagination from "../common/Pagination";

export default function LabResults() {
  const dispatch = useDispatch();
  const { data, bookings, loading } = useSelector(
    (state) => state.labResult ?? { data: [], bookings: {}, loading: false }
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    booking_test_id: "",
    result: "",
    symbol_id: "",
    remarks: "",
    value: "",
  });
  

  useEffect(() => {
    dispatch(fetchData());
    dispatch(fetchlabBooking());
  }, [dispatch]);

  // Filter results
  const filteredResults = Array.isArray(data)
    ? data.filter((r) => {
        const searchLower = search.toLowerCase();
        return (
          r.booking_test_id?.toString().includes(searchLower) ||
          r.result?.toLowerCase().includes(searchLower) ||
          r.symbol_id?.toLowerCase().includes(searchLower)
        );
      })
    : [];
    
    // Pagination logic
    const [searching, setSearching] = useState("");
    const [page, setPage] = useState(1);
    const limit =5;
    const totalPages = Math.ceil(filteredResults.length / limit);
    const startIndex = (page - 1) * limit;
    const currentData =filteredResults.slice(startIndex, startIndex + limit);
  
    useEffect(() => {
      setPage(1);
    }, [searching]);

  // Handle Save
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.booking_test_id) {
      toast.error("Booking test is required");
      return;
    }

    try {
      if (!editData) {
        await dispatch(createUser(formData)).unwrap();
        toast.success("Lab Result added 🎉");
      } else {
        await dispatch(
          updateUser({ id: editData.id, updatedUser: formData })
        ).unwrap();
        toast.success("Lab Result updated 🎉");
      }
      resetForm();
      setShowForm(false);
      dispatch(fetchData());
    } catch {
      toast.error(editData ? "Update failed 🚫" : "Add failed 🚫");
    }
  };

  const resetForm = () => {
    setFormData({
      booking_test_id: "",
      result: "",
      symbol_id: "",
      remarks: "",
      value: "",
    });
    setEditData(null);
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        booking_test_id: editData.booking_test_id || "",
        result: editData.result || "",
        symbol_id: editData.symbol_id || "",
        remarks: editData.remarks || "",
        value: editData.value || "",
      });
    }
  }, [editData]);

  // Delete
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("Lab Result deleted 🎉");
      dispatch(fetchData());
    } catch {
      toast.error("Delete failed 🚫");
    }
    setDeleteId(null);
  };

  return (
    <div className="p-0 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 gap-2 rounded-b-none rounded-lg md:px-4 md:py-8 py-4 border-collapse">
        <div className="flex px-4 flex-row justify-between sm:items-center">
          <div className="flex justify-items-center gap-3">
            <div className="bg-blue-400 flex items-center justify-center rounded-xl border border-blue-300 p-2">
              <Shield size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl text-white font-bold">
                Lab Results
              </h1>
              <p className="text-white hidden md:block">Manage test results</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            + New Result
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search results..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-1 rounded w-full text-black outline-none"
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
     {loading && (
      <div className="flex justify-center py-8">
        <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-8 h-8"></span>
         <span className="ml-2 text-xl text-blue-600">Loading...</span>
       </div>
     )}

    {!loading && (
      <>
      <div className="bg-white rounded-t-none shadow p-4">
           <div className="text-lg font-semibold border-b pb-2 mb-0">Total Result: {filteredResults.length}</div>

 </div> 
     

      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block bg-white rounded shadow p-0">
        <div className="">
          <div className="grid grid-cols-6 gap-1 px-6 py-3 border-b font-semibold text-gray-700 rounded-t-md">
            <div>S.No</div>
            <div>Booking Test</div>
            <div>Result</div>
            <div>Symbol</div>
            <div>Remarks</div>
            <div className="text-center mr-8">Actions</div>
          </div>

          <div className="flex flex-col py-6 gap-2 mt-2">
            {currentData.length > 0 ? (
              currentData.map((r, index) => (
                <div
                  key={r.id}
                  className="grid grid-cols-6 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
                >
                  <div>{(page - 1) * limit + index + 1}</div>

                  <div>{bookings[r.booking_test_id]?.test_name || r.booking_test_id}</div>
                  <div>
                    <ToggleCell text={r.result} limit={15} />
                  </div>
                  <div>
                    <ToggleCell text={r.symbol_id} limit={15} />
                  </div>
                  <div>
                    <ToggleCell text={r.remarks} limit={15} />
                  </div>
                  <div className="flex justify-center gap-2 mr-7">
                    <button
                      onClick={() => { setEditData(r); setShowForm(true); }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(r.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center px-6">
                <p className="text-black">No results found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4 mt-4 px-4">
        {currentData.length > 0 ? (
          currentData.map((r, index) => (
            <div key={r.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                 <p className="font-semibold">{(page - 1) * limit + index + 1}. {r.result}</p>

                  <p className="text-gray-600 text-sm">
                    Booking: {r.booking_test_id}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  className={`transform transition-transform duration-300 ${
                    expandedId === r.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === r.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p><span className="font-semibold">Symbol: </span>{r.symbol_id}</p>
                  <p><span className="font-semibold">Remarks: </span>{r.remarks}</p>
                  <p><span className="font-semibold">Value: </span>{r.value}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button
                      onClick={() => { setEditData(r); setShowForm(true); }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(r.id)}
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
          <p className="text-gray-500">No results found.</p>
        )}
        
      </div>
      
      <div className="bg-white p-4 mt-0 rounded-b-lg shadow flex justify-center"> 
          <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
      </div>
     
       </>
      )}


      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Result" : "Add Result"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select
                value={formData.booking_test_id}
                onChange={(e) =>
                  setFormData({ ...formData, booking_test_id: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Booking Test</option>
                {Object.values(bookings || {}).map((b) =>
                  b.booking_tests?.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.lab_test.name} (ID: {test.id})
                    </option>
                  ))
                )}
              </select>

              <input
                type="text"
                placeholder="Result"
                value={formData.result}
                onChange={(e) =>
                  setFormData({ ...formData, result: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="text"
                placeholder="Symbol ID"
                value={formData.symbol_id}
                onChange={(e) =>
                  setFormData({ ...formData, symbol_id: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Value"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2 pt-2">
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
                  {editData ? "Update" : "Save"}
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
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this Lab Result?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-xl"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                onClick={() => handleDelete(deleteId)}
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
