import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyProjects } from '../../redux/slices/projectSlice';
import ProjectCard from '../../components/project/ProjectCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { PlusCircle, Info } from 'lucide-react';

const MyProjects = () => {
  const dispatch = useDispatch();
  const { myProjects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchMyProjects());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">My Posted Projects</h1>
          <p className="text-slate-500 text-sm">Manage your listed jobs and evaluate freelancer proposals.</p>
        </div>
        <Link to="/client/create-project">
          <Button variant="primary" icon={PlusCircle}>
            Post a Project
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {myProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-white dark:bg-slate-900/50">
          <Info size={40} className="text-slate-400 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No Projects Posted Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
            Get started by posting your first job description and hiring top-tier freelancers.
          </p>
          <Link to="/client/create-project">
            <Button variant="primary">Post First Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              actionText="Manage Project"
              actionLink={`/client/projects/${project._id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
