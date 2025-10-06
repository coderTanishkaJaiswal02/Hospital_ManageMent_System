import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, addItem, updateItem, deleteItem } from "../../redux/Slices/FormSlices";
 import { toast } from "react-toastify";

const Form= () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.Forms);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Add Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const inputRef = useRef(null);

  // Delete Confirmation Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    if (showAddModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddModal]);

  const handleAdd = () => {
    if (!newFormName.trim()) {
      alert("Form name cannot be empty!");
      return;
    }

    dispatch(addItem(newFormName))
      .unwrap()
      .then(() =>{toast.success("Data Added Successfully");
        dispatch(fetchData());
      })
      .catch(() => toast.error("Failed to Add Data"));

    setNewFormName("");
    setShowAddModal(false);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    await dispatch(updateItem({ id: editId, name: editName }))
      .unwrap()
      .then(() => toast.success("Data Updated Successfully"))
      .catch(() => toast.error("Failed to Update Data"));

    await dispatch(fetchData());
    setEditId(null);
    setEditName("");
  };

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteItem(deleteTargetId))
      .unwrap()
      .then(() =>
        toast.success("Item Deleted Successfully", {
          style: { background: "green", color: "white" },
        })
      )
      .catch(() => toast.error("Failed to Delete Item"));

    setShowConfirmModal(false);
    setDeleteTargetId(null);
  };

  const filteredData = data.filter((item) =>
    typeof item.name === "string" &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-blue-500 rounded px-8 py-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-white">Form List</h2>
            <p className="text-white text-sm mt-1">
              Manage System roles and permission
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-blue-500 font-semibold px-6 py-3 rounded hover:bg-gray-100"
          >
            Add Data
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white bg-white"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6">
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {filteredData.length === 0 && !loading && (
          <p className="text-gray-500">No forms found.</p>
        )}

        {filteredData.map((item) => (
          <div key={item.id} className="bg-white rounded shadow p-4 w-full">
            <div className="flex justify-between items-center">
              {editId === item.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <h3 className="text-lg font-semibold">{item.name}</h3>
              )}

              <div className="flex gap-2">
                {editId === item.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(item.id);
                        setEditName(item.name);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Form</h2>
            <input
              ref={inputRef}
              type="text"
              value={newFormName}
              onChange={(e) => setNewFormName(e.target.value)}
              placeholder="Enter Form Name"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this form?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

export default Form;
