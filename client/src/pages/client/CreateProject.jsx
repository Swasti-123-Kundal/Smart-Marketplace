import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../redux/slices/projectSlice';
import ProjectForm from '../../components/project/ProjectForm';

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = async (projectData) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await dispatch(createProject(projectData)).unwrap();
      navigate('/client/projects');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to post project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Post a New Gig Project</h1>
        <p className="text-slate-500 text-sm">Provide clear details about your goals and required freelancers credentials.</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl">
          {errorMsg}
        </div>
      )}

      <ProjectForm onSubmit={handleFormSubmit} loading={loading} />
    </div>
  );
};

export default CreateProject;
