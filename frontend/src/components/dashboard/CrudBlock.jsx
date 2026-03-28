import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function CrudBlock({
  type,
  dataList,
  onSave,
  onDelete,
  isLoading,
}) {
  const [newName, setNewName] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const isMembers = type === "members";
  const title = isMembers ? "Team Members" : "Platform Profiles";
  const subtitle = isMembers
    ? "Manage internal team members (e.g. Setu, Sefat)"
    : "Manage Fiverr/Upwork profile names";

  const handleSave = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onSave({ id: editingItem?._id, name: newName }, () => {
      setNewName("");
      setEditingItem(null);
    });
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setNewName(item.name);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewName("");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.05)] mb-8">
        <form onSubmit={handleSave} className="flex gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Enter ${isMembers ? "member" : "profile"} name`}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-600 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
          >
            {editingItem ? "Update" : "Add"}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {dataList?.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-gray-400 hover:text-gray-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!dataList || dataList.length === 0) && (
              <tr>
                <td colSpan="2" className="px-6 py-8 text-center text-gray-400">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
