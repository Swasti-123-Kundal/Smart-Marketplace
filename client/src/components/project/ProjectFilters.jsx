import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { Search, Filter, RefreshCw } from 'lucide-react';

const ProjectFilters = ({ onApplyFilters, onResetFilters }) => {
  const [search, setSearch] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [skills, setSkills] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    onApplyFilters({
      search,
      minBudget: minBudget ? Number(minBudget) : undefined,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      skills: skills ? skills : undefined,
    });
  };

  const handleReset = () => {
    setSearch('');
    setMinBudget('');
    setMaxBudget('');
    setSkills('');
    onResetFilters();
  };

  return (
    <Card className="h-fit">
      <div className="flex items-center gap-2 mb-5">
        <Filter size={18} className="text-primary-500" />
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Filter Projects</h3>
      </div>

      <form onSubmit={handleApply} className="flex flex-col gap-4">
        <Input
          label="Search Keyword"
          id="search"
          placeholder="e.g. Website, Mobile App"
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Min Budget"
            id="minBudget"
            type="number"
            placeholder="Min"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
          />
          <Input
            label="Max Budget"
            id="maxBudget"
            type="number"
            placeholder="Max"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
          />
        </div>

        <Input
          label="Skills Required"
          id="skillsFilter"
          placeholder="React, CSS"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          helperText="Comma separated"
        />

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
          >
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            icon={RefreshCw}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProjectFilters;
