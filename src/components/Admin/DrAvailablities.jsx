import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDrAvailablities,
  insertDrAvailablities,
  updateDrAvailablities,
  deleteDrAvailablities,
} from "../../redux/Slices/DrAvailablitiesSlice";
import { fetchDoctors } from "../../redux/Slices/AppointmentSlice";
import {
  Trash2,
  Edit,
  PlusCircle,
  Search,
  Shield,
  ChevronDown,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../common/Pagination";

const DrAvailablities = () => {
  const dispatch = useDispatch();
  const { DrAvailablities, loading } = useSelector((state) => state.DrAvailablities);
  const { doctors } = useSelector((state) => state.appointment);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    doctor_id: "",
    time: [{ start: "", end: "" }],
    slot_brack_time: "",
  });

  useEffect(() => {
    dispatch(fetchDrAvailablities());
    dispatch(fetchDoctors());
  }, [dispatch]);


  const filteredAvailabilities = DrAvailablities.filter((item) => {
  const doctorName = doctors[item.doctor_id]?.name || "";
  const times = item.time?.map((t) => `${t.start} ${t.end}`).join(" ") || "";
  const slotBreak = item.slot_brack_time || "";

  // combine all searchable fields
  const combined = `${doctorName} ${times} ${slotBreak} `.toLowerCase();

  return combined.includes(search.toLowerCase());
});

  // Pagination logic
  const [searching, setSearching] = useState("");
  const [page, setPage] = useState(1);
  const limit =5;
  const totalPages = Math.ceil(filteredAvailabilities.length / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filteredAvailabilities.slice(startIndex, startIndex + limit);

  useEffect(() => {
    setPage(1);
  }, [searching]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (e, index, field) => {
  const newTimes = [...formData.time];
  newTimes[index] = { ...newTimes[index], [field]: e.target.value };
  setFormData((prev) => ({ ...prev, time: newTimes }));
};


  const addTimeField = () => {
    setFormData((prev) => ({ ...prev, time: [...prev.time, { start: "", end: "" }] }));
  };

  const removeTimeField = (index) => {
    const newTimes = formData.time.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, time: newTimes }));
  };

  const resetForm = () => {
    setFormData({ doctor_id: "", time: [{ start: "", end: "" }], slot_brack_time: "" });
    setEditData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await dispatch(updateDrAvailablities({ id: editData.id, payload: formData })).unwrap();
        toast.success("Availability updated successfully!");
      } else {
        await dispatch(insertDrAvailablities(formData)).unwrap();
        toast.success("Availability added successfully!");
      }
      resetForm();
      setShowForm(false);
      dispatch(fetchDrAvailablities());
    } catch {
      toast.error(editData ? "Update failed!" : "Add failed!");
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setFormData({
      doctor_id: data.doctor_id,
      time: data.time.length ? data.time : [{ start: "", end: "" }],
      slot_brack_time: data.slot_brack_time,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDrAvailablities(id)).unwrap();
      toast.success("Availability deleted successfully!");
      dispatch(fetchDrAvailablities());
    } catch {
      toast.error("Delete failed!");
    }
    setDeleteId(null);
  };

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}

      <div className="  bg-gradient-to-r from-blue-500 to-blue-600 gap-2 rounded-b-none rounded-lg  md:px-4 md:py-8 py-4 border-collapse">
        <div className="flex px-4 flex-row justify-between sm:items-center ">
          <div className="flex justify-items-center gap-3">
            <div className="bg-blue-400  flex items-center justify-center rounded-xl border border-blue-300  p-2 md:px-4 md:py-2">
              <Shield size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl  sm:text-2xl text-white font-bold">
           Dr Availabilities Management
              </h1>
               <p className="text-white hidden md:block">Manage system of Dr Availabilities</p> 
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-white text-blue-600 p-2 md:px-4 md:py-2 rounded-md"
          >
            + New Availability
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search doctors..."
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
) : (
  <>
    {/* Availability List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Availabilities: {filteredAvailabilities.length}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Doctor</div>
          <div>Times</div>
          <div>Slot Break</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-6 gap-2 mt-2">
         {currentData.length > 0 ? (
  currentData.map((item, index) => (

              <div
                key={item.id}
                className="grid grid-cols-5 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
               <div>{startIndex + index + 1}</div>

                <div>{doctors[item.doctor_id]?.name || "Unknown Doctor"}</div>
                <div>
                  {item.time?.map((t) => `${t.start} - ${t.end}`).join(", ") || "No time slots"}
                </div>
                <div>{item.slot_brack_time || "-"}</div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit size={16} /> Update
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-black">No availabilities found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
                currentData.map((item, index) => (
            <div key={item.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold flex gap-2">
                   <span>{startIndex + index + 1}.</span>
                    <span>{doctors[item.doctor_id]?.name || "Unknown Doctor"}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Times: {item.time?.map((t) => `${t.start} - ${t.end}`).join(", ") || "No time slots"}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className={`transform transition-transform duration-300 ${
                    expandedId === item.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === item.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Slot Break: </span>
                    {item.slot_brack_time || "-"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
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
          <p className="flex items-center text-xl text-black">No availabilities found.</p>
        )}
      </div>
       {/* ✅ Pagination added here */}
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
              {editData ? "Edit Availability" : "Add Availability"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Doctor</label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Doctor</option>
                {Object.values(doctors).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
</div>
<div>
   <label className="block font-semibold mb-1">Time slot</label>
              {formData.time.map((t, i) => (
                <div key={i} className="flex gap-2">
                  
                  <input
                    type="text"
                    value={t.start}
                    onChange={(e) => handleTimeChange(e, i, "start")}
                    className="border p-2 rounded flex-1"
                    placeholder="Starting Time e.g. 10:00 AM"
                    required
                  />

                  <input
                    type="text"
                    value={t.end}
                    onChange={(e) => handleTimeChange(e, i, "end")}
                    className="border p-2 rounded flex-1"
                    placeholder="Ending Time e.g. 11:00 AM"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removeTimeField(i)}
                    className="text-red-500"
                  >
                    X
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTimeField} className="text-blue-500">
                + Add Time
              </button>
              </div>
<div>
   <label className="block font-semibold mb-1">Slot Break Time</label>
              <input
                type="text"
                name="slot_brack_time"
                value={formData.slot_brack_time}
                onChange={handleChange}
                placeholder=" Enter Slot Break Time"
                className="border p-2 rounded w-full"
                required
              />
</div>
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this availability?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded-xl" onClick={() => setDeleteId(null)}>
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
};


export default DrAvailablities;