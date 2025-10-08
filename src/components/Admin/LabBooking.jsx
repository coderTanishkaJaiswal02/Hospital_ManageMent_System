import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchlabBooking,
  insertlabBooking,
  updatelabBooking,
  deletelabBooking,
} from "../../redux/Slices/LabBookingSlice";
import { fetchDoctors, fetchPatients } from "../../redux/Slices/AppointmentSlice";
import { fetchLabsTests } from "../../redux/Slices/LabTestSlice";
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
import Pagination from "../common/Pagination";

export default function LabBooking() {
  const dispatch = useDispatch();

  const { booking = [],loading } = useSelector((state) => state.labBooking);
  const { doctors = [], patients = [] } = useSelector(
    (state) => state.appointment
  );
  const { labsTestsData = [] } = useSelector((state) => state.labsTests || {});

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    doctor_id: "",
    patient_id: "",
    date: "",
    time: "",
    lab_test_ids: [],
    gender: "",
    age: "",
  });

  // 🔹 Fetch all data
  useEffect(() => {
    dispatch(fetchlabBooking());
    dispatch(fetchDoctors());
    dispatch(fetchPatients());
    dispatch(fetchLabsTests());
  }, [dispatch]);

  // 🔹 Autofill form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        doctor_id: editData.doctor_id || "",
        patient_id: editData.patient_id || "",
        lab_test_ids: editData.lab_test_ids || [],
        gender: editData.gender || patients[editData.patient_id]?.gender || "",
        age: editData.age || patients[editData.patient_id]?.age || "",
        date: "",
        time: "",
      });
    }
  }, [editData, patients]);

  // 🔹 Reset form
  const resetForm = () => {
    setFormData({
      doctor_id: "",
      patient_id: "",
      date: "",
      time: "",
      lab_test_ids: [],
      gender: "",
      age: "",
    });
    setEditData(null);
  };

  // 🔹 Filter bookings by search
  const filteredBookings = booking.filter((b) => {
    if (!search) return true;
    return b?.patient?.name
      ?.toLowerCase()
      .includes(search.trim().toLowerCase());
  });


    // Pagination logic
      const [searching, setSearching] = useState("");
      const [page, setPage] = useState(1);
      const limit = 10; // items per page
      const totalPages = Math.ceil(filteredBookings .length / limit);
      const startIndex = (page - 1) * limit;
      const currentData = filteredBookings .slice(startIndex, startIndex + limit);
  
      // Reset to page 1 when search term changes
      useEffect(() => {
        setPage(1);
      }, [searching]);
    


  // 🔹 Delete booking
  const handleDelete = async (id) => {
    try {
      await dispatch(deletelabBooking(id)).unwrap();
      toast.success("Booking deleted successfully! 🎉");
      dispatch(fetchlabBooking());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  // 🔹 Add / Update booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = editData
      ? {
          gender: formData.gender,
          age: formData.age,
          lab_test_ids: formData.lab_test_ids,
        }
      : {
          doctor_id: formData.doctor_id || null,
          patient_id: formData.patient_id,
          date: formData.date || null,
          time: formData.time || null,
          lab_test_ids: formData.lab_test_ids || [],
        };

    try {
      if (!editData) {
        await dispatch(insertlabBooking(payload)).unwrap();
        toast.success("Booking added successfully! 🎉");
      } else {
        await dispatch(
          updatelabBooking({ id: editData.id, payload })
        ).unwrap();
        toast.success("Booking updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchlabBooking());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

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
                Lab Booking Management
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
            + New Booking
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search bookings..."
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
    {/* Bookings List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Bookings: {filteredBookings.length}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S No.</div>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Date</div>
          <div>Status</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-2 gap-2 mt-2">
          { currentData.length > 0 ? (
             currentData.map((b, index) => (
              <div
                key={b.id}
                className="grid grid-cols-6 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div>{index + 1}</div>
                <div>{patients[b.patient_id]?.name}</div>
                <div>{doctors[b.doctor_id]?.name || "N/A"}</div>
                <div>{b.date || "-"}</div>
                <div>{b.status}</div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditData(b);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit size={18} /> Update
                  </button>
                  <button
                    onClick={() => setDeleteId(b.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-6">
              <p className="text-black">No bookings found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        { currentData.length > 0 ? (
           currentData.map((b) => (
            <div key={b.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{patients[b.patient_id]?.name}</p>
                  <p className="text-gray-600 text-sm">
                    {doctors[b.doctor_id]?.name || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === b.id ? null : b.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === b.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === b.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Booking ID: </span>
                    {b.id}
                  </p>
                  <p>
                    <span className="font-semibold">Date: </span>
                    {b.date || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Status: </span>
                    {b.status}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(b);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(b.id)}
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
          <p className="flex items-center text-xl text-black">No bookings found.</p>
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
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl  max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editData ? "Edit Booking" : "Add Booking"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Patient Select */}
           <div>  
             <label className="block font-semibold mb-1">Patient</label>
              <select
                value={formData.patient_id}
                onChange={(e) =>
                  setFormData({ ...formData, patient_id: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
                disabled={!!editData}
              >
                <option value="">Select Patient</option>
                {Object.values(patients).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              </div>

              {/* Doctor Select - only for new */}
             <div>
               <label className="block font-semibold mb-1">Doctor</label>
                <select
                  value={formData.doctor_id}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor_id: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Doctor</option>
                  {Object.values(doctors).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
             </div>

              {/* Date & Time - only for new */}
             
                <>
                 <label className="block font-semibold mb-1">date &  Time</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />

                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </>
             

              {/* Gender - only for update */}
              <div>
                 <label className="block font-semibold mb-1">Gender</label>
              {editData && (
                <select
                  value={formData.gender || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              )}
</div>
              {/* Age - only for update */}
            <div> 
               <label className="block font-semibold mb-1">Age</label> {editData && (
                <input
                  type="number"
                  placeholder="Enter Age"
                  value={formData.age || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              )}
</div>
          <div>  
             <label className="block font-semibold mb-1">Lab Test </label>
                  <select
    multiple
    value={formData.lab_test_ids}
    onChange={(e) => {
      let selected = Array.from(e.target.selectedOptions, (opt) => opt.value);

      // ✅ Condition: allow max 2 selections
      if (selected.length <= 2) {
        setFormData({ ...formData, lab_test_ids: selected });
      }
    }}
    className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    {Object.values(labsTestsData).map((t) => {
      const disabled =
        formData.lab_test_ids.length >= 2 &&
        !formData.lab_test_ids.includes(String(t.id));
      return (
        <option
          key={t.id}
          value={t.id}
          disabled={disabled} // condition applied
          className={disabled ? "text-gray-400" : ""}
        >
          {t.name}
        </option>
      );
    })}
  </select>
  </div>
 
              {/* Buttons */}
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
            <p className="mb-4">Are you sure you want to delete this booking?</p>
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


// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchlabBooking,
//   insertlabBooking,
//   updatelabBooking,
//   deletelabBooking,
// } from "../Slice/LabBookingSlice";
// import { fetchDoctors, fetchPatients } from "../Slice/AppointmentSlice";
// import { fetchLabsTests } from "../Slice/LabTestSlice";
// import {
//   Search,
//   Shield,
//   Trash2,
//   Edit,
//   PlusCircle,
//   MoreVertical,
// } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // ✅ Reusable MultiSelect Component
// const MultiSelect = ({ options, value, onChange }) => {
//   const [open, setOpen] = useState(false);

//   const toggleOption = (id) => {
//     if (value.includes(id)) {
//       onChange(value.filter((v) => v !== id));
//     } else {
//       onChange([...value, id]);
//     }
//   };

//   return (
//     <div className="relative w-full">
//       {/* Selected tags */}
//       <div
//         className="flex flex-wrap gap-2 border p-2 rounded cursor-pointer bg-white min-h-[42px]"
//         onClick={() => setOpen(!open)}
//       >
//         {value.length > 0 ? (
//           value.map((id) => {
//             const option = options.find((o) => o.id === id);
//             return (
//               <span
//                 key={id}
//                 className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
//               >
//                 {option?.name}
//               </span>
//             );
//           })
//         ) : (
//           <span className="text-gray-400">Select lab tests...</span>
//         )}
//       </div>

//       {/* Dropdown list */}
//       {open && (
//         <div className="absolute mt-1 max-h-48 w-full overflow-auto rounded border bg-white shadow-lg z-10">
//           {options.map((opt) => (
//             <label
//               key={opt.id}
//               className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
//             >
//               <input
//                 type="checkbox"
//                 checked={value.includes(opt.id)}
//                 onChange={() => toggleOption(opt.id)}
//               />
//               {opt.name}
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function LabBooking() {
//   const dispatch = useDispatch();

//   const { booking = [] } = useSelector((state) => state.labBooking);
//   const { doctors = [], patients = [] } = useSelector(
//     (state) => state.appointment
//   );
//   const { labsTestsData = [] } = useSelector((state) => state.labsTests || {});

//   const [search, setSearch] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [expandedId, setExpandedId] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);

//   const [formData, setFormData] = useState({
//     doctor_id: "",
//     patient_id: "",
//     date: "",
//     time: "",
//     lab_test_ids: [],
//   });

//   // 🔹 Fetch all data
//   useEffect(() => {
//     dispatch(fetchlabBooking());
//     dispatch(fetchDoctors());
//     dispatch(fetchPatients());
//     dispatch(fetchLabsTests());
//   }, [dispatch]);

//   // 🔹 Autofill form when editing
//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         doctor_id: editData.doctor_id || "",
//         patient_id: editData.patient_id || "",
//         date: editData.date || "",
//         time: editData.time || "",
//         lab_test_ids: editData.lab_test_ids || [],
//       });
//     }
//   }, [editData]);

//   // 🔹 Reset form
//   const resetForm = () => {
//     setFormData({
//       doctor_id: "",
//       patient_id: "",
//       date: "",
//       time: "",
//       lab_test_ids: [],
//     });
//     setEditData(null);
//   };

//   // 🔹 Filter bookings by search
//   const filteredBookings = booking.filter((b) => {
//     if (!search) return true;
//     return b?.patient?.name
//       ?.toLowerCase()
//       .includes(search.trim().toLowerCase());
//   });

//   // 🔹 Delete booking
//   const handleDelete = async (id) => {
//     try {
//       await dispatch(deletelabBooking(id)).unwrap();
//       toast.success("Booking deleted successfully! 🎉");
//       dispatch(fetchlabBooking());
//     } catch {
//       toast.error("Delete failed! 🚫");
//     }
//     setDeleteId(null);
//   };

//   // 🔹 Add / Update booking
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       doctor_id: formData.doctor_id || null,
//       patient_id: formData.patient_id,
//       date: formData.date || null,
//       time: formData.time || null,
//       lab_test_ids: formData.lab_test_ids || [],
//     };

//     try {
//       if (!editData) {
//         await dispatch(insertlabBooking(payload)).unwrap();
//         toast.success("Booking added successfully! 🎉");
//       } else {
//         await dispatch(
//           updatelabBooking({ user_id: editData.id, payload })
//         ).unwrap();
//         toast.success("Booking updated successfully! 🎉");
//       }
//       resetForm();
//       dispatch(fetchlabBooking());
//       setShowForm(false);
//     } catch {
//       toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
//     }
//   };

//   return (
//     <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 text-white p-4 rounded-xl shadow flex justify-between flex-col gap-4 mb-6">
//         <div className="flex flex-row gap-2 items-center justify-between">
//           <div className="flex gap-2 items-center">
//             <div className="bg-blue-400 rounded-xl border border-blue-300 p-3">
//               <Shield size={32} color="white" />
//             </div>
//             <div className="flex flex-col">
//               <h2 className="text-xl md:text-2xl font-bold">Lab Bookings</h2>
//               <p className="text-sm opacity-80">Manage lab test bookings</p>
//             </div>
//           </div>

//           <button
//             onClick={() => {
//               resetForm();
//               setShowForm(true);
//             }}
//             className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
//           >
//             <PlusCircle size={18} /> New Booking
//           </button>
//         </div>

//         <div className="flex flex-col md:flex-row items-center justify-between gap-3">
//           <div className="flex items-center bg-white p-2 rounded-lg shadow w-full md:w-64">
//             <Search size={18} className="text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search patient..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="flex-1 outline-none text-gray-700"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Total count */}
//       <div className="mb-2 font-semibold text-gray-700">
//         Total Bookings: {booking.length}
//       </div>

//       {/* Desktop Table */}
//       <div className="overflow-x-auto bg-white rounded-xl shadow hidden md:block">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-white text-left rounded text-sm md:text-base">
//               <th className="p-3">Booking ID</th>
//               <th className="p-3">Patient</th>
//               <th className="p-3">Doctor</th>
//               <th className="p-3">Date</th>
//               <th className="p-3">Status</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredBookings.length > 0 ? (
//               filteredBookings.map((b) => (
//                 <tr key={b.id} className="hover:bg-gray-50 text-sm md:text-base">
//                   <td className="p-3">{b.id}</td>
//                   <td className="p-3">{patients[b.patient_id]?.name}</td>
//                   <td className="p-3">{doctors[b.doctor_id]?.name || "N/A"}</td>
//                   <td className="p-3">{b.date || "-"}</td>
//                   <td className="p-3">{b.status}</td>
//                   <td className="p-3 flex justify-center gap-2">
//                     <button
//                       onClick={() => {
//                         setEditData(b);
//                         setShowForm(true);
//                       }}
//                       className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center gap-1"
//                     >
//                       <Edit size={14} /> Update
//                     </button>
//                     <button
//                       onClick={() => setDeleteId(b.id)}
//                       className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
//                     >
//                       <Trash2 size={14} /> Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center p-4">
//                   No bookings found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="md:hidden flex flex-col gap-4">
//         {filteredBookings.length > 0 ? (
//           filteredBookings.map((b) => (
//             <div key={b.id} className="border rounded-lg shadow p-4 bg-white">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold">{b.patient?.name}</p>
//                   <p className="text-gray-600 text-sm">
//                     {doctors[b.doctor_id]?.name || "N/A"}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     setExpandedId(expandedId === b.id ? null : b.id)
//                   }
//                 >
//                   <MoreVertical size={20} />
//                 </button>
//               </div>

//               {expandedId === b.id && (
//                 <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
//                   <p>
//                     <span className="font-semibold">Booking ID: </span>
//                     {b.id}
//                   </p>
//                   <p>
//                     <span className="font-semibold">Date: </span>
//                     {b.date || "-"}
//                   </p>
//                   <p>
//                     <span className="font-semibold">Status: </span>
//                     {b.status}
//                   </p>
//                   <div className="flex gap-2 mt-2">
//                     <button
//                       onClick={() => {
//                         setEditData(b);
//                         setShowForm(true);
//                       }}
//                       className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                     >
//                       <Edit size={16} /> Update
//                     </button>
//                     <button
//                       onClick={() => setDeleteId(b.id)}
//                       className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                     >
//                       <Trash2 size={16} /> Delete
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No bookings found.</p>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl">
//             <h3 className="text-lg font-semibold mb-4">
//               {editData ? "Edit Booking" : "Add Booking"}
//             </h3>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               {/* Patient Select */}
//               <select
//                 value={formData.patient_id}
//                 onChange={(e) =>
//                   setFormData({ ...formData, patient_id: e.target.value })
//                 }
//                 className="border p-2 rounded w-full"
//                 required
//               >
//                 <option value="">Select Patient</option>
//                 {Object.values(patients).map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>

//               {/* Doctor Select */}
//               <select
//                 value={formData.doctor_id}
//                 onChange={(e) =>
//                   setFormData({ ...formData, doctor_id: e.target.value })
//                 }
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="">Select Doctor</option>
//                 {Object.values(doctors).map((d) => (
//                   <option key={d.id} value={d.id}>
//                     {d.name}
//                   </option>
//                 ))}
//               </select>

//               {/* Date */}
//               <input
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) =>
//                   setFormData({ ...formData, date: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />

//               {/* Time */}
//               <input
//                 type="time"
//                 value={formData.time}
//                 onChange={(e) =>
//                   setFormData({ ...formData, time: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />

//                {/* Lab Tests MultiSelect
//               <MultiSelect
//                 options={Object.values(labsTestsData)}
//                 value={formData.lab_test_ids}
//                 onChange={(selected) =>
//                   setFormData({ ...formData, lab_test_ids: selected })
//                 }
//               /> */}

//               {/* Lab Tests MultiSelect*
//               <MultiSelect
//                value={formData.lab_test_ids}
//   onChange={(e) => {
//     let selected = Array.from(e.target.selectedOptions, (opt) => opt.value);

//     // Restrict selection to max 2
//     if (selected.length > 2) {
//       selected = selected.slice(0, 2);
//       alert("You can only select up to 2 lab tests!");
//     }

//     setFormData({ ...formData, lab_test_ids: selected });
//   }}
//   className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
// > 
// {/* Lab Tests Multi Select (Max 2 Allowed) */}
// {/* <div className="flex flex-col gap-1">
//   <label className="text-sm font-medium text-gray-700">
//     Select Lab Tests <span className="text-gray-500">(max 2)</span>
//   </label>
//   <select
//     multiple
//     value={formData.lab_test_ids}
//     onChange={(e) => {
//       const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);

//       // Keep only max 2
//       if (selected.length <= 2) {
//         setFormData({ ...formData, lab_test_ids: selected });
//       }
//     }}
//     className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
//   >
//     {Object.values(labsTestsData).map((t) => {
//       const disabled =
//         formData.lab_test_ids.length >= 2 &&
//         !formData.lab_test_ids.includes(String(t.id));
//       return (
//         <option
//           key={t.id}
//           value={t.id}
//           disabled={disabled}
//           className={disabled ? "text-gray-400" : ""}
//         >
//           {t.name}
//         </option>
//       );
//     })}
//   </select>

//   <span className="text-xs text-gray-500">
//     {formData.lab_test_ids.length}/2 selected
//   </span>
// </div> */}




// {/* Lab Test Single Select */}
// <div className="flex flex-col gap-1">
//   <label className="text-sm font-medium text-gray-700">
//     Select Lab Test
//   </label>

//   <select
//     value={formData.lab_test_ids[0] || ""}   // only one stored
//     onChange={(e) =>
//       setFormData({ ...formData, lab_test_ids: [e.target.value] })
//     }
//     className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
//   >
//     <option value="">-- Select a Lab Test --</option>
//     {Object.values(labsTestsData).map((t) => (
//       <option key={t.id} value={t.id}>
//         {t.name}
//       </option>
//     ))}
//   </select>
// </div>

              

//               {/* Buttons */}
//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="px-4 py-2 border rounded-xl"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
//                 >
//                   {editData ? "Update" : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteId && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
//             <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
//             <p className="mb-4">Are you sure you want to delete this booking?</p>
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 border rounded-xl"
//                 onClick={() => setDeleteId(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
//                 onClick={() => handleDelete(deleteId)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




