
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  fetchDoctors,
  fetchPatients,
  insertAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} from "../../redux/Slices/AppointmentSlice";
 // <-- adjust path if needed
import { Search, Shield, Trash2, PlusCircle, MoreVertical, ChevronUp, ChevronDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleCell from "../common/ToggleCell";
import Pagination from "../common/Pagination";

export default function Appointments() {
  const dispatch = useDispatch();
  const { appointments, doctors, patients, loading } = useSelector(
    (state) => state.appointment
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    doctor_id: "",
    patient_id: "",
    date: "",
    time: [],
    appointment_type: "",
    duration: "",
    notes: "",
    price: "",
  });

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDoctors());
    dispatch(fetchPatients());
  }, [dispatch]);

  const filteredAppointments = (appointments || []).filter((app) => {
    const patientName = patients[app.patient_id]?.name || "";
    const doctorName = doctors[app.doctor_id]?.name||"";
    const typeName =app.appointment_type||"";
    const priceName =app. price||"";
    const dateName =app.date||"";

    const combined =`${patientName} ${doctorName} ${typeName} ${priceName} ${dateName}`
    return combined .toLowerCase().includes(search.toLowerCase());
  });

    // Pagination logic
      const [searching, setSearching] = useState("");
      const [page, setPage] = useState(1);
      const limit = 10; // items per page
      const totalPages = Math.ceil(filteredAppointments.length / limit);
      const startIndex = (page - 1) * limit;
      const currentData = filteredAppointments.slice(startIndex, startIndex + limit);
  
      // Reset to page 1 when search term changes
      useEffect(() => {
        setPage(1);
      }, [searching]);
    
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAppointment(id)).unwrap();
      toast.success("Appointment deleted successfully! 🎉");
      dispatch(fetchAppointments());
    } catch (err) {
      console.error(err);
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ensure time is an array of non-empty strings
    const timeSlots = (formData.time || [])
      .map((t) => String(t).trim())
      .filter((t) => t.length > 0);

    if (!formData.patient_id || timeSlots.length === 0 || !formData.date) {
      toast.error("Please fill required fields and at least one time slot! 🚫");
      return;
    }

    const payload = {
      ...formData,
      doctor_id: formData.doctor_id ? Number(formData.doctor_id) : null,
      patient_id: Number(formData.patient_id),
      time: timeSlots,
    };

    try {
      await dispatch(insertAppointment(payload)).unwrap();
      toast.success("Appointment added successfully! 🎉");
      resetForm();
      dispatch(fetchAppointments());
    } catch (err) {
      console.error(err);
      toast.error("Add failed! 🚫");
    }
  };

  const resetForm = () => {
    setFormData({
      doctor_id: "",
      patient_id: "",
      date: "",
      time: [],
      appointment_type: "",
      duration: "",
      notes: "",
      price: "",
    });
    setShowForm(false);
  };

  // Helper to safely show time array as string
  const timeToString = (time) => {
    if (Array.isArray(time)) return time.join(", ");
    if (!time) return "";
    return String(time);
  };

  // Status options — replace with live fetch if your API provides status list
  const STATUS_OPTIONS = [
    { value: "", label: "--Status--" },
    { value: "1", label: "Booked" },
    { value: "2", label: "Test Prescribed" },
    { value: "3", label: "Completed" },
    { value: "4", label: "Busy" },
    { value: "5", label: "Confirmed" },
    { value: "6", label: "Cancelled" },
  ];

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

     

         {/* Header */}
            <div className="  bg-gradient-to-r from-blue-500 to-blue-600 gap-2 rounded-b-none rounded-lg  md:px-4 md:py-8 py-4 border-collapse">
              <div className="flex px-4 flex-row justify-between sm:items-center ">
                <div className="flex justify-items-center gap-3">
                  <div className="bg-blue-400  flex items-center justify-center rounded-xl border border-blue-300 p-2">
                    <Shield size={24} color="white" />
                  </div>
                  <div>
                    <h1 className="text-xl  sm:text-2xl text-white font-bold">
                      Appointment Management
                    </h1>
                    {/* <p className="text-white hidden md:block">Manage system suppliers</p> */}
                  </div>
                </div>
                <button
                 onClick={() => {
              resetForm();
              setShowForm(true);
            }}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md"
                >
                  + New Appointment
                </button>
              </div>
      
              {/* Search */}
              <div className="mt-4 px-2">
                <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
                  <Search size={24} color="gray" />
                  <input
                   type="text"
                    placeholder="Search by patient..."
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
    {/* Appointments List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Appointments: {filteredAppointments.length}
      </div>

      {/* Desktop version */}
      <div className="hidden md:block">
        <div className="grid grid-cols-10 gap-2px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Date</div>
          <div>Time</div>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Type</div>
          <div>Duration</div>
          <div>Price</div>
          <div className="pr-4">Update Status</div>
          <div>Actions</div>

        </div>

        <div className="flex flex-col py-6 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((app, index) => (
              <div
                key={app.id}
                className="grid grid-cols-10 gap-2  py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div ><ToggleCell text={index + 1} /></div>
                <div><ToggleCell text={app.date} /></div>
                <div><ToggleCell text={timeToString(app.time)} /></div>
                <div><ToggleCell text={patients[app.patient_id]?.name} /></div>
                <div><ToggleCell text={doctors[app.doctor_id]?.name || "Not assigned"} /></div>
                <div><ToggleCell text={app.appointment_type} /></div>
                <div><ToggleCell text={app.duration} /></div>
                <div><ToggleCell text={app.price} /></div>
                <div className="flex mx-2 justify-center  items-center">
                  <select
                    value={String(app.status ?? "")}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        await dispatch(updateAppointmentStatus({ id: app.id, status: newStatus })).unwrap();
                        toast.success("Status updated! 🎉");
                        dispatch(fetchAppointments());
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to update status! 🚫");
                      }
                    }}
                    className="border mx-3 gap-2 pb-1 rounded"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setDeleteId(app.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-black">No appointments found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((app, index) => (
            <div key={app.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{patients[app.patient_id]?.name}</p>
                  <p className="text-gray-600 text-sm">{doctors[app.doctor_id]?.name || "Not assigned"}</p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                  className={`transform transition-transform duration-300 ${expandedId === app.id ? "rotate-180" : "rotate-0"}`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === app.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p><span className="font-semibold">Date:</span> {app.date}</p>
                  <p><span className="font-semibold">Time:</span> {timeToString(app.time)}</p>
                  <p><span className="font-semibold">Type:</span> {app.appointment_type}</p>
                  <p><span className="font-semibold">Duration:</span> {app.duration}</p>
                  <p><span className="font-semibold">Price:</span> {app.price}</p>
                  <p><span className="font-semibold">Notes:</span> {app.notes}</p>

                  <div className="flex gap-2 mt-2 items-center">
                    <select
                      value={String(app.status ?? "")}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await dispatch(updateAppointmentStatus({ id: app.id, status: newStatus })).unwrap();
                          toast.success("Status updated! 🎉");
                          dispatch(fetchAppointments());
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to update status! 🚫");
                        }
                      }}
                      className="border p-1 rounded"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setDeleteId(app.id)}
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
          <p className="flex items-center text-xl text-black">No appointments found.</p>
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


      {/* Add Appointment Modal */}
          {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add Appointment</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
          <div>
          <label className="block font-semibold mb-1">Patient</label>
          <select
          value={formData.patient_id}
          onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
          className="border p-2 rounded w-full"
          required
          >
          <option value="">Select Patient</option>
          {Object.values(patients).map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
          ))}
          </select>
          </div>
          <div>
          <label className="block font-semibold mb-1">Doctor</label>
          <select
          value={formData.doctor_id}
          onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
          className="border p-2 rounded w-full"
          >
          <option value="">Select Doctor</option>
          {Object.values(doctors).map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
          ))}
          </select></div>

          <div>  <label className="block font-semibold mb-1">Date</label>

          <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="border p-2 rounded w-full" required />
          </div>
          <div>  <label className="block font-semibold mb-1">Time Slote</label>

          <input type="text" value={formData.time.join(", ")} onChange={(e) => setFormData({ ...formData, time: e.target.value.split(",") })} placeholder=" Enter Time slots (comma separated)" className="border p-2 rounded w-full" required />
          </div>
          <div>  <label className="block font-semibold mb-1">Appointment</label>

          <input type="text" value={formData.appointment_type} onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value })} placeholder=" Enter Appointment Type" className="border p-2 rounded w-full" />
          </div><div>  <label className="block font-semibold mb-1">Duration</label>

          <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder=" Enter Duration" className="border p-2 rounded w-full" />
          </div><div>  <label className="block font-semibold mb-1">Price</label>

          <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder=" Enter Price" className="border p-2 rounded w-full" />
          </div> 
          <div> <label className="block font-semibold mb-1">Notes..</label>
          <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder=" Enter Notes" className="border p-2 rounded w-full" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-xl">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">Save</button>
          </div>
          </form>
          </div>
          </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this appointment?</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border rounded-xl" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
