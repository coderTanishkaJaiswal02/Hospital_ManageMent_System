import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMedicinePurchases,
  insertMedicinePurchases,
  updateMedicinePurchases,
  deleteMedicinePurchases,
  fetchFrom,
  fetchBrands,
  fetchSupplier,
  fetchMedicine,
} from "../../redux/Slices/MedicinePurchasesSlice";
import {
  Search,
  Trash2,
  Edit,
  PlusCircle,
  MoreVertical,
  Shield,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToggleCell from "../common/ToggleCell";
import Pagination from "../common/Pagination";

export default function MedicinePurchases() {
  const dispatch = useDispatch();
  const { medicinePurchases, forms, brands, supplier, medicines, loading } =
    useSelector((state) => state.medicinePurchases);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    hsn_code: "",
    units_per_strip: "",
    strips_per_box: "",
    total_boxes: "",
    sale_price: "",
    purchase_price: "",
    gst_percent: "",
    discount_percent: "",
    batch_number: "",
    expiry_date: "",
    manufacturer: "",
    reorder_level: "",
    storage_conditions: "",
    medicine_id: "",
    supplier_id: "",
    brand_id: "",
    form_id: "",
  });

  useEffect(() => {
    dispatch(fetchMedicinePurchases());
    dispatch(fetchFrom());
    dispatch(fetchBrands());
    dispatch(fetchSupplier());
    dispatch(fetchMedicine());
  }, [dispatch]);

  const filteredPurchases = medicinePurchases.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
    const [searching, setSearching] = useState("");
    const [page, setPage] = useState(1);
    const limit =5;
    const totalPages = Math.ceil(filteredPurchases.length / limit);
    const startIndex = (page - 1) * limit;
    const currentData =filteredPurchases.slice(startIndex, startIndex + limit);
  
    useEffect(() => {
      setPage(1);
    }, [searching]);

    
  const resetForm = () => {
    setFormData({
      name: "",
      generic_name: "",
      hsn_code: "",
      units_per_strip: "",
      strips_per_box: "",
      total_boxes: "",
      sale_price: "",
      purchase_price: "",
      gst_percent: "",
      discount_percent: "",
      batch_number: "",
      expiry_date: "",
      manufacturer: "",
      reorder_level: "",
      storage_conditions: "",
      medicine_id: "",
      supplier_id: "",
      brand_id: "",
      form_id: "",
    });
    setEditData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await dispatch(
          updateMedicinePurchases({ id: editData.id, payload: formData })
        ).unwrap();
        toast.success("Medicine purchase updated successfully! 🎉");
      } else {
        await dispatch(insertMedicinePurchases(formData)).unwrap();
        toast.success("Medicine purchase added successfully! 🎉");
      }
      resetForm();
      setShowForm(false);
      dispatch(fetchMedicinePurchases());
    } catch {
      toast.error(editData ? "Update failed 🚫" : "Add failed 🚫");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteMedicinePurchases(id)).unwrap();
      toast.success("Deleted successfully 🎉");
      dispatch(fetchMedicinePurchases());
    } catch {
      toast.error("Delete failed 🚫");
    }
    setDeleteId(null);
  };

  // Auto-fill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        brand_id: editData.brand?.id || "",
        form_id: editData.form?.id || "",
        supplier_id: editData.supplier?.id || "",
        medicine_id: editData.medicine?.id || "",
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
            <div className="bg-blue-400  flex items-center justify-center rounded-xl border border-blue-300  p-2 md:px-4 md:py-2">
              <Shield size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl  sm:text-2xl text-white font-bold">
              Medicine Purchases Management 
              </h1>
               <p className="text-white hidden md:block">Manage system Medicine purchases</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-md"
          >
            + New Purchases
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 px-2">
          <div className="bg-white rounded-md flex items-center gap-2 px-2 py-2 w-full md:w-[500px]">
            <Search size={24} color="gray" />
            <input
              type="text"
              placeholder="Search suppliers..."
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
    <span className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-5 h-5 "></span>
    <span className="ml-2 md:text-2xl text-blue-600">Loading...</span>
  </div>
) : (
  <>
    {/* Purchases List */}
    <div className="bg-white rounded shadow p-4">
      <div className="text-lg font-semibold border-b pb-2 mb-4 text-black">
        Total Purchases: {filteredPurchases.length}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-11 gap-4 px-6 py-3 border-b font-semibold text-black bg-white rounded-t-md sticky top-0 z-10">
          <div>S.No</div>
          <div>Name</div>
          <div>Generic</div>
          <div>Brand</div>
          <div>Form</div>
          <div>Medicine</div>
          <div>Supplier</div>
          <div>Sale Price</div>
          <div>Purchase Price</div>
          <div className="text-center ml-16">Actions</div>
        </div>

        <div className="flex flex-col py-6 gap-2 mt-2">
          {currentData.length > 0 ? (
            currentData.map((purchase, index) => (
              <div
                key={purchase.id}
                className="grid grid-cols-11 gap-6 px-6 py-4 border-b rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition text-black"
              >
                <div >{index + 1}</div>
                <div><ToggleCell text={purchase.name} limit={15} className="text-black" /></div>
                <div><ToggleCell text={purchase.generic_name} limit={15} className="text-black" /></div>
                <div><ToggleCell text={brands[purchase.brand_id]?.name} limit={10} className="text-black" /></div>
                <div><ToggleCell text={forms[purchase.form_id]?.name} limit={10} className="text-black" /></div>
                <div><ToggleCell text={medicines[purchase.medicine_id]?.brand_name} limit={15} className="text-black" /></div>
                <div><ToggleCell text={supplier[purchase.supplier_id]?.name} limit={15} className="text-black" /></div>
                <div>{purchase.sale_price}</div>
                <div>{purchase.purchase_price}</div>
                <div >
                  <button
                    onClick={() => { setEditData(purchase); setShowForm(true); }}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    <Edit size={16} /> Update
                  </button>
                  </div>
                  <div>
                  <button
                    onClick={() => setDeleteId(purchase.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center text-black">
              <p>No purchases found</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {currentData.length > 0 ? (
          currentData.map((purchase) => (
            <div key={purchase.id} className="border rounded-lg shadow p-4 bg-white text-black">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{purchase.name}</p>
                  <p className="text-black text-sm">{brands[purchase.brand_id]?.name}</p>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === purchase.id ? null : purchase.id)}
                  className={`transform transition-transform duration-300 ${
                    expandedId === purchase.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {expandedId === purchase.id && (
                <div className="mt-3 border-t pt-3 text-sm text-black space-y-2">
                  <p><span className="font-semibold">Generic: </span>{purchase.generic_name}</p>
                  <p><span className="font-semibold">Form: </span>{forms[purchase.form_id]?.name}</p>
                  <p><span className="font-semibold">Medicine: </span>{medicines[purchase.medicine_id]?.brand_name}</p>
                  <p><span className="font-semibold">Supplier: </span>{supplier[purchase.supplier_id]?.name}</p>
                  <p><span className="font-semibold">Sale Price: </span>{purchase.sale_price}</p>
                  <p><span className="font-semibold">Purchase Price: </span>{purchase.purchase_price}</p>
                  <p><span className="font-semibold">Expiry: </span>{purchase.expiry_date}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setEditData(purchase); setShowForm(true); }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <Edit size={16} /> Update
                    </button>
                    <button
                      onClick={() => setDeleteId(purchase.id)}
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
          <p className="flex items-center text-xl text-black">No purchases found</p>
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
    {/* Add/Edit Modal */}
{showForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">
        {editData ? "Edit Purchase" : "Add Purchase"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        {/* Medicine Name */}
        <div>
          <label className="block font-semibold mb-1">Medicine Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Generic Name */}
        <div>
          <label className="block font-semibold mb-1">Generic Name</label>
          <input
            type="text"
            value={formData.generic_name}
            onChange={(e) => setFormData({ ...formData, generic_name: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Brand & Form */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Brand</label>
            <select
              value={formData.brand_id}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Brand</option>
              {Object.values(brands).map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Form</label>
            <select
              value={formData.form_id}
              onChange={(e) => setFormData({ ...formData, form_id: e.target.value })}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Form</option>
              {Object.values(forms).map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Supplier & Medicine */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Supplier</label>
            <select
              value={formData.supplier_id}
              onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Supplier</option>
              {Object.values(supplier).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Medicine</label>
            <select
              value={formData.medicine_id}
              onChange={(e) => setFormData({ ...formData, medicine_id: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Medicine</option>
              {Object.values(medicines).map((m) => (
                <option key={m.id} value={m.id}>{m.brand_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Prices */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Sale Price</label>
            <input
              type="number"
              value={formData.sale_price}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Purchase Price</label>
            <input
              type="number"
              value={formData.purchase_price}
              onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold mb-1">Total Boxes</label>
            <input
              type="text"
              value={formData.total_boxes}
              onChange={(e) => setFormData({ ...formData, total_boxes: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Units per Strip</label>
            <input
              type="text"
              value={formData.units_per_strip}
              onChange={(e) => setFormData({ ...formData, units_per_strip: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Strips per Box</label>
            <input
              type="text"
              value={formData.strips_per_box}
              onChange={(e) => setFormData({ ...formData, strips_per_box: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">GST (%)</label>
            <input
              type="text"
              value={formData.gst_percent}
              onChange={(e) => setFormData({ ...formData, gst_percent: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Discount (%)</label>
            <input
              type="text"
              value={formData.discount_percent}
              onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Batch Number</label>
            <input
              type="text"
              value={formData.batch_number}
              onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Expiry Date</label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Manufacturer Date</label>
            <input
              type="date"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Reorder Level</label>
            <input
              type="text"
              value={formData.reorder_level}
              onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Storage Conditions</label>
            <input
              type="text"
              value={formData.storage_conditions}
              onChange={(e) => setFormData({ ...formData, storage_conditions: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
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
            <p className="mb-4">
              Are you sure you want to delete this purchase?
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