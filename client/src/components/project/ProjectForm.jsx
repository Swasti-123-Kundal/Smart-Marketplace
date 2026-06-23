import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const ProjectForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [budget, setBudget] = useState(initialData.budget || '');
  const [deadline, setDeadline] = useState(
    initialData.deadline
      ? new Date(initialData.deadline).toISOString().split('T')[0]
      : ''
  );
  const [skills, setSkills] = useState(initialData.skillsRequired?.join(', ') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !budget || !deadline || !skills) return;

    const skillList = skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');

    onSubmit({
      title,
      description,
      budget: Number(budget),
      deadline: new Date(deadline),
      skillsRequired: skillList,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Project Title"
          id="title"
          placeholder="e.g. Full-Stack E-Commerce Website Development"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Detailed Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline your project scope, features, requirements, deliverables..."
            rows={6}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Total Budget (INR)"
            id="budget"
            type="number"
            placeholder="e.g. 50000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <Input
            label="Target Completion Date"
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <Input
          label="Required Skills (Comma-separated)"
          id="skills"
          placeholder="React, Node.js, Mongoose, Payment Gateway"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          helperText="Identify key skills that freelancers will search by"
          required
        />

        <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800/50 pt-5">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="px-8"
          >
            {initialData._id ? 'Update Project' : 'Post Project'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProjectForm;
