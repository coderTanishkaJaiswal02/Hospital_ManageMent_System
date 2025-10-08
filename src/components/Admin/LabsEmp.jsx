
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  fetchUserById,
  fetchLabById,
  insertEmployee,
  updateEmployee,
  deleteEmployee,
  fetchQualificationById
} from "../../redux/Slices/LabsSlice";
import {
  Search,
  Shield,
  Trash2,
  Edit,
  PlusCircle,
  ChevronDown,
  Users,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleCell from "../common/ToggleCell";
import Pagination from "../common/Pagination";

export default function LabsEmp() {
  const dispatch = useDispatch();
  const { employees, users, labs, qualifications, loading } = useSelector(
    (state) => state.Labs
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    age: "",
    qualification_id: "",
    experience: "",
    joining_date: "",
    address: "",
    lab_id: "",
    user_id: "",
  });

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchUserById());
    dispatch(fetchLabById());
    dispatch( fetchQualificationById());
  }, [dispatch]);

 


  console.log("UI",employees[0]);

const filteredEmployees = employees.filter((emp) => {
  const userName = emp.user?.name?.toLowerCase() || "";
  const addressName = emp.address?.toLowerCase() || "";
  const experienceName = emp.experience?.toLowerCase() || "";
  const labName = emp.lab?.name?.toLowerCase() || "";

  // your searchText should also be lowercase
  return (
    userName.includes(search.toLowerCase()) ||
    addressName.includes(search.toLowerCase()) ||
    experienceName.includes(search.toLowerCase()) ||
    labName.includes(search.toLowerCase())
  );
});


 const [searching, setSearching] = useState("");
    const [page, setPage] = useState(1);
    const limit =5;
    const totalPages = Math.ceil(filteredEmployees.length / limit);
    const startIndex = (page - 1) * limit;
    const currentData =filteredEmployees.slice(startIndex, startIndex + limit);
  
    useEffect(() => {
      setPage(1);
    }, [searching]);

  
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      toast.success("Employee deleted successfully! 🎉");
      dispatch(fetchEmployees());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      user_id: Number(formData.user_id),
      lab_id: Number(formData.lab_id),
      qualification_id: Number(formData.qualification_id),
      clinic_id: 1,
    };

    try {
      if (!editData) {
        payload.employee_id = `EMP-${String(employees.length + 1).padStart(
          3,
          "0"
        )}`;
        await dispatch(insertEmployee(payload)).unwrap();
        toast.success("Employee added successfully! 🎉");
      } else {
        payload.employee_id = editData.employee_id;
        await dispatch(updateEmployee({ id: editData.id, payload })).unwrap();
        toast.success("Employee updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchEmployees());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  const resetForm = () => {
    setFormData({
      age: "",
      qualification_id: "",
      experience: "",
      joining_date: "",
      address: "",
      lab_id: "",
      user_id: "",
    });
    setEditData(null);
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        age: editData.age || "",
        qualification_id: editData.qualification_id || "",
        experience: editData.experience || "",
        joining_date: editData.joining_date || "",
        address: editData.address || "",
        lab_id: editData.lab_id || "",
        user_id: editData.user_id || "",
      });
    }
  }, [editData]);

  // Auto-fill address from lab selection
  useEffect(() => {
    if (formData.lab_id && labs[formData.lab_id]) {
      setFormData((prev) => ({
        ...prev,
        address: labs[formData.lab_id].address || prev.address,
      }));
    }
  }, [formData.lab_id, labs]);

  return (
    <div className="p-4 md:px-2 bg-gray-100 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />


      {/* Header */}
     
 <div className="  bg-gradient-to-r from-blue-500 to-blue-600 gap-2 rounded-b-none rounded-lg  md:px-4 md:py-8 py-4 border-collapse">
        <div className="flex px-4 flex-row justify-between sm:items-center ">
          <div className="flex justify-items-center gap-3">
            <div className="bg-blue-400  flex items-center justify-center rounded-xl border border-blue-300 p-2">
              <Users size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl  sm:text-2xl text-white font-bold">
               Lab Employee Management
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
            + New Employee
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
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
    {/* Employee List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Employees: {employees.length}
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="grid grid-cols-9 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Name</div>
          <div>Age</div>
          <div>Qualification</div>
          <div>Experience</div>
          <div>Joining Date</div>
          <div>Address</div>
          <div>Lab</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-6 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((emp, index) => (
              <div
                key={emp.id}
                className="grid grid-cols-9 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
               
                <div><ToggleCell text={index + 1} limit={10} /></div>
                <div><ToggleCell text={users[emp.user_id]?.name} limit={10} /></div>
                <div><ToggleCell text={emp.age}  limit={10}/></div>
                <div><ToggleCell text={qualifications[emp.qualification_id]?.degree} limit={10}/></div>
                <div><ToggleCell text={emp.experience} limit={10} /></div>
                <div><ToggleCell text={emp.joining_date} limit={10} /></div>
                <div><ToggleCell text={emp.address} limit={10} /></div>
                <div><ToggleCell text={labs[emp.lab_id]?.name} limit={10} /></div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditData(emp);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit size={18} /> Update
                  </button>
                  <button
                    onClick={() => setDeleteId(emp.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-black">No employees found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((emp, index) => (
            <div key={emp.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{users[emp.user_id]?.name}</p>
                  <p className="text-gray-600 text-sm">{labs[emp.lab_id]?.name}</p>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === emp.id ? null : emp.id)
                  }
                  className={`transform transition-transform duration-300 ${
                    expandedId === emp.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === emp.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Age: </span>
                    {emp.age}
                  </p>
                  <p>
                    <span className="font-semibold">Qualification: </span>
                    {qualifications[emp.qualification_id]?.degree}
                  </p>
                  <p>
                    <span className="font-semibold">Experience: </span>
                    {emp.experience}
                  </p>
                  <p>
                    <span className="font-semibold">Joining: </span>
                    {emp.joining_date}
                  </p>
                  <p>
                    <span className="font-semibold">Address: </span>
                    {emp.address}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(emp);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(emp.id)}
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
          <p className="flex items-center text-xl text-black">No employees found.</p>
        )}
      </div>
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
              {editData ? "Edit Employee" : "Add Employee"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
 <label className="block font-semibold mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder=" Enter Age"
                className="w-full border p-2 rounded"
                required
              />
</div>
              {/* Qualification dropdown */}
              <div>
                 <label className="block font-semibold mb-1">Qualification</label>
              <select
                value={formData.qualification_id}
                onChange={(e) =>
                  setFormData({ ...formData, qualification_id: e.target.value })
                }
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Qualification</option>
                          {qualifications &&
              Object.values(qualifications).map((qualification) => (
                <option key={qualification.id} value={qualification.id}>
                  {qualification.degree}
                </option>
              ))}
              </select>
</div>
<div>
   <label className="block font-semibold mb-1">Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                placeholder=" Enter Experience"
                className="w-full border p-2 rounded"
                required
              /></div>
              <div>
                 <label className="block font-semibold mb-1">Joining Date</label>
              <input
                type="date"
                value={formData.joining_date}
                onChange={(e) =>
                  setFormData({ ...formData, joining_date: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              /></div>
              <div>
                 <label className="block font-semibold mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Address"
                className="w-full border p-2 rounded"
                required
              /></div>

              <div>
                 <label className="block font-semibold mb-1">Lab Name</label>
                <select
                  value={formData.lab_id}
                  onChange={(e) =>
                    setFormData({ ...formData, lab_id: e.target.value })
                  }
                  className="border p-2 rounded flex-1"
                  required
                >
                  <option value="">Select Lab</option>
                  {Object.values(labs).map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name}
                    </option>
                  ))}
                </select>
                </div>
                <div>
                   <label className="block font-semibold mb-1">User</label>
                <select
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  className="border p-2 rounded flex-1"
                  required
                >
                  <option value="">Select User</option>
                  {Object.values(users).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.full_name}
                    </option>
                  ))}
                </select>
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
            <p className="mb-4">
              Are you sure you want to delete this employee?
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
