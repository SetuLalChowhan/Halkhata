import React from "react";
import { Activity, CheckCircle, DollarSign } from "lucide-react";

export default function StatsGrid({ stats }) {
  const statItems = [
    {
      label: "Active Projects",
      value: stats?.totalProjects || 0,
      icon: Activity,
    },
    {
      label: "In Progress",
      value: stats?.totalInProgress || 0,
      icon: Activity,
      color: "text-blue-500",
    },
    {
      label: "Delivered",
      value: stats?.totalDelivered || 0,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Total Value",
      value: `$${stats?.totalValue || 0}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center transition-all hover:shadow-md hover:border-indigo-100 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
              <stat.icon
                className={`w-5 h-5 ${stat.color ? stat.color : "text-indigo-600"}`}
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-gray-900 leading-none tracking-tight">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
