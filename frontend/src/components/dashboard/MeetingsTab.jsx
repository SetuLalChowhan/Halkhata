import React, { useState } from "react";
import { 
  Video, 
  Plus, 
  Calendar, 
  Users, 
  ChevronRight, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMeetings, useCreateMeeting, useDeleteMeeting, useMembers } from "../../api/queries";

const MeetingsTab = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    roomName: "",
    scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    members: []
  });

  const { data: meetings = [], isLoading } = useMeetings();
  const { data: teamMembers = [] } = useMembers();
  const createMeetingMutation = useCreateMeeting();
  const deleteMeetingMutation = useDeleteMeeting();

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    if (!newMeeting.title || !newMeeting.roomName) {
      toast.error("Please fill in all fields");
      return;
    }

    // Sanitize room name
    const sanitizedRoom = newMeeting.roomName.replace(/\s+/g, '-').toLowerCase();

    createMeetingMutation.mutate({
      ...newMeeting,
      roomName: sanitizedRoom
    }, {
      onSuccess: () => {
        toast.success("Meeting scheduled successfully");
        setIsModalOpen(false);
        setNewMeeting({ title: "", roomName: "", scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"), members: [] });
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to schedule meeting");
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      deleteMeetingMutation.mutate(id, {
        onSuccess: () => toast.success("Meeting deleted"),
        onError: () => toast.error("Failed to delete meeting")
      });
    }
  };

  const generateRoomName = () => {
    const random = Math.random().toString(36).substring(7);
    const title = newMeeting.title.toLowerCase().replace(/\s+/g, '-') || 'meeting';
    setNewMeeting({ ...newMeeting, roomName: `${title}-${random}` });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
            Team Meetings
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Arrange and manage your virtual conferences
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center shadow-lg shadow-indigo-100/50 active:scale-95"
        >
          <Video className="w-4 h-4 mr-2" />
          Schedule Meeting
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No meetings yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
            Start a new meeting to collaborate with your team in real-time.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Meeting
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <motion.div
              layout
              key={meeting._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    meeting.status === 'ongoing' ? 'bg-green-100 text-green-600' : 
                    meeting.status === 'completed' ? 'bg-gray-100 text-gray-600' : 
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {meeting.status}
                  </div>
                  <button 
                    onClick={() => handleDelete(meeting._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {meeting.title}
                </h4>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {format(new Date(meeting.scheduledAt), "MMM dd, yyyy • hh:mm a")}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    {meeting.members?.length || 0} Participants
                  </div>
                </div>

                {meeting.summary && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase">
                      <MessageSquare className="w-3 h-3" />
                      Meeting Summary
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {meeting.summary}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/meeting/${meeting.roomName}`)}
                  className="flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Join Meeting
                  <ExternalLink className="w-4 h-4 ml-2" />
                </button>
                <div className="flex -space-x-2">
                  {(meeting.members || []).slice(0, 3).map((m, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                      {m.name.charAt(0)}
                    </div>
                  ))}
                  {meeting.members?.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-bold">
                      +{meeting.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Schedule Meeting</h3>
                  <p className="text-sm text-gray-500 font-medium">Create a new Jitsi room</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="w-6 h-6 text-gray-400 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleCreateMeeting} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Meeting Title</label>
                  <input
                    required
                    type="text"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-medium"
                    placeholder="e.g. Weekly Sync"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Room Name</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      value={newMeeting.roomName}
                      onChange={(e) => setNewMeeting({ ...newMeeting, roomName: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-medium pr-28"
                      placeholder="unique-room-id"
                    />
                    <button
                      type="button"
                      onClick={generateRoomName}
                      className="absolute right-2 top-2 bottom-2 px-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Schedule At</label>
                  <input
                    type="datetime-local"
                    value={newMeeting.scheduledAt}
                    onChange={(e) => setNewMeeting({ ...newMeeting, scheduledAt: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Invite Members</label>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.map((member) => (
                      <button
                        type="button"
                        key={member._id}
                        onClick={() => {
                          const isSelected = newMeeting.members.includes(member._id);
                          setNewMeeting({
                            ...newMeeting,
                            members: isSelected 
                              ? newMeeting.members.filter(id => id !== member._id)
                              : [...newMeeting.members, member._id]
                          });
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          newMeeting.members.includes(member._id)
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                            : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200'
                        }`}
                      >
                        {member.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-2xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={createMeetingMutation.isLoading}
                    type="submit"
                    className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {createMeetingMutation.isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        Start Meeting
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeetingsTab;
