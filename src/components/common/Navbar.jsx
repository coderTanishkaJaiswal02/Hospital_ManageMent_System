import { Search, Plus, Bell, Settings } from "lucide-react"
import { useSelector } from "react-redux";

const Navbar = () => {
const user = useSelector((state) => state.auth.user);


const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
  return (
    <div className="bg-[#FFFFFF] border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        {/* Left - Title */}
        <div className="flex-shrink-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900"> {user?.name ? `${capitalize(user.name)} Dashboard` : "Dashboard"}</h1>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-lg mx-4 sm:mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-[#F3F4F6] w-[60%] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Create New Admin Button */}
        

          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
