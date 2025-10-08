import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPrescriptions,
  fetchMedicines,
  fetchLabsTests,
  fetchAppointments,
  insertPrescriptions,
  updatePrescriptions,
  deletePresriptions,
  fetchlabBooking,
} from "../../redux/Slices/PrescriptionsSlice";

import {
  Search,
  Trash2,
  Edit,
  Shield,
  ChevronUp,
} from "lucide-react";
import Pagination from "../common/Pagination"; // <-- your existing pagination component
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Prescription() {
  const dispatch = useDispatch();
  const { prescriptions = [], medicines = [], LabsTests = [], appointments = [], loading } =
    useSelector((state) => state.prescriptions);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    appointment_id: "",
    symptoms: "",
    blood_pressure: "",
    pulse: "",
    oxygen: "",
    weight: "",
    height: "",
    medicine_id: "",
    dosage: "",
    frequency: "",
    duration: "",
    total_quantity: "",
    labtest_id:"",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchPrescriptions());
    dispatch(fetchMedicines());
    dispatch(fetchLabsTests());
    dispatch(fetchAppointments());
    dispatch(fetchlabBooking());
  }, [dispatch]);

  // Filter + sort newest first
  const filteredPrescriptions = [...prescriptions]
    .filter((p) => (p.symptoms || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.id - a.id);

  const totalPages = Math.ceil(filteredPrescriptions.length / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filteredPrescriptions.slice(startIndex, startIndex + limit);

  useEffect(() => {
    setPage(1); // reset page on search
  }, [search]);

  const resetForm = () => {
    setFormData({
      appointment_id: "",
      symptoms: "",
      blood_pressure: "",
      pulse: "",
      oxygen: "",
      weight: "",
      height: "",
      medicine_id: "",
      dosage: "",
      frequency: "",
      duration: "",
      total_quantity: "",
      labtest_id:"",
    });
    setEditData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      appointment_id: formData.appointment_id,
      symptoms: formData.symptoms,
      blood_pressure: formData.blood_pressure,
      pulse: formData.pulse,
      oxygen: formData.oxygen,
      weight: formData.weight,
      height: formData.height,
      medicines: [
        {
          medicine_id: formData.medicine_id,
          dosage: formData.dosage,
          frequency: formData.frequency,
          duration: formData.duration,
          total_quantity: formData.total_quantity,
        },
      ],
      lab_tests: [{ lab_test_id: formData.labtest_id }],
    };

    try {
      if (!editData) {
        await dispatch(insertPrescriptions(payload)).unwrap();
        toast.success("Prescription added successfully! 🎉");
      } else {
        await dispatch(updatePrescriptions({ id: editData.id, payload })).unwrap();
        toast.success("Prescription updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchPrescriptions());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePresriptions(id)).unwrap();
      toast.success("Prescription deleted successfully! 🎉");
      dispatch(fetchPrescriptions());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  // Auto-fill form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        appointment_id: editData.appointment_id || "",
        symptoms: editData.symptoms || "",
        blood_pressure: editData.blood_pressure || "",
        pulse: editData.pulse || "",
        oxygen: editData.oxygen || "",
        weight: editData.weight || "",
        height: editData.height || "",
        medicine_id: editData.medicines?.[0]?.medicine_id || "",
        dosage: editData.medicines?.[0]?.dosage || "",
        frequency: editData.medicines?.[0]?.frequency || "",
        duration: editData.medicines?.[0]?.duration || "",
        total_quantity: editData.medicines?.[0]?.total_quantity || "",
        labtest_id: editData.lab_tests?.[0]?.lab_test_id || "",
      });
    }
  }, [editData]);

  return (
    <div className=" min-h-screen relative">
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
                Prescription Management
              </h1>
              <p className="text-white hidden md:block">Manage patient prescriptions and treatments</p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-white text-blue-600 px-4 py-2 rounded-md"
          >
            + New Prescription
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-1 rounded w-full text-black outline-none"
            />
          </div>
        </div>
      </div>
       {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center mt-8 justify-center  bg-opacity-30 z-50">
          <div className="flex items-center gap-2">
            <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-8 h-8"></span>
            <span className="text-xl text-blue-600 font-semibold">Loading...</span>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <div className="bg-white rounded-t-none shadow p-4">
            <div className="text-lg font-semibold border-b pb-2 mb-0">
              Total Prescriptions: {filteredPrescriptions.length}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="overflow-auto hidden md:flex flex-col">
            <div className="grid grid-cols-7 gap-4 px-6 py-3 font-semibold text-gray-700 bg-gray-50 sticky top-0 z-10 border-b">
              <div>S.No</div>
              <div>Appointment</div>
              <div>Symptoms</div>
              <div>Vitals</div>
              <div>Medicines</div>
              <div>Lab Tests</div>
              <div className="text-center mr-7 ">Actions</div>
            </div>

            <div className="flex  flex-col">
              {currentData.length > 0 ? currentData.map((p, index) => (
                <div key={p.id} className={`grid grid-cols-7 gap-4 px-6 py-4 border bg-white shadow-sm
                  hover:bg-gray-100 hover:shadow-md transition-all duration-200 ease-in-out
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} relative z-0`}>
                  <div>{startIndex + index + 1}</div>
                  <div>#{p.appointment_id}</div>
                  <div>{p.symptoms}</div>
                  <div>BP: {p.blood_pressure}, Pulse: {p.pulse}, O₂: {p.oxygen}</div>
                  <div>{medicines[p.medicine_id]?.brand_name || "N/A"}</div>
                  <div>{LabsTests[p.labtest_id]?.name || "N/A"}</div>
                  <div className="flex justify-center  mr-5 gap-1">
                    <button
                      onClick={() => setEditData(p)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-1 py-1 rounded"
                    >
                      <Edit size={14} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )) : (
                <div className="flex justify-center items-center p-4 text-gray-500">
                  No prescriptions found
                </div>
              )}
            </div>

            {/* Pagination */}
           <div className="bg-white p-4 rounded-b-lg shadow flex justify-center">
             <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
           </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {currentData.length > 0 ? currentData.map((p, index) => (
              <div key={p.id} className="border rounded-lg shadow p-4 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Appointment #{p.appointment_id}</p>
                    <p className="text-gray-600 text-sm">{p.symptoms}</p>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    className={`transform transition-transform duration-300 ${
                      expandedId === p.id ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <ChevronUp size={20} />
                  </button>
                </div>

                {expandedId === p.id && (
                  <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                    <p>
                      <span className="font-semibold">Vitals: </span>
                      BP {p.blood_pressure}, Pulse {p.pulse}, O₂ {p.oxygen}
                    </p>
                    <p>
                      <span className="font-semibold">Medicines: </span>
                      {medicines[p.medicine_id]?.brand_name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Lab Tests: </span>
                      {LabsTests[p.labtest_id]?.name || "N/A"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setEditData(p)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        <Edit size={16} /> Update
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <p className="text-gray-500 text-center p-4">No prescriptions found.</p>
            )}

            {/* Pagination */}
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
              {editData ? "Edit Prescription" : "Add Prescription"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Form inputs */}
              {/* ...keep your existing inputs here unchanged */}
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this prescription?</p>
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
}
