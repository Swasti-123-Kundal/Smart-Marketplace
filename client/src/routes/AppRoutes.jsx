import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import SignupPage from '../pages/public/SignupPage';
import AccessDenied from '../pages/public/AccessDenied';

// Client Pages
import ClientDashboard from '../pages/client/ClientDashboard';
import CreateProject from '../pages/client/CreateProject';
import MyProjects from '../pages/client/MyProjects';
import ClientContracts from '../pages/client/ClientContracts';
import ClientMessages from '../pages/client/ClientMessages';
import ClientPayments from '../pages/client/ClientPayments';
import ClientSettings from '../pages/client/ClientSettings';
import BrowseFreelancers from '../pages/client/BrowseFreelancers';

// Freelancer Pages
import FreelancerDashboard from '../pages/freelancer/FreelancerDashboard';
import BrowseProjects from '../pages/freelancer/BrowseProjects';
import MyProposals from '../pages/freelancer/MyProposals';
import FreelancerContracts from '../pages/freelancer/FreelancerContracts';
import FreelancerMessages from '../pages/freelancer/FreelancerMessages';
import Earnings from '../pages/freelancer/Earnings';
import FreelancerProfile from '../pages/freelancer/FreelancerProfile';
import FreelancerSettings from '../pages/freelancer/FreelancerSettings';
import SkillQuizPage from '../pages/freelancer/SkillQuizPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageProjects from '../pages/admin/ManageProjects';
import ManageContracts from '../pages/admin/ManageContracts';
import ManagePayments from '../pages/admin/ManagePayments';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import ManageDisputes from '../pages/admin/ManageDisputes';

// Shared Pages
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ContractDetailPage from '../pages/ContractDetailPage';
import Leaderboard from '../pages/shared/Leaderboard';
import ProjectWorkspace from '../pages/shared/ProjectWorkspace';
import InvitationsList from '../pages/freelancer/InvitationsList';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Route>

      {/* Client Protected Routes */}
      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['client']}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="browse-freelancers" element={<BrowseFreelancers />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="create-project" element={<CreateProject />} />
        <Route path="projects" element={<MyProjects />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="contracts" element={<ClientContracts />} />
        <Route path="contracts/:id" element={<ContractDetailPage />} />
        <Route path="messages" element={<ClientMessages />} />
        <Route path="payments" element={<ClientPayments />} />
        <Route path="settings" element={<ClientSettings />} />
        <Route path="workspace/:projectId" element={<ProjectWorkspace />} />
      </Route>

      {/* Freelancer Protected Routes */}
      <Route
        path="/freelancer"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['freelancer']}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<FreelancerDashboard />} />
        <Route path="browse" element={<BrowseProjects />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="proposals" element={<MyProposals />} />
        <Route path="contracts" element={<FreelancerContracts />} />
        <Route path="contracts/:id" element={<ContractDetailPage />} />
        <Route path="messages" element={<FreelancerMessages />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="profile" element={<FreelancerProfile />} />
        <Route path="settings" element={<FreelancerSettings />} />
        <Route path="quiz/:skill" element={<SkillQuizPage />} />
        <Route path="workspace/:projectId" element={<ProjectWorkspace />} />
        <Route path="team-invitations" element={<InvitationsList />} />
      </Route>


      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="contracts" element={<ManageContracts />} />
        <Route path="payments" element={<ManagePayments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="disputes" element={<ManageDisputes />} />
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
