import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLabsTests,
  insertLabsTests,
  updateLabsTests,
  deleteLabsTests,
} from "../../redux/Slices/LabTestSlice";
import {
  Search,
  Shield,
  Trash2,
  Edit,
  PlusCircle,
  MoreVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleCell from "../common/ToggleCell";
import Pagination from "../common/Pagination";

export default function LabsTests() {
  const dispatch = useDispatch();
  const { labsTestsData = [],  loading } = useSelector(
    (state) => state.labsTests || {}
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    test_code: "",
    description: "",
    category_id: "",
    sample_type_id: "",
    unit_id: "",
    price: "",
    clinic_id: "",
    sub_category_id: "",
    normal_range_male: "",
    normal_range_female: "",
    method: "",
  });

  // 🔄 Fetch initial data
  useEffect(() => {
    dispatch(fetchLabsTests());
  }, [dispatch]);

  // Extract unique nested arrays for dropdowns
  const categories = [...new Map(labsTestsData.map(item => [item.category?.id, item.category])).values()].filter(Boolean);
  const sampleTypes = [...new Map(labsTestsData.map(item => [item.sample_type?.id, item.sample_type])).values()].filter(Boolean);
  const units = [...new Map(labsTestsData.map(item => [item.unit?.id, item.unit])).values()].filter(Boolean);
  const clinics = [...new Map(labsTestsData.map(item => [item.clinic?.id, item.clinic])).values()].filter(Boolean);

  // 🔍 Filter search
  const filteredLabsTests = labsTestsData.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
      const [searching, setSearching] = useState("");
      const [page, setPage] = useState(1);
      const limit = 10; // items per page
      const totalPages = Math.ceil(filteredLabsTests.length / limit);
      const startIndex = (page - 1) * limit;
      const currentData = filteredLabsTests.slice(startIndex, startIndex + limit);
  
      // Reset to page 1 when search term changes
      useEffect(() => {
        setPage(1);
      }, [searching]);
    


  // 🗑 Delete
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteLabsTests(id)).unwrap();
      toast.success("Lab Test deleted successfully! 🎉");
      dispatch(fetchLabsTests());
    } catch {
      toast.error("Delete failed! 🚫");
    }
    setDeleteId(null);
  };

  // 💾 Submit Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      category_id: Number(formData.category_id),
      sample_type_id: Number(formData.sample_type_id),
      unit_id: Number(formData.unit_id),
      clinic_id: Number(formData.clinic_id),
      sub_category_id: formData.sub_category_id ? Number(formData.sub_category_id) : null,
    };

    try {
      if (!editData) {
        await dispatch(insertLabsTests(payload)).unwrap();
        toast.success("Lab Test added successfully! 🎉");
      } else {
        await dispatch(updateLabsTests({ id: editData.id, payload })).unwrap();
        toast.success("Lab Test updated successfully! 🎉");
      }
      resetForm();
      dispatch(fetchLabsTests());
      setShowForm(false);
    } catch {
      toast.error(editData ? "Update failed! 🚫" : "Add failed! 🚫");
    }
  };

  // ♻️ Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      test_code: "",
      description: "",
      category_id: "",
      sample_type_id: "",
      unit_id: "",
      price: "",
      clinic_id: "",
      sub_category_id: "",
      normal_range_male: "",
      normal_range_female: "",
      method: "",
    });
    setEditData(null);
  };

  // 📝 Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        test_code: editData.test_code || "",
        description: editData.description || "",
        category_id: editData.category?.id || "",
        sample_type_id: editData.sample_type?.id || "",
        unit_id: editData.unit?.id || "",
        price: editData.price || "",
        clinic_id: editData.clinic?.id || "",
        sub_category_id: editData.sub_category_id || "",
        normal_range_male: editData.normal_range_male || "",
        normal_range_female: editData.normal_range_female || "",
        method: editData.method || "",
      });
    }
  }, [editData]);

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
               Lab Test Management
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
            + New Lab Test
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
           <input
              type="text"
              placeholder="Search..."
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
    {/* Lab Tests List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4">
        Total Lab Tests: {filteredLabsTests.length}
      </div>

      {/* Desktop version */}
      <div className="hidden md:block">
        <div className="grid grid-cols-10 gap-4 px-6 py-3 border-b font-semibold text-gray-700 bg-white rounded-t-md">
          <div>S.No</div>
          <div>Name</div>
          <div>Description</div>
          <div>Test Code</div>
          <div>Category</div>
          <div>Price</div>
          <div>Sample Type</div>
          <div>Unit</div>
          <div className="text-center">Actions</div>
        </div>

        <div className="flex flex-col py-6 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((lab, index) => (
              <div
                key={lab.id}
                className="grid grid-cols-10 gap-2 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
              >
                <div>{index + 1}</div>
                <div><ToggleCell text={lab.name}  /></div>
                <div><ToggleCell text={lab.description}  /></div>
                <div><ToggleCell text={lab.test_code}  /></div>
                <div><ToggleCell text={lab.category?.name} /></div>
                <div><ToggleCell text={lab.price} /></div>
                <div><ToggleCell text={lab.sample_type?.name} /></div>
                <div><ToggleCell text={lab.unit?.name} /> </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditData(lab);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    <Edit size={16} /> Update
                  </button>
                  <button
                    onClick={() => setDeleteId(lab.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-black">No lab tests found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((lab, index) => (
            <div key={lab.id} className="border rounded-lg shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{lab.name}</p>
                  <p className="text-gray-600 text-sm">{lab.description}</p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === lab.id ? null : lab.id)}
                  className={`transform transition-transform duration-300 ${
                    expandedId === lab.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === lab.id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-2">
                  <p><span className="font-semibold">ID:</span> {lab.id}</p>
                  <p><span className="font-semibold">Test Code:</span> {lab.test_code}</p>
                  <p><span className="font-semibold">Category:</span> {lab.category?.name}</p>
                  <p><span className="font-semibold">Price:</span> {lab.price}</p>
                  <p><span className="font-semibold">Sample Type:</span> {lab.sample_type?.name}</p>
                  <p><span className="font-semibold">Unit:</span> {lab.unit?.name}</p>
                  <p><span className="font-semibold">Clinic:</span> {lab.clinic?.name}</p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditData(lab);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(lab.id)}
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
          <p className="flex items-center text-xl text-black">No lab tests found.</p>
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

   {/* Add/Edit Lab Test Modal */}
{showForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">
        {editData ? "Edit Lab Test" : "Add Lab Test"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
           <label className="block font-semibold mb-1"> Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          className="w-full border p-2 rounded"
          required
        />
        </div>
        <div>
           <label className="block font-semibold mb-1">Text code</label>
        <input
          type="text"
          value={formData.test_code}
          onChange={(e) => setFormData({ ...formData, test_code: e.target.value })}
          placeholder="Test Code"
          className="w-full border p-2 rounded"
          required
        />
        </div>
        <div>
           <label className="block font-semibold mb-1">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
</div>
<div>
   <label className="block font-semibold mb-1">Category</label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
</div>
<div>

   <label className="block font-semibold mb-1">Sample Type</label>
        <select
          value={formData.sample_type_id}
          onChange={(e) => setFormData({ ...formData, sample_type_id: e.target.value })}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Sample Type</option>
          {sampleTypes.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
  </div>
  <div>
   <label className="block font-semibold mb-1">Unit</label>
        <select
          value={formData.unit_id}
          onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Unit</option>
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
</div>
<div>
        <select
          value={formData.clinic_id}
          onChange={(e) => setFormData({ ...formData, clinic_id: e.target.value })}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Clinic</option>
          {clinics.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
</div>
       <div>  <label className="block font-semibold mb-1">Generic Name</label>
        <input
          type="text"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="Price"
          className="w-full border p-2 rounded"
          required
      />
</div>
       <div>  <label className="block font-semibold mb-1">Sub Category</label> 
       <input
          type="text"
          value={formData.sub_category_id}
          onChange={(e) => setFormData({ ...formData, sub_category_id: e.target.value })}
          placeholder="Sub Category ID (optional)"
          className="w-full border p-2 rounded"
        />
</div>
       <div>  <label className="block font-semibold mb-1">Normal Range Male  </label>
        <input
          type="text"
          value={formData.normal_range_male}
          onChange={(e) => setFormData({ ...formData, normal_range_male: e.target.value })}
          placeholder="Normal Range Male"
          className="w-full border p-2 rounded"
        />
</div>
       <div>  <label className="block font-semibold mb-1">Normal Range Female </label> <input
          type="text"
          value={formData.normal_range_female}
          onChange={(e) => setFormData({ ...formData, normal_range_female: e.target.value })}
          placeholder="Normal Range Female"
          className="w-full border p-2 rounded"
        />
</div>
       <div>  <label className="block font-semibold mb-1">Method</label> <input
          type="text"
          value={formData.method}
          onChange={(e) => setFormData({ ...formData, method: e.target.value })}
          placeholder="Method"
          className="w-full border p-2 rounded"
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

      

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/3 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this lab test?</p>
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
