import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import teamService from '../../services/teamService';
import projectService from '../../services/projectService';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import useSocket from '../../hooks/useSocket';
import { useSelector } from 'react-redux';
import {
  Users,
  CheckSquare,
  FileText,
  MessageSquare,
  Plus,
  Send,
  Trash,
  UserPlus,
  Clock,
  ExternalLink,
  Calendar,
  Activity,
  CheckCircle,
  Eye
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSocket();
  
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activities, setActivities] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('tasks'); // 'tasks', 'files', 'chat', 'timeline'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend Developer');
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const [chatInput, setChatInput] = useState('');
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef(null);
  const chatEndRef = useRef(null);

  const fetchData = async () => {
    try {
      // Fetch project metadata
      const projRes = await projectService.getProject(projectId);
      setProject(projRes.project);

      // Fetch team details
      const memRes = await teamService.getProjectMembers(projectId);
      setMembers(memRes.members || []);
      setInvites(memRes.pendingInvitations || []);

      // Fetch tasks
      const taskRes = await teamService.getTasks(projectId);
      setTasks(taskRes.tasks || []);

      // Fetch files
      const fileRes = await teamService.getFiles(projectId);
      setFiles(fileRes.files || []);

      // Fetch chat messages
      const chatRes = await teamService.getChatMessages(projectId);
      setMessages(chatRes.messages || []);

      // Fetch activity timeline
      const actRes = await teamService.getActivities(projectId);
      setActivities(actRes.activities || []);
    } catch (err) {
      setError(err.message || 'Failed to load workspace data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  useEffect(() => {
    if (tab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Mark read on click
      teamService.markChatAsRead(projectId);
      if (socket) {
        socket.emit('workspace-mark-read', { projectId });
      }
    }
  }, [messages, tab, socket, projectId]);

  // Socket event binding for real-time channels
  useEffect(() => {
    if (!socket || !projectId) return;

    socket.emit('join-workspace', { projectId });

    const handleTeamMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleUserTyping = ({ userId: typingId, isTyping }) => {
      setTypingUsers((prev) => ({ ...prev, [typingId]: isTyping }));
    };

    const handleMessagesRead = ({ userId: readerId }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.senderId?._id !== readerId && !msg.readBy?.some((r) => r.userId === readerId)) {
            return {
              ...msg,
              readBy: [...(msg.readBy || []), { userId: readerId, readAt: new Date() }],
            };
          }
          return msg;
        })
      );
    };

    socket.on('team_message', handleTeamMessage);
    socket.on('workspace-user-typing', handleUserTyping);
    socket.on('workspace-messages-read', handleMessagesRead);

    return () => {
      socket.off('team_message', handleTeamMessage);
      socket.off('workspace-user-typing', handleUserTyping);
      socket.off('workspace-messages-read', handleMessagesRead);
    };
  }, [socket, projectId]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await teamService.inviteMember({
        projectId,
        freelancerEmail: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail('');
      setSuccess('Invitation sent successfully');
      // Refresh invites list
      const memRes = await teamService.getProjectMembers(projectId);
      setInvites(memRes.pendingInvitations || []);
      
      // Refresh timeline
      const actRes = await teamService.getActivities(projectId);
      setActivities(actRes.activities || []);
    } catch (err) {
      setError(err.message || 'Failed to send invitation');
    }
  };

  const handleRemoveMember = async (userId) => {
    setError('');
    setSuccess('');
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    try {
      await teamService.removeMember(projectId, userId);
      setSuccess('Member removed successfully');
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to remove member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await teamService.createTask(projectId, {
        title: taskTitle,
        description: taskDesc,
        assignedTo: taskAssignee || undefined,
        deadline: taskDeadline || undefined,
      });
      setTaskTitle('');
      setTaskDesc('');
      setTaskAssignee('');
      setTaskDeadline('');
      setShowTaskForm(false);
      
      const taskRes = await teamService.getTasks(projectId);
      setTasks(taskRes.tasks || []);

      // Refresh timeline
      const actRes = await teamService.getActivities(projectId);
      setActivities(actRes.activities || []);
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await teamService.updateTask(taskId, { status: newStatus });
      const taskRes = await teamService.getTasks(projectId);
      setTasks(taskRes.tasks || []);

      // Refresh timeline
      const actRes = await teamService.getActivities(projectId);
      setActivities(actRes.activities || []);
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!fileName || !fileUrl) return;
    setError('');
    try {
      await teamService.uploadFile(projectId, {
        name: fileName,
        url: fileUrl,
      });
      setFileName('');
      setFileUrl('');
      const fileRes = await teamService.getFiles(projectId);
      setFiles(fileRes.files || []);

      // Refresh timeline
      const actRes = await teamService.getActivities(projectId);
      setActivities(actRes.activities || []);
    } catch (err) {
      setError(err.message || 'Failed to upload file link');
    }
  };

  const handleTypingIndicator = () => {
    if (!socket) return;
    socket.emit('workspace-typing', { projectId, isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('workspace-typing', { projectId, isTyping: false });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    try {
      const res = await teamService.sendChatMessage(projectId, { text: chatInput });
      setMessages((prev) => [...prev, res.message]);
      setChatInput('');
      if (socket) {
        socket.emit('workspace-typing', { projectId, isTyping: false });
      }
    } catch (err) {
      setError(err.message || 'Failed to send message');
    }
  };

  if (loading) return <Loader />;
  if (!project) return <p className="text-center p-8 text-slate-500 font-semibold">Workspace not found.</p>;

  const isClient = user?.role === 'client';

  // Days left calculation
  const getDaysLeft = () => {
    if (!project.deadline) return 0;
    const diffTime = new Date(project.deadline) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Progress percentage calculation
  const getProgressPercent = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* SaaS Dashboard Top Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-primary-950/20 to-indigo-950/30 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-primary-500/20 text-primary-400 font-extrabold uppercase px-3 py-1 rounded-full border border-primary-500/30 tracking-widest">
              <Activity size={12} className="animate-pulse text-primary-400" /> Active Workspace Room
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{project.title}</h1>
            <p className="text-slate-450 text-xs sm:text-sm max-w-2xl line-clamp-1 leading-relaxed">
              {project.description}
            </p>
          </div>
          
          {/* Deadline / Days Left Tracker Widget */}
          <div className="flex flex-wrap gap-4 items-center bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-inner min-w-[280px]">
            <div className="flex-1 text-center border-r border-slate-850 pr-4">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Days Left</span>
              <span className="text-2xl font-black text-amber-500">{getDaysLeft()}</span>
            </div>
            <div className="flex-1 text-center border-r border-slate-850 pr-4">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Tasks Completed</span>
              <span className="text-2xl font-black text-emerald-500">
                {tasks.filter((t) => t.status === 'Completed').length}/{tasks.length}
              </span>
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Progress</span>
              <span className="text-2xl font-black text-indigo-400">{getProgressPercent()}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar under the header */}
        <div className="relative z-10 mt-6 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-850">
          <div 
            className="bg-gradient-to-r from-primary-500 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercent()}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-semibold rounded-2xl shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold rounded-2xl shadow-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns - Shared tabs content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dashboard Navigation Tabs */}
          <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 gap-1">
            <button
              onClick={() => setTab('tasks')}
              className={`flex-1 min-w-[90px] py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all
                ${tab === 'tasks'
                  ? 'bg-white dark:bg-slate-800 text-primary-650 dark:text-primary-400 shadow-md border border-slate-200/40 dark:border-slate-800/40'
                  : 'text-slate-550 hover:text-slate-800 dark:hover:text-slate-200'
                }
              `}
            >
              <CheckSquare size={16} /> Task Board
            </button>
            <button
              onClick={() => setTab('files')}
              className={`flex-1 min-w-[90px] py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all
                ${tab === 'files'
                  ? 'bg-white dark:bg-slate-800 text-primary-650 dark:text-primary-400 shadow-md border border-slate-200/40 dark:border-slate-800/40'
                  : 'text-slate-550 hover:text-slate-800 dark:hover:text-slate-200'
                }
              `}
            >
              <FileText size={16} /> Files Manager
            </button>
            <button
              onClick={() => setTab('chat')}
              className={`flex-1 min-w-[90px] py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all
                ${tab === 'chat'
                  ? 'bg-white dark:bg-slate-800 text-primary-650 dark:text-primary-400 shadow-md border border-slate-200/40 dark:border-slate-800/40'
                  : 'text-slate-550 hover:text-slate-800 dark:hover:text-slate-200'
                }
              `}
            >
              <MessageSquare size={16} /> Channel Chat
            </button>
            <button
              onClick={() => setTab('timeline')}
              className={`flex-1 min-w-[90px] py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all
                ${tab === 'timeline'
                  ? 'bg-white dark:bg-slate-800 text-primary-650 dark:text-primary-400 shadow-md border border-slate-200/40 dark:border-slate-800/40'
                  : 'text-slate-550 hover:text-slate-800 dark:hover:text-slate-200'
                }
              `}
            >
              <Activity size={16} /> Activity timeline
            </button>
          </div>

          {/* Tasks Pipeline Board */}
          {tab === 'tasks' && (
            <Card className="space-y-6 shadow-sm border border-slate-200/55 dark:border-slate-800/55">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Taskboard Pipeline</h2>
                  <p className="text-xs text-slate-400">Track and update sprint tasks deliverables.</p>
                </div>
                <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowTaskForm(!showTaskForm)}>
                  Create Task
                </Button>
              </div>

              {showTaskForm && (
                <form onSubmit={handleCreateTask} className="bg-slate-50 dark:bg-slate-950/60 p-5 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-4 shadow-inner">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Task Title (e.g. Design Landing Page)"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-250"
                      required
                    />
                    <select
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-250"
                    >
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.userId?._id} value={m.userId?._id}>
                          {m.userId?.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    placeholder="Task deliverables detail description..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-850 dark:text-slate-200"
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-550">
                      <Calendar size={14} /> Deadline:
                      <input
                        type="date"
                        value={taskDeadline}
                        onChange={(e) => setTaskDeadline(e.target.value)}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-bold text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowTaskForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" size="sm">
                        Create Task
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tasks board pipeline cards */}
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No tasks defined for this workspace.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {['Todo', 'In Progress', 'Completed'].map((stage) => {
                    const stageTasks = tasks.filter((t) => t.status === stage);
                    return (
                      <div key={stage} className="space-y-3">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 pl-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full block 
                            ${stage === 'Completed' ? 'bg-emerald-500' : ''}
                            ${stage === 'In Progress' ? 'bg-amber-500' : ''}
                            ${stage === 'Todo' ? 'bg-slate-400' : ''}
                          `} />
                          {stage} ({stageTasks.length})
                        </h3>
                        {stageTasks.length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic pl-5 py-2">No tasks in this pipeline stage.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {stageTasks.map((task) => (
                              <div key={task._id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4">
                                <div className="space-y-1.5">
                                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{task.title}</h4>
                                  <p className="text-xs text-slate-450 line-clamp-2 leading-relaxed">{task.description || 'No description provided.'}</p>
                                  
                                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-bold text-slate-400">
                                    {task.assignedTo ? (
                                      <span className="inline-flex items-center gap-1.5">
                                        <Avatar src={task.assignedTo.profileImage} name={task.assignedTo.name} size="xs" />
                                        <span>{task.assignedTo.name}</span>
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 italic">Unassigned</span>
                                    )}
                                    {task.deadline && (
                                      <span className="inline-flex items-center gap-1">
                                        <Clock size={11} /> Due {formatDate(task.deadline)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-3">
                                  <span className="text-[10px] font-bold text-slate-400">Pipeline Stage:</span>
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                    className={`rounded-full px-3 py-1 border text-[10px] font-extrabold tracking-wider focus:outline-none transition-all
                                      ${task.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-450' : ''}
                                      ${task.status === 'In Progress' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-450' : ''}
                                      ${task.status === 'Todo' ? 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-400' : ''}
                                    `}
                                  >
                                    <option value="Todo">TODO</option>
                                    <option value="In Progress">IN PROGRESS</option>
                                    <option value="Completed">COMPLETED</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}

          {/* Files manager manager */}
          {tab === 'files' && (
            <Card className="space-y-6 shadow-sm border border-slate-200/55 dark:border-slate-800/55">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Workspace Files Cabinet</h2>
                <p className="text-xs text-slate-400">Deliver code repositories, documents, designs, and ZIP assets.</p>
              </div>

              <form onSubmit={handleUploadFile} className="bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-4 shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Document Name (e.g. Prototype Archive ZIP)"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-250"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Shared Deliverable URL Link (GitHub / Drive)"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-250"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" size="sm" icon={Plus}>
                    Share File Deliverable
                  </Button>
                </div>
              </form>

              {files.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No shared documents found in workspace cabinet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3.5">
                  {files.map((file) => (
                    <div key={file._id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800/50 shadow-xs flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <p className="font-extrabold text-xs text-slate-850 dark:text-slate-100 flex items-center gap-2">
                          <FileText size={16} className="text-primary-500" /> {file.name}
                        </p>
                        <p className="text-[10px] text-slate-400 pl-6">
                          Shared by <span className="font-bold">{file.uploadedBy?.name}</span> on {formatDate(file.createdAt)}
                        </p>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-650 hover:underline font-extrabold shrink-0"
                      >
                        Open Asset <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Real-time Channels Chat Tab */}
          {tab === 'chat' && (
            <Card className="flex flex-col h-[550px] justify-between p-0 overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-2xl bg-white dark:bg-slate-950">
              <div className="p-4 border-b border-slate-150 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-primary-500" />
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-150">Workspace Room Channel</h3>
                </div>
                <Badge variant="success" className="text-[9px] font-extrabold">REAL-TIME SOCKET CONNECTED</Badge>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-slate-950/20">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                    <MessageSquare size={36} className="mb-2 text-slate-350" />
                    <p className="text-xs font-semibold">Room channel initialized. Send a real-time message to start!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwnMessage = msg.senderId?._id === user?._id;
                    const readers = msg.readBy?.filter(r => r.userId !== user?._id) || [];
                    const isReadByOthers = readers.length > 0;

                    return (
                      <div key={msg._id} className={`flex items-start gap-2.5 max-w-[80%] ${isOwnMessage ? 'ml-auto flex-row-reverse' : ''}`}>
                        <Avatar src={msg.senderId?.profileImage} name={msg.senderId?.name} size="xs" />
                        <div>
                          <div className={`flex items-center gap-2 text-[9px] font-bold text-slate-400 ${isOwnMessage ? 'justify-end' : ''}`}>
                            <span>{msg.senderId?.name}</span>
                            <span>•</span>
                            <span>{formatDate(msg.createdAt)}</span>
                          </div>
                          <div className={`p-3 rounded-2xl text-xs mt-1 leading-relaxed shadow-xs
                            ${isOwnMessage
                              ? 'bg-primary-550 text-white rounded-tr-none font-medium'
                              : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-200 rounded-tl-none font-medium'
                            }
                          `}>
                            {msg.text}
                          </div>
                          
                          {/* Read Receipts Checkmarks */}
                          {isOwnMessage && (
                            <div className="flex justify-end items-center gap-1.5 mt-0.5 pl-1.5">
                              {isReadByOthers ? (
                                <span className="text-[8px] font-bold text-primary-500 flex items-center gap-0.5">
                                  <Eye size={10} /> Seen by team
                                </span>
                              ) : (
                                <span className="text-[8px] text-slate-400">Sent</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input bar & typing status indicator */}
              <div className="p-4 border-t border-slate-150 dark:border-slate-800/60 bg-white dark:bg-slate-900">
                {/* Typing Indicator */}
                {Object.keys(typingUsers).map((typingId) => {
                  if (typingId !== user?._id && typingUsers[typingId]) {
                    const typingUserObj = members.find((m) => m.userId?._id === typingId);
                    return (
                      <div key={typingId} className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mb-2 pl-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" />
                        <span>{typingUserObj?.userId?.name || 'A team member'} is typing...</span>
                      </div>
                    );
                  }
                  return null;
                })}

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a team message..."
                    value={chatInput}
                    onChange={(e) => {
                      setChatInput(e.target.value);
                      handleTypingIndicator();
                    }}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-4 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-850 dark:text-slate-200 font-semibold"
                  />
                  <Button type="submit" variant="primary" className="rounded-xl shrink-0">
                    <Send size={16} />
                  </Button>
                </form>
              </div>
            </Card>
          )}

          {/* Activity Timeline Tab */}
          {tab === 'timeline' && (
            <Card className="space-y-6 shadow-sm border border-slate-200/55 dark:border-slate-800/55">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">Activity Timeline Logs</h2>
                <p className="text-xs text-slate-400">Verifiable trace of project events, deliverables, and financial releases.</p>
              </div>

              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No activities recorded for this workspace timeline yet.</p>
              ) : (
                <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6 py-2">
                  {activities.map((act) => (
                    <div key={act._id} className="relative group">
                      {/* Node indicator */}
                      <span className="absolute -left-[30px] top-0.5 flex items-center justify-center w-4 h-4 rounded-full border bg-white dark:bg-slate-950 border-primary-500 text-primary-500">
                        <CheckCircle size={10} className="stroke-[3]" />
                      </span>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100">{act.message}</span>
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-full text-slate-450 uppercase font-black tracking-wider">
                            {act.activityType.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Avatar src={act.userId?.profileImage} name={act.userId?.name} size="xs" />
                          <span>By {act.userId?.name}</span>
                          <span>•</span>
                          <span>{formatDate(act.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right Columns: Roster list & invite pane */}
        <div className="space-y-6">
          {/* Members list */}
          <Card className="space-y-4 shadow-sm border border-slate-200/55 dark:border-slate-800/55">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} /> Active Workspace Team
            </h3>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {/* Client Owner */}
              <div className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Avatar src={project.clientId?.profileImage} name={project.clientId?.name} size="sm" />
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-900 bg-emerald-500" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-slate-850 dark:text-slate-150">{project.clientId?.name}</p>
                    <p className="text-[9px] text-slate-400">Project Client / Manager</p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              {members.map((m) => (
                <div key={m._id} className="py-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <Avatar src={m.userId?.profileImage} name={m.userId?.name} size="sm" />
                      <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-900 bg-emerald-500" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-850 dark:text-slate-150">{m.userId?.name}</p>
                      <p className="text-[9px] text-slate-400">{m.role}</p>
                    </div>
                  </div>
                  {isClient && (
                    <button
                      onClick={() => handleRemoveMember(m.userId?._id)}
                      className="text-red-500 hover:text-red-650 transition-colors p-1"
                      title="Remove Member"
                    >
                      <Trash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Invitation Panel (Client only) */}
          {isClient && (
            <Card className="space-y-4 shadow-sm border border-slate-200/55 dark:border-slate-800/55">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus size={14} /> Send Team Invite
              </h3>
              
              <form onSubmit={handleInvite} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Freelancer Email</label>
                  <input
                    type="email"
                    placeholder="freelancer@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-250"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Team Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-semibold text-slate-800 dark:text-slate-250"
                  >
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="UI Designer">UI Designer</option>
                    <option value="QA Engineer">QA Engineer</option>
                  </select>
                </div>
                <Button type="submit" variant="primary" className="w-full" size="sm">
                  Send Invitation
                </Button>
              </form>
            </Card>
          )}

          {/* Pending Invitations list (Client only) */}
          {isClient && invites.length > 0 && (
            <Card className="space-y-3 shadow-sm border border-slate-200/55 dark:border-slate-800/55">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pending Invitations
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {invites.map((inv) => (
                  <div key={inv._id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-250">{inv.freelancerId?.name}</p>
                      <p className="text-[9px] text-slate-400">{inv.role}</p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
