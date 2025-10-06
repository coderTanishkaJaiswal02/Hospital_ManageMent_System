import React from "react";
import { useSelector } from "react-redux";

("use client");
import {
  Shield,
  LayoutDashboard,
  UserPlus,
  Users,
  UserCheck,
} from "lucide-react";

const Sidebar = ({ activeItem, handleItemClick, className = "" }) => {
  const user = useSelector((state) => state.auth.user);
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "main",
    },
  ];

  const userManagementItems = [
    {
      id: "create-user",
      label: "Create User",
      icon: UserPlus,
      section: "user",
    },
    {
      id: "user-list",
      label: "User List",
      icon: Users,
      section: "user",
    },
    {
      id: "role-management",
      label: "Role Management",
      icon: UserCheck,
      section: "user",
    },
  ];

  const NavItem = ({ item, isActive, onClick }) => (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gray-200 text-gray-900 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <item.icon size={20} />
      <span className="text-sm">{item.label}</span>
    </button>
  );

  return (
    <div
      className={`bg-white border-r h-screen border-gray-200 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={handleItemClick}
            />
          ))}
        </div>

        {/* User Management Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
            USER MANAGEMENT
          </h3>
          <div className="space-y-2">
            {userManagementItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "GU"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {" "}
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-500 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
