import React from "react";
import {
  LogOut,
  LayoutDashboard,
  CheckCircle,
  UserCircle,
  Users,
  BookOpen,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";

export default function Sidebar({ activeTab, setActiveTab, setIsGuideOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { id: "projects", label: "Projects", icon: LayoutDashboard },
    { id: "plan", label: "Monthly Plan", icon: CheckCircle },
    { id: "profiles", label: "Profiles", icon: UserCircle },
    { id: "members", label: "Team Members", icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="px-8 py-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Halkhata.
          </h1>
        </div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 space-y-3">
        <button
          onClick={() => setIsGuideOpen(true)}
          className="flex items-center justify-center px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-indigo-100 transition-colors w-full shadow-sm"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          User Guide (English)
        </button>
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-xl">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 truncate max-w-[100px]">
              {user?.username}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
