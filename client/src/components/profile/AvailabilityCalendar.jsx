import React, { useState, useEffect } from 'react';
import availabilityService from '../../services/availabilityService';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

const AvailabilityCalendar = ({ userId = null, readOnly = false }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Date selection
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Edit form states
  const [status, setStatus] = useState('Available');
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlotStart, setNewSlotStart] = useState('10:00');
  const [newSlotEnd, setNewSlotEnd] = useState('17:00');

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      let res;
      if (userId) {
        res = await availabilityService.getUserAvailability(userId);
      } else {
        res = await availabilityService.getMyAvailability();
      }
      setAvailabilities(res.availability || []);
    } catch (err) {
      setError('Failed to load availability calendar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [userId]);

  // Calendar Helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate days array (with padding)
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  // Get status for a specific date
  const getAvailabilityForDate = (date) => {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    return availabilities.find(
      (a) => new Date(a.date).toISOString().split('T')[0] === dateStr
    );
  };

  // Handle cell click
  const handleDateClick = (date) => {
    if (!date || readOnly) return;
    setSelectedDate(date);
    const existing = getAvailabilityForDate(date);
    if (existing) {
      setStatus(existing.status);
      setTimeSlots(existing.timeSlots || []);
    } else {
      setStatus('Available');
      setTimeSlots([]);
    }
    setError('');
    setSuccess('');
  };

  const handleAddSlot = () => {
    if (!newSlotStart || !newSlotEnd) return;
    setTimeSlots([...timeSlots, { start: newSlotStart, end: newSlotEnd, status: 'Available' }]);
  };

  const handleRemoveSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, idx) => idx !== index));
  };

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    if (!selectedDate) return;

    setError('');
    setSuccess('');
    try {
      const res = await availabilityService.setAvailability({
        date: selectedDate,
        status,
        timeSlots,
      });

      // Update local state list
      const updated = res.availability;
      setAvailabilities((prev) => {
        const idx = prev.findIndex(
          (a) =>
            new Date(a.date).toISOString().split('T')[0] ===
            new Date(updated.date).toISOString().split('T')[0]
        );
        if (idx > -1) {
          const next = [...prev];
          next[idx] = updated;
          return next;
        }
        return [...prev, updated];
      });

      setSuccess('Availability updated successfully');
      setSelectedDate(null);
    } catch (err) {
      setError(err.message || 'Failed to save availability');
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) return <Loader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Calendar Grid card */}
      <Card className="md:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-primary-500" />
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
              Availability Schedule
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800/40 pb-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-650 block" />
            <span>Vacation</span>
          </div>
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-2.5 text-center">
          {/* Weekday headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span key={d} className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">
              {d}
            </span>
          ))}

          {/* Days */}
          {days.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const avail = getAvailabilityForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            let bgClass = 'bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-850';
            let borderClass = 'border border-slate-200/50 dark:border-slate-800/50';
            let textClass = 'text-slate-800 dark:text-slate-200';

            if (avail) {
              if (avail.status === 'Available') {
                bgClass = 'bg-emerald-500/10 dark:bg-emerald-950/20 hover:bg-emerald-500/20';
                borderClass = 'border border-emerald-500/30';
                textClass = 'text-emerald-700 dark:text-emerald-400 font-extrabold';
              } else if (avail.status === 'Busy') {
                bgClass = 'bg-amber-500/10 dark:bg-amber-950/20 hover:bg-amber-500/20';
                borderClass = 'border border-amber-500/30';
                textClass = 'text-amber-700 dark:text-amber-400 font-extrabold';
              } else if (avail.status === 'Vacation') {
                bgClass = 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-150';
                borderClass = 'border border-slate-350/30';
                textClass = 'text-slate-500 dark:text-slate-450';
              }
            }

            if (isToday) {
              borderClass = 'border-2 border-primary-500 ring-2 ring-primary-500/10';
            }

            if (isSelected) {
              bgClass = 'bg-primary-500 text-white hover:bg-primary-600';
              textClass = 'text-white font-extrabold';
            }

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                disabled={readOnly}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative p-1.5 transition-all outline-none ${bgClass} ${borderClass} ${textClass}`}
              >
                <span className="text-xs font-bold">{date.getDate()}</span>
                {avail && avail.timeSlots && avail.timeSlots.length > 0 && !isSelected && (
                  <Clock size={10} className="mt-0.5 opacity-80" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Editor sidebar panel (only if not read-only) */}
      <div className="space-y-6">
        {!readOnly && selectedDate ? (
          <Card className="space-y-4 border border-primary-500/20">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
              Set Availability
            </h3>
            <p className="text-[10px] text-primary-500 font-bold">
              Configuring: {formatDate(selectedDate)}
            </p>

            <form onSubmit={handleSaveAvailability} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Vacation">Vacation</option>
                </select>
              </div>

              {status === 'Available' && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                  <label className="text-[10px] uppercase font-bold text-slate-450 block">Time Slots</label>
                  
                  {/* Slots list */}
                  {timeSlots.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic">No custom hours set. Marked available all day.</p>
                  ) : (
                    <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                      {timeSlots.map((slot, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">{slot.start} - {slot.end}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(idx)}
                            className="text-red-500 hover:text-red-650"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Slot Form */}
                  <div className="flex gap-2 items-center">
                    <input
                      type="time"
                      value={newSlotStart}
                      onChange={(e) => setNewSlotStart(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 px-2 text-[10px]"
                    />
                    <span className="text-slate-400 font-bold">-</span>
                    <input
                      type="time"
                      value={newSlotEnd}
                      onChange={(e) => setNewSlotEnd(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 px-2 text-[10px]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSlot}
                      className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-600 dark:text-slate-300"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setSelectedDate(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="flex-1">
                  Save Setup
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Card className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 p-6 text-center text-xs flex flex-col justify-center items-center h-full min-h-[220px]">
            <CalendarIcon size={32} className="text-slate-350 mb-2" />
            <p className="font-extrabold text-slate-700 dark:text-slate-300">
              {readOnly ? 'Availability Logs' : 'Calendar Editor'}
            </p>
            <p className="text-slate-450 mt-1">
              {readOnly 
                ? 'Select a date on the grid to inspect the custom hour slots and daily status details.'
                : 'Click any date cell on the grid schedule to adjust availability, block time slots, or schedule vacations.'
              }
            </p>
          </Card>
        )}

        {/* Selected date detail info (Read-only view support) */}
        {readOnly && selectedDate && (
          <Card className="space-y-4 border border-slate-200/60 dark:border-slate-800/60">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Date Details
            </h3>
            <p className="text-[10px] font-black text-slate-800 dark:text-slate-200">
              {formatDate(selectedDate)}
            </p>
            {(() => {
              const avail = getAvailabilityForDate(selectedDate);
              if (!avail) {
                return <Badge variant="success">Available All Day</Badge>;
              }
              return (
                <div className="space-y-3">
                  <Badge variant={avail.status === 'Available' ? 'success' : avail.status === 'Busy' ? 'warning' : 'secondary'}>
                    {avail.status.toUpperCase()}
                  </Badge>
                  {avail.status === 'Available' && avail.timeSlots && avail.timeSlots.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-850">
                      <p className="text-[10px] text-slate-400 font-bold">Custom Slots:</p>
                      {avail.timeSlots.map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-750 dark:text-slate-300">
                          <Clock size={12} className="text-primary-500" />
                          <span>{slot.start} - {slot.end}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </Card>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
