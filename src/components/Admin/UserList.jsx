import { useEffect, useState } from "react";
import { Search, Edit, Trash2, Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  toggleUserStatus,
} from "../../redux/Slices/userSlice";
import UpdateUser from "./UpdateUser";

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, error } = useSelector((state) => state.user);
  console.log(users);

  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // showing data on list

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // update user

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setShowUpdateUser(true);
  };

  const handleBackToList = () => {
    setShowUpdateUser(false);
    setSelectedUser(null);
  };

  // delete user

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  // for searchbar

  const filteredUsers =
    users?.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Show UpdateUser component if showUpdateUser is true
  {
    if (showUpdateUser && selectedUser) {
      return <UpdateUser user={selectedUser} onBack={handleBackToList} />;
    }
  }
  // conditional component rendering

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  // toggle button active inactive

  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === "1" ? "0" : "1";
    dispatch(toggleUserStatus({ id, status: newStatus })).then(() => {
      dispatch(fetchUsers()); // force refresh after status update
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-medium">Error loading users</p>
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
              <p className="text-sm text-gray-500">
                Manage and view all registered users
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => {
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {user.role.name || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={user.status === "1"}
                            onChange={() =>
                              handleStatusToggle(user.id, user.status)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300 relative">
                            <div
                              className={`absolute top-[2px] left-[2px]  h-5 w-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                user.status === "1"
                              } ? translate-x-full : `}
                            ></div>
                          </div>
                        </label>
                        <span
                          className={`ml-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            user.status === "1"
                              ? "text-green-800 bg-green-100"
                              : "text-gray-500 bg-gray-100"
                          }`}
                        >
                          {user.status === "1" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleUpdateUser(user)}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          title="Update user"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      No users found
                    </p>
                    <p className="text-gray-400 text-sm">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "Get started by adding your first user"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filteredUsers.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{users?.length || 0}</span> users
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
