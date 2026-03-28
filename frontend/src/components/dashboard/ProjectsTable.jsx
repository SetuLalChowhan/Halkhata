import React from "react";
import { format } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function ProjectsTable({
  projects,
  filters,
  handleEdit,
  handleDelete,
  handleTogglePlan,
}) {
  const { user } = useSelector((state) => state.auth);

  const getRowClass = (project) => {
    if (project.status === "Delivered") return "";
    if (!project.deliveryDate) return "";
    const diffMs =
      new Date(project.deliveryDate).getTime() - new Date().getTime();
    if (diffMs <= 4 * 24 * 60 * 60 * 1000)
      return "bg-red-50 hover:bg-red-100 border-l-2 border-red-500";
    return "";
  };

  const calculateDaysLeft = (deliveryDate, status) => {
    if (!deliveryDate) return null;
    if (status === "Delivered")
      return (
        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mt-1 block">
          Delivered
        </span>
      );

    const target = new Date(deliveryDate);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();

    if (diffMs < 0)
      return (
        <span className="text-red-600 font-bold text-xs mt-1 block">Missed</span>
      );

    const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const h = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="bg-white border-x border-b border-gray-100 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold w-16">#</th>
              <th className="px-6 py-4 font-semibold">Project</th>
              <th className="px-6 py-4 font-semibold text-gray-400">Order ID</th>
              <th className="px-6 py-4 font-semibold">Phase / Profile</th>
              <th className="px-6 py-4 font-semibold">Assignee</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">
                Delivery Date
              </th>
              <th className="px-6 py-4 font-semibold text-center">Days Left</th>
              <th className="px-6 py-4 font-semibold text-center">Value</th>
              {user?.role === "Admin" && (
                <th className="px-6 py-4 font-semibold text-center">Plan</th>
              )}
              <th className="px-6 py-4 font-semibold text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projects.map((p, index) => (
              <tr
                key={p._id}
                className={`group hover:bg-gray-50/50 transition-colors ${getRowClass(p)}`}
              >
                <td className="px-6 py-5">
                  <span className="text-gray-400 font-semibold">
                    {(filters.page - 1) * filters.limit + index + 1}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>{p.projectName}</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">{p.clientName}</div>
                  {p.lastUpdateNote && (
                    <div
                      className="text-gray-400 text-xs mt-1 italic truncate max-w-[200px]"
                      title={p.lastUpdateNote}
                    >
                      "{p.lastUpdateNote}"
                    </div>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="font-mono text-[11px] font-semibold text-gray-400 bg-gray-50 px-2 py-1 inline-block rounded border border-gray-100 uppercase tracking-widest">
                    {p.orderId || "---"}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-gray-900 font-medium whitespace-normal max-w-[150px]">
                    {Array.isArray(p.currentPhase)
                      ? p.currentPhase.join(", ")
                      : p.currentPhase}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">{p.profileName}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-gray-900 font-semibold">
                    {p.assignedTo?.name || "---"}
                  </div>
                  {p.otherMembers && p.otherMembers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 max-w-[150px]">
                      {p.otherMembers.map((om) => (
                        <span
                          key={om._id}
                          className="bg-gray-100/80 text-gray-500 px-1.5 py-0.5 rounded text-[10px] border border-gray-200 font-medium tracking-wide uppercase"
                        >
                          {om.name}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${
                      p.status === "Delivered"
                        ? "bg-gray-100 text-gray-700"
                        : p.status === "In Progress"
                          ? "bg-blue-50 text-blue-600"
                          : p.status === "Revision"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-red-50 text-red-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="font-bold text-gray-900 text-xs tracking-wide">
                    {p.deliveryDate
                      ? format(new Date(p.deliveryDate), "MMM dd, yyyy")
                      : "N/A"}
                  </div>
                  {p.firstDeliveryDate && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-100/50">
                      <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
                        1st Delivery
                      </div>
                      <div className="font-semibold text-gray-600 text-[10px]">
                        {format(new Date(p.firstDeliveryDate), "MMM dd, yyyy")}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="text-[11px] font-bold text-blue-600">
                    {calculateDaysLeft(p.deliveryDate, p.status)}
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-semibold text-gray-900">
                  ${p.projectValue}
                </td>
                {user?.role === "Admin" && (
                  <td className="px-6 py-5 text-center">
                    <input
                      type="checkbox"
                      checked={p.isPlanned}
                      onChange={(e) => handleTogglePlan(p._id, e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-600 cursor-pointer transition"
                    />
                  </td>
                )}
                <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-gray-400 hover:text-gray-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="11" className="px-6 py-20 text-center text-gray-400 font-medium">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
