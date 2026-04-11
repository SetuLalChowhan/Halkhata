import React, { useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axios';
import { X, Save, MessageSquare } from 'lucide-react';

const MeetingPage = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summary, setSummary] = useState('');
  const [meetingData, setMeetingData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [jaasData, setJaasData] = useState({ token: '', appId: '' });
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  useEffect(() => {
    const fetchMeetingAndToken = async () => {
      try {
        const [mRes, tRes] = await Promise.all([
          axiosInstance.get(`/meetings/${roomName}`),
          axiosInstance.get(`/meetings/token/${roomName}`)
        ]);
        setMeetingData(mRes.data);
        setJaasData(tRes.data);
      } catch (err) {
        console.error('Failed to fetch meeting or token');
        toast.error('Authentication failed for JaaS');
      } finally {
        setIsLoadingToken(false);
      }
    };
    fetchMeetingAndToken();
  }, [roomName]);

  const handleSaveSummary = async () => {
    if (!summary.trim()) {
      toast.error('Please enter a summary');
      return;
    }
    setIsSaving(true);
    try {
      await axiosInstance.put(`/meetings/${meetingData._id}`, {
        summary,
        status: 'completed'
      });
      toast.success('Meeting summary saved!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to save summary');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingToken) {
    return (
      <div className="h-screen w-full bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-900 overflow-hidden flex flex-col">
      {/* Jitsi Meeting Container */}
      <div className="flex-1 w-full bg-black relative">
        <JitsiMeeting
          domain="8x8.vc"
          roomName={`${jaasData.appId}/${roomName}`}
          jwt={jaasData.token}
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: false,
            enableEmailInStats: false,
            prejoinPageEnabled: false,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            MOBILE_APP_PROMO: false,
          }}
          userInfo={{
            displayName: user?.name || 'Guest User',
            email: user?.email,
          }}
          onApiReady={(externalApi) => {
            externalApi.addListener('videoConferenceLeft', () => {
              setShowSummaryModal(true);
            });
          }}
          onReadyToClose={() => {
            setShowSummaryModal(true);
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
          }}
        />
      </div>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummaryModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Meeting Summary</h3>
                    <p className="text-xs text-gray-500 font-medium">Wrap up your discussion</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Key Takeaways & Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="What was discussed in this meeting?"
                  className="w-full h-40 p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none resize-none text-gray-700 leading-relaxed"
                />
              </div>

              <div className="p-6 bg-gray-50 flex gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-white transition-all active:scale-95"
                >
                  Skip & Exit
                </button>
                <button
                  onClick={handleSaveSummary}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Summary
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeetingPage;
