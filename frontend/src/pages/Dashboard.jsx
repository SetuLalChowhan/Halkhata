import React, { useState } from "react";
import { Plus } from "lucide-react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// Components
import ProjectModal from "../components/ProjectModal";
import UserGuideModal from "../components/UserGuideModal";
import Sidebar from "../components/dashboard/Sidebar";
import StatsGrid from "../components/dashboard/StatsGrid";
import FiltersBar from "../components/dashboard/FiltersBar";
import ProjectsTable from "../components/dashboard/ProjectsTable";
import CrudBlock from "../components/dashboard/CrudBlock";

// API
import {
  useProjects,
  useDashboardStats,
  useMembers,
  useProfiles,
  useDeleteProject,
  useTogglePlan,
  useSaveCrudItem,
  useDeleteCrudItem,
} from "../api/queries";
import axiosInstance from "../api/axios";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    member: "",
    status: "",
    urgent: false,
    sort: "",
    page: 1,
    limit: 20,
  });

  const { user } = useSelector((state) => state.auth);

  // Queries
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects(
    filters,
    activeTab,
  );
  const { data: stats } = useDashboardStats();
  const { data: members = [] } = useMembers();
  const { data: profiles = [] } = useProfiles();

  // Mutations
  const deleteProjectMutation = useDeleteProject();
  const togglePlanMutation = useTogglePlan();
  const saveCrudItemMutation = useSaveCrudItem(activeTab);
  const deleteCrudItemMutation = useDeleteCrudItem(activeTab);

  const handleExportExcel = async () => {
    try {
      const query = new URLSearchParams({
        page: 1,
        limit: 10000,
      });
      if (filters.search) query.append("search", filters.search);
      if (filters.member) query.append("member", filters.member);
      if (filters.status) query.append("status", filters.status);
      if (filters.sort) query.append("sort", filters.sort);
      if (filters.urgent) query.append("urgent", "true");
      if (activeTab === "plan") query.append("isPlanned", "true");

      toast.loading("Fetching data for export...");
      const { data } = await axiosInstance.get(`/projects?${query.toString()}`);
      toast.dismiss();

      const projectsToExport = data.projects;
      if (!projectsToExport || projectsToExport.length === 0) {
        toast.error("No projects to export.");
        return;
      }

      const xlsxData = projectsToExport.map((p, index) => ({
        "#": index + 1,
        "Project Name": p.projectName,
        "Client Name": p.clientName,
        "Order ID": p.orderId || "---",
        Profile: p.profileName,
        Phase: Array.isArray(p.currentPhase)
          ? p.currentPhase.join(", ")
          : p.currentPhase,
        "Assigned To": p.assignedTo?.name || "---",
        "Team Members": (p.otherMembers || []).map((m) => m.name).join(", "),
        Status: p.status,
        "Delivery Date": p.deliveryDate
          ? format(new Date(p.deliveryDate), "MMM dd, yyyy")
          : "N/A",
        "First Delivery Date": p.firstDeliveryDate
          ? format(new Date(p.firstDeliveryDate), "MMM dd, yyyy")
          : "N/A",
        "Value ($)": p.projectValue,
        "In Plan": p.isPlanned ? "Yes" : "No",
        "Last Note": p.lastUpdateNote || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(xlsxData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
      XLSX.writeFile(
        workbook,
        `Halkhata_Projects_${format(new Date(), "yyyy-MM-dd")}.xlsx`,
      );
      toast.success("Excel file exported!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export.");
    }
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id, {
        onSuccess: () => toast.success("Project deleted"),
        onError: () => toast.error("Error deleting project"),
      });
    }
  };

  const handleTogglePlan = (id, isPlanned) => {
    togglePlanMutation.mutate(
      { id, isPlanned },
      {
        onSuccess: () =>
          toast.success(isPlanned ? "Added to Plan" : "Removed from Plan"),
        onError: () => toast.error("Error updating plan"),
      },
    );
  };

  const handleSaveCrud = (item, callback) => {
    saveCrudItemMutation.mutate(item, {
      onSuccess: () => {
        toast.success(
          `${activeTab === "members" ? "Member" : "Profile"} saved`,
        );
        callback();
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Error saving");
      },
    });
  };

  const handleDeleteCrud = (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      deleteCrudItemMutation.mutate(id, {
        onSuccess: () => toast.success("Deleted successfully"),
        onError: () => toast.error("Error deleting"),
      });
    }
  };

  return (
    <div className="flex bg-gray-50/50 font-sans selection:bg-indigo-100 text-gray-800">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsGuideOpen={setIsGuideOpen}
      />

      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="w-full mx-auto px-6 py-8 pb-20">
          {(activeTab === "projects" || activeTab === "plan") && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Header */}
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                    Dashboard
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    Track and manage your active projectsss
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditProject(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center shadow-lg shadow-indigo-100/50 active:scale-95"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </button>
              </div>

              {/* Stats */}
              <StatsGrid stats={stats} />

              {/* Table Section */}
              <section className="mt-8">
                <FiltersBar
                  filters={filters}
                  setFilters={setFilters}
                  members={members}
                  handleExportExcel={handleExportExcel}
                />
                <ProjectsTable
                  projects={projectsData?.projects || []}
                  filters={filters}
                  handleEdit={(p) => {
                    setEditProject(p);
                    setIsModalOpen(true);
                  }}
                  handleDelete={handleDeleteProject}
                  handleTogglePlan={handleTogglePlan}
                />

                {/* Pagination */}
                {projectsData?.totalPages > 1 && (
                  <div className="mt-6 flex justify-center items-center gap-2">
                    <button
                      disabled={filters.page === 1}
                      onClick={() =>
                        setFilters({ ...filters, page: filters.page - 1 })
                      }
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-500 font-medium">
                      Page {filters.page} of {projectsData.totalPages}
                    </span>
                    <button
                      disabled={filters.page === projectsData.totalPages}
                      onClick={() =>
                        setFilters({ ...filters, page: filters.page + 1 })
                      }
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === "members" && (
            <CrudBlock
              type="members"
              dataList={members}
              onSave={handleSaveCrud}
              onDelete={handleDeleteCrud}
              isLoading={saveCrudItemMutation.isLoading}
            />
          )}

          {activeTab === "profiles" && (
            <CrudBlock
              type="profiles"
              dataList={profiles}
              onSave={handleSaveCrud}
              onDelete={handleDeleteCrud}
              isLoading={saveCrudItemMutation.isLoading}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {isModalOpen && (
        <ProjectModal
          onClose={() => setIsModalOpen(false)}
          editData={editProject}
          members={members}
          profiles={profiles}
        />
      )}
      {isGuideOpen && (
        <UserGuideModal isOpen={isGuideOpen} setIsOpen={setIsGuideOpen} />
      )}
    </div>
  );
}
