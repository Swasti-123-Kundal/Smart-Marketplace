import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/slices/authSlice';
import userService from '../../services/userService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const ClientSettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await userService.updateProfile({ name });
      dispatch(updateUser(res.user));
      setMessage({ text: 'Settings saved successfully', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to save settings', type: 'danger' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Client Settings</h1>
        <p className="text-slate-500 text-sm">Configure your personal and corporate details.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border text-sm font-semibold
          ${message.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }
        `}>
          {message.text}
        </div>
      )}

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Company / Contact Name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              variant="primary"
              loading={updating}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ClientSettings;
