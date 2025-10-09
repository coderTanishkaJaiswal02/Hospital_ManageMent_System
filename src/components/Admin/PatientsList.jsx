// src/components/PatientsList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPatients,
  fetchPatientById,
  updatePatient,
  deletePatient,
  addPatient,
  clearSelected,
  fetchAllDoctors,
} from "../../redux/Slices/PatientsSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Shield, Trash2, Search, Plus, ChevronDown, ChevronUp, Edit } from "lucide-react";
import Pagination from "../common/Pagination";

const PatientsList = () => {
  const dispatch = useDispatch();
  const { list, doctors, loading } = useSelector((state) => state.patients);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [fetchId, setFetchId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedPatientId, setFetchedPatientId] = useState(null);

  const [formData, setFormData] = useState({
    doctor_id: "",
    name: "",
    father_husband_name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
    city: "",
    disease: "",
    disease_symptoms: "",
    disease_duration: "",
    old_reports: "",
    old_reports_note: "",
    clinic_id: "1",
  });

  const [deletePatientData, setDeletePatientData] = useState(null);

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Fetch patients & doctors ---
  useEffect(() => {
    dispatch(fetchAllPatients()).catch(() =>
      toast.error("Failed to fetch patients")
    );
    dispatch(fetchAllDoctors()).catch(() =>
      toast.error("Failed to fetch doctors")
    );
  }, [dispatch]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({
      doctor_id: "",
      name: "",
      father_husband_name: "",
      email: "",
      phone: "",
      gender: "",
      age: "",
      address: "",
      city: "",
      disease: "",
      disease_symptoms: "",
      disease_duration: "",
      old_reports: "",
      old_reports_note: "",
      clinic_id: "1",
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updatePatient({ id: editId, data: formData }))
        .unwrap()
        .then(() => {
          toast.success("Patient updated successfully");
          resetForm();
          dispatch(fetchAllPatients());
        })
        .catch(() => toast.error("Failed to update patient"));
    } else {
      dispatch(addPatient(formData))
        .unwrap()
        .then(() => {
          toast.success("Patient added successfully");
          resetForm();
          dispatch(fetchAllPatients());
        })
        .catch(() => toast.error("Failed to add patient"));
    }
  };

  const handleFetchById = () => {
    if (!fetchId.trim()) return toast.error("Please enter a patient ID");

    dispatch(fetchPatientById(fetchId))
      .unwrap()
      .then((patient) => {
        toast.success("Patient fetched successfully");
        setExpandedId(patient.id);
        setFetchedPatientId(patient.id);
        setFormData({ ...formData, ...patient });
      })
      .catch(() => toast.error("Failed to fetch patient by ID"));
  };

  const confirmDelete = () => {
    if (!deletePatientData) return;
    dispatch(deletePatient(deletePatientData.id))
      .unwrap()
      .then(() => {
        toast.success("Patient deleted successfully");
        dispatch(fetchAllPatients());
      })
      .catch(() => toast.error("Failed to delete patient"))
      .finally(() => setDeletePatientData(null));
  };

  const filteredList = list
    .filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      a.id === fetchedPatientId ? -1 : b.id === fetchedPatientId ? 1 : 0
    );

 // Pagination logic
       const [searching, setSearching] = useState("");
       const [page, setPage] = useState(1);
       const limit =5;
       const totalPages = Math.ceil(filteredList.length / limit);
       const startIndex = (page - 1) * limit;
       const currentData =filteredList.slice(startIndex, startIndex + limit);
     
       useEffect(() => {
         setPage(1);
       }, [searching]);
 
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col ">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-blue-500 rounded-t px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col w-full md:max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-400 rounded-xl border border-blue-300 p-2">
              <Shield size={28} color="white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Patients Dashboard
            </h2>
          </div>
          <p className="text-white text-sm mb-3">Manage patients and their details</p>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-md border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white text-black"
            />
          </div>
        </div>

        <button
          onClick={() => { setShowForm(true); setEditId(null); }}
          className="bg-white text-blue-500 font-semibold px-4 sm:px-6 py-2 rounded hover:bg-gray-100 w-full sm:w-auto flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" /> Add Patient
        </button>
      </div>

      {/* Add Patient Modal */}
      {showForm && !editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg max-w-2xl w-full p-6 relative max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Patient</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <select
                name="doctor_id"
                value={formData.doctor_id || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              {Object.keys(formData).map((key) => {
                if (key === "doctor_id" || key === "clinic_id") return null;
                return (
                  <input
                    key={key}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    placeholder={key.replace("_", " ")}
                    className="border p-2 rounded w-full"
                  />
                );
              })}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

   {/* Loading Overlay */}
{loading ? (
  <div className="flex items-center justify-center h-[400px]">
    <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5 "></span>
    <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
  </div>
) : (
  <>
    {/* Patients List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Patients: {filteredList.length}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Name</div>
          <div>Age</div>
          <div>Doctor</div>
          <div>Disease</div>
          <div>City</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-6 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((patient, index) => (
              <div
                key={patient.id}
                className="grid grid-cols-7 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>
                <div>{patient.name}</div>
                <div>{patient.age}</div>
                <div>
                  {patient.doctor_name ||
                    doctors.find(
                      (d) => Number(d.id) === Number(patient.doctor_id)
                    )?.name ||
                    "N/A"}
                </div>
                <div>{patient.disease}</div>
                <div>{patient.city}</div>

                <div className="flex justify-center gap-2">
                
                  <button
                    onClick={() => setDeletePatientData(patient)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-20">
              <p className="text-black">No patients found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((patient, index) => (
            <div
              key={patient.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-blue-600">
                    {(currentPage - 1) * itemsPerPage + index + 1}. {patient.name}
                  </p>
                  <p className="text-gray-600 text-sm">{patient.city}</p>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === patient.id ? null : patient.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === patient.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === patient.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p><span className="font-semibold">Age: </span>{patient.age}</p>
                  <p>
                    <span className="font-semibold">Doctor: </span>
                    {patient.doctor_name ||
                      doctors.find(
                        (d) => Number(d.id) === Number(patient.doctor_id)
                      )?.name ||
                      "N/A"}
                  </p>
                  <p><span className="font-semibold">Disease: </span>{patient.disease}</p>
                  <p><span className="font-semibold">Symptoms: </span>{patient.disease_symptoms}</p>
                  <p><span className="font-semibold">Duration: </span>{patient.disease_duration}</p>
                  <p><span className="font-semibold">Email: </span>{patient.email}</p>
                  <p><span className="font-semibold">Phone: </span>{patient.phone}</p>
                  <p><span className="font-semibold">Address: </span>{patient.address}</p>
                  <p><span className="font-semibold">Old Reports: </span>{patient.old_reports_note}</p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setDeletePatientData(patient)}
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
          <p className="flex items-center text-xl text-black">
            No patients found.
          </p>
        )}
      </div>

      {/* Pagination */}
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


      {/* Delete Confirmation */}
      {deletePatientData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{deletePatientData.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletePatientData(null)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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

export default PatientsList;
