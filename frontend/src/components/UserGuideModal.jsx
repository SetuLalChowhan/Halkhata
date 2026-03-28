import React from "react";
import {
  X,
  BookOpen,
  Layers,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function UserGuideModal({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  const sections = [
    {
      title: "1. Dashboard & Key Metrics",
      icon: <TrendingUp className="w-5 h-5 text-indigo-500" />,
      content:
        'The primary dashboard provides a quick snapshot of your business. Track active projects, successful deliveries for the current month, and overall financial value. Pay special attention to the "Bazuka" metric, which highlights projects running critically behind schedule.',
    },
    {
      title: "2. Project Management",
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      content:
        'Click "New Project" to add an entry. You must assign a "First Delivery Date" (the original deadline) and an "Updated Delivery Date". If no extensions occurred, these dates must perfectly match. Break off project values by assigning prices to individual phases (e.g., UI/UX, Backend) rather than just the whole project.',
    },
    {
      title: "3. Statuses & Urgency (Bazuka)",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      content:
        'A "Bazuka" badge appears automatically if a deadline slips into the next month. Rows will turn visibly red if a delivery is under 4 days away. Status badges explicitly label projects as In Progress, Delivered, Revision, or Cancelled to keep everyone aligned.',
    },
    {
      title: "4. Team & Platform Profiles",
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      content:
        'Manage your talent pool through the "Team Members" and "Fiverr Profiles" tabs. Keeping this list updated ensures you can seamlessly tag the right assignee and correctly track which platform profile generated the order.',
    },
    {
      title: "5. Search & Filters",
      icon: <Clock className="w-5 h-5 text-indigo-500" />,
      content:
        'Use the top filtering bar to quickly search by Client Name or Project. You can instantly filter projects assigned to a specific team member, or toggle advanced views to only see "Bazuka" alerts or projects due in the current month.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100 scale-in-center">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-indigo-600 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Halkhata User Guide
              </h3>
              <p className="text-indigo-100 text-sm font-medium">
                Professional workflow handbook & documentation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-indigo-100 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-gray-50/30">
          <div className="prose prose-indigo max-w-none">
            <div className="mb-8">
              <h4 className="text-gray-900 font-bold text-lg mb-2">
                Welcome to Halkhata Framework
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                This management portal is designed specifically to bring total
                clarity to your agency business pipeline. Whether you are
                tracking single-phase UI setups or complex FullStack deployments
                with multiple assignees, everything is rigorously tracked
                against dates and pricing values so everyone remains perfectly
                synced.
              </p>
            </div>

            <div className="space-y-6">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="bg-white border text-left border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50">
                      {sec.icon}
                    </div>
                    <h5 className="font-bold text-gray-900 text-base">
                      {sec.title}
                    </h5>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium pl-14">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
              <h5 className="font-bold text-indigo-900 text-sm mb-2">
                Pro Tip: Monthly Planning
              </h5>
              <p className="text-indigo-700/80 text-sm leading-relaxed font-medium">
                As an Admin, utilize the "Plan" column checkboxes to nominate
                projects for current month execution. Combine this with the
                "Monthly Plan" sidebar tab to isolate exactly what must be
                achieved this sprint without distraction.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            I Understand, Let's Work!
          </button>
        </div>
      </div>
    </div>
  );
}
