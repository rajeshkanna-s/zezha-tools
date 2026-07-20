import React, { useState, useMemo, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Clock, Plus, Trash2, CheckCircle2, RefreshCw, Sparkles, AlertCircle, Download, Play, Pause, Square, Timer } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BrainDumpTask {
  id: string;
  text: string;
  completed: boolean;
}

interface TimeBoxSlot {
  id: string;
  timeLabel: string;
  task: string;
  category: 'Work/Study' | 'Health/Fitness' | 'Rest/Sleep' | 'Leisure/Social' | 'Unassigned';
}

const INITIAL_BRAIN_DUMP: BrainDumpTask[] = [
  { id: 'bd-1', text: 'Write project report outline', completed: false },
  { id: 'bd-2', text: '30-minute cardio workout', completed: false },
  { id: 'bd-3', text: 'Call dentist for appointment', completed: false },
  { id: 'bd-4', text: 'Code review for new feature', completed: false },
  { id: 'bd-5', text: 'Read 10 pages of book', completed: false },
];

const ROUTINE_PRESETS: Record<string, { name: string; slots1h: TimeBoxSlot[]; slots30m?: TimeBoxSlot[] }> = {
  dev: {
    name: 'Developer 9-to-5',
    slots1h: [
      { id: 'slot-600', timeLabel: '06:00 AM - 07:00 AM', task: 'Morning Routine & Coffee', category: 'Health/Fitness' },
      { id: 'slot-700', timeLabel: '07:00 AM - 08:00 AM', task: 'Yoga / Light Stretching', category: 'Health/Fitness' },
      { id: 'slot-800', timeLabel: '08:00 AM - 09:00 AM', task: 'Commute & Podcasts', category: 'Leisure/Social' },
      { id: 'slot-900', timeLabel: '09:00 AM - 10:00 AM', task: 'Inbox Zero & Slack triage', category: 'Work/Study' },
      { id: 'slot-1000', timeLabel: '10:00 AM - 11:00 AM', task: 'Deep Work: Coding Features', category: 'Work/Study' },
      { id: 'slot-1100', timeLabel: '11:00 AM - 12:00 PM', task: 'Deep Work: Coding Features', category: 'Work/Study' },
      { id: 'slot-1200', timeLabel: '12:00 PM - 01:00 PM', task: 'Lunch & Walk', category: 'Rest/Sleep' },
      { id: 'slot-1300', timeLabel: '01:00 PM - 02:00 PM', task: 'Team Standup & Alignment', category: 'Work/Study' },
      { id: 'slot-1400', timeLabel: '02:00 PM - 03:00 PM', task: 'Code Review & Pull Requests', category: 'Work/Study' },
      { id: 'slot-1500', timeLabel: '03:00 PM - 04:00 PM', task: 'Design & Architecture', category: 'Work/Study' },
      { id: 'slot-1600', timeLabel: '04:00 PM - 05:00 PM', task: 'Daily Wrap-up & Tomorrow Prep', category: 'Work/Study' },
      { id: 'slot-1700', timeLabel: '05:00 PM - 06:00 PM', task: 'Commute home', category: 'Leisure/Social' },
      { id: 'slot-1800', timeLabel: '06:00 PM - 07:00 PM', task: 'Dinner with family', category: 'Leisure/Social' },
      { id: 'slot-1900', timeLabel: '07:00 PM - 08:00 PM', task: 'Cardio Gym Workout', category: 'Health/Fitness' },
      { id: 'slot-2000', timeLabel: '08:00 PM - 09:00 PM', task: 'Hobby coding / Reading', category: 'Leisure/Social' },
      { id: 'slot-2100', timeLabel: '09:00 PM - 10:00 PM', task: 'Bedtime prep & Meditation', category: 'Rest/Sleep' },
    ]
  },
  musk: {
    name: 'Musk Hyper-Focus Mode',
    slots1h: [
      { id: 'slot-600', timeLabel: '06:00 AM - 07:00 AM', task: 'Emails & Critical Decisions', category: 'Work/Study' },
      { id: 'slot-700', timeLabel: '07:00 AM - 08:00 AM', task: 'Shower & Commute to factory', category: 'Rest/Sleep' },
      { id: 'slot-800', timeLabel: '08:00 AM - 09:00 AM', task: 'Engineering meeting (Tesla)', category: 'Work/Study' },
      { id: 'slot-900', timeLabel: '09:00 AM - 10:00 AM', task: 'Design review (SpaceX)', category: 'Work/Study' },
      { id: 'slot-1000', timeLabel: '10:00 AM - 11:00 AM', task: 'Supplier calls', category: 'Work/Study' },
      { id: 'slot-1100', timeLabel: '11:00 AM - 12:00 PM', task: 'Shop floor inspection', category: 'Work/Study' },
      { id: 'slot-1200', timeLabel: '12:00 PM - 01:00 PM', task: 'Lunch during meeting', category: 'Work/Study' },
      { id: 'slot-1300', timeLabel: '01:00 PM - 02:00 PM', task: 'Media interview / PR', category: 'Work/Study' },
      { id: 'slot-1400', timeLabel: '02:00 PM - 03:00 PM', task: 'Deep Work: Rocket telemetry', category: 'Work/Study' },
      { id: 'slot-1500', timeLabel: '03:00 PM - 04:00 PM', task: 'FSD Autopilot review', category: 'Work/Study' },
      { id: 'slot-1600', timeLabel: '04:00 PM - 05:00 PM', task: 'Board review', category: 'Work/Study' },
      { id: 'slot-1700', timeLabel: '05:00 PM - 06:00 PM', task: 'Venture Capital pitch', category: 'Work/Study' },
      { id: 'slot-1800', timeLabel: '06:00 PM - 07:00 PM', task: 'Light meal & Gym', category: 'Health/Fitness' },
      { id: 'slot-1900', timeLabel: '07:00 PM - 08:00 PM', task: 'Review X metrics', category: 'Work/Study' },
      { id: 'slot-2000', timeLabel: '08:00 PM - 09:00 PM', task: 'Time with kids', category: 'Leisure/Social' },
      { id: 'slot-2100', timeLabel: '09:00 PM - 10:00 PM', task: 'Late emails & Wind down', category: 'Work/Study' },
    ]
  },
  study: {
    name: 'Deep Study Routine',
    slots1h: [
      { id: 'slot-600', timeLabel: '06:00 AM - 07:00 AM', task: 'Meditation & Hydration', category: 'Health/Fitness' },
      { id: 'slot-700', timeLabel: '07:00 AM - 08:00 AM', task: 'Revision session (Active Recall)', category: 'Work/Study' },
      { id: 'slot-800', timeLabel: '08:00 AM - 09:00 AM', task: 'Healthy Breakfast', category: 'Health/Fitness' },
      { id: 'slot-900', timeLabel: '09:00 AM - 10:00 AM', task: 'Subject 1: Core Lectures', category: 'Work/Study' },
      { id: 'slot-1000', timeLabel: '10:00 AM - 11:00 AM', task: 'Subject 1: Exercises', category: 'Work/Study' },
      { id: 'slot-1100', timeLabel: '11:00 AM - 12:00 PM', task: 'Review weak concepts', category: 'Work/Study' },
      { id: 'slot-1200', timeLabel: '12:00 PM - 01:00 PM', task: 'Lunch & Audio book walk', category: 'Rest/Sleep' },
      { id: 'slot-1300', timeLabel: '01:00 PM - 02:00 PM', task: 'Power Nap / Rest', category: 'Rest/Sleep' },
      { id: 'slot-1400', timeLabel: '02:00 PM - 03:00 PM', task: 'Subject 2: Core Theory', category: 'Work/Study' },
      { id: 'slot-1500', timeLabel: '03:00 PM - 04:00 PM', task: 'Subject 2: Practice Problems', category: 'Work/Study' },
      { id: 'slot-1600', timeLabel: '04:00 PM - 05:00 PM', task: 'Study group discussion', category: 'Work/Study' },
      { id: 'slot-1700', timeLabel: '05:00 PM - 06:00 PM', task: 'Evening Jog', category: 'Health/Fitness' },
      { id: 'slot-1800', timeLabel: '06:00 PM - 07:00 PM', task: 'Dinner & Relax', category: 'Rest/Sleep' },
      { id: 'slot-1900', timeLabel: '07:00 PM - 08:00 PM', task: 'Read paper / Research', category: 'Work/Study' },
      { id: 'slot-2000', timeLabel: '08:00 PM - 09:00 PM', task: 'Call friends / Social', category: 'Leisure/Social' },
      { id: 'slot-2100', timeLabel: '09:00 PM - 10:00 PM', task: 'Journaling & Sleep Prep', category: 'Rest/Sleep' },
    ]
  }
};

const CATEGORY_COLORS = {
  'Work/Study': '#6366f1',      // indigo-500
  'Health/Fitness': '#10b981',  // emerald-500
  'Rest/Sleep': '#64748b',      // slate-500
  'Leisure/Social': '#f59e0b',  // amber-500
  'Unassigned': '#e2e8f0',      // slate-200
};

export const TimeBoxerPage: React.FC = () => {
  const [selectedRoutineKey, setSelectedRoutineKey] = useState('dev');
  const [timeboxInterval, setTimeboxInterval] = useState<'1h' | '30m'>('1h');
  
  const [brainDump, setBrainDump] = useState<BrainDumpTask[]>(INITIAL_BRAIN_DUMP);
  const [slots, setSlots] = useState<TimeBoxSlot[]>(ROUTINE_PRESETS.dev.slots1h);
  const [newTaskText, setNewTaskText] = useState('');
  
  // Top 3 Priorities for the day
  const [priority1, setPriority1] = useState('Finish the API integration');
  const [priority2, setPriority2] = useState('Do a 30-min workout');
  const [priority3, setPriority3] = useState('Read chapter 4 of design book');

  // Pomodoro Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 minutes default
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic generate slots when interval changes
  useEffect(() => {
    const basePreset = ROUTINE_PRESETS[selectedRoutineKey]?.slots1h || ROUTINE_PRESETS.dev.slots1h;
    if (timeboxInterval === '1h') {
      setSlots(basePreset);
    } else {
      // Generate 32 half-hour slots based on preset tasks
      const newSlots: TimeBoxSlot[] = [];
      basePreset.forEach((slot, index) => {
        const hour = 6 + index;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const formattedHour = hour <= 12 ? hour : hour - 12;
        const formattedNextHour = (hour + 1) <= 12 ? (hour + 1) : (hour + 1) - 12;
        const nextAmpm = (hour + 1) < 12 ? 'AM' : 'PM';

        newSlots.push({
          id: `${slot.id}-00`,
          timeLabel: `${formattedHour.toString().padStart(2, '0')}:00 ${ampm} - ${formattedHour.toString().padStart(2, '0')}:30 ${ampm}`,
          task: slot.task,
          category: slot.category
        });
        newSlots.push({
          id: `${slot.id}-30`,
          timeLabel: `${formattedHour.toString().padStart(2, '0')}:30 ${ampm} - ${formattedNextHour.toString().padStart(2, '0')}:00 ${nextAmpm}`,
          task: '',
          category: 'Unassigned'
        });
      });
      setSlots(newSlots);
    }
  }, [timeboxInterval, selectedRoutineKey]);

  // Pomodoro Timer Logic
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            // Trigger sound on finish
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = audioCtx.createOscillator();
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
              oscillator.connect(audioCtx.destination);
              oscillator.start();
              setTimeout(() => oscillator.stop(), 500);
            } catch (e) {
              console.log('Audio Context blocked or unsupported');
            }

            // Swap modes
            if (timerMode === 'work') {
              setTimerMode('break');
              alert('🚨 Focus Session Completed! Time for a 5-minute break.');
              return 5 * 60;
            } else {
              setTimerMode('work');
              alert('🏁 Break Over! Ready to dive back in?');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, timerMode]);

  const handleStartPauseTimer = () => {
    setTimerActive(!timerActive);
  };

  const handleResetTimer = (mode: 'work' | 'break') => {
    setTimerActive(false);
    setTimerMode(mode);
    setTimerSeconds(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formattedTimerTime = useMemo(() => {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timerSeconds]);

  const handleAddBrainDump = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: BrainDumpTask = {
      id: `bd-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false
    };
    setBrainDump(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  const handleDeleteBrainDump = (id: string) => {
    setBrainDump(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompleted = (id: string) => {
    setBrainDump(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleSlotTaskChange = (slotId: string, text: string) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, task: text } : s));
  };

  const handleSlotCategoryChange = (slotId: string, cat: TimeBoxSlot['category']) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, category: cat } : s));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear the entire schedule?")) {
      setSlots(prev => prev.map(s => ({ ...s, task: '', category: 'Unassigned' })));
      setBrainDump([]);
      setPriority1('');
      setPriority2('');
      setPriority3('');
    }
  };

  const handleRoutinePresetChange = (key: string) => {
    setSelectedRoutineKey(key);
    if (ROUTINE_PRESETS[key]) {
      if (timeboxInterval === '1h') {
        setSlots(ROUTINE_PRESETS[key].slots1h);
      } else {
        // trigger recalculation inside useEffect
      }
    }
  };

  // Drag and drop handler
  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    // Dragging within Brain Dump
    if (source.droppableId === 'brain-dump' && destination.droppableId === 'brain-dump') {
      const items = Array.from(brainDump);
      const [reordered] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reordered);
      setBrainDump(items);
      return;
    }

    // Dragging from Brain Dump into a time slot
    if (source.droppableId === 'brain-dump' && destination.droppableId.startsWith('slot-drop-')) {
      const slotId = destination.droppableId.replace('slot-drop-', '');
      const task = brainDump[source.index];
      if (task) {
        setSlots(prev => prev.map(s => s.id === slotId ? {
          ...s,
          task: task.text,
          category: 'Work/Study' // Default to work/study when dropped
        } : s));
      }
    }
  };

  // Calculation: circular day balance chart
  const balanceData = useMemo(() => {
    const counts: Record<string, number> = {
      'Work/Study': 0,
      'Health/Fitness': 0,
      'Rest/Sleep': 0,
      'Leisure/Social': 0,
      'Unassigned': 0,
    };

    slots.forEach(s => {
      // Calculate hours contribution
      const duration = timeboxInterval === '1h' ? 1.0 : 0.5;
      counts[s.category] += duration;
    });

    return Object.keys(counts)
      .map(key => ({
        name: key,
        value: counts[key]
      }))
      .filter(item => item.value > 0);
  }, [slots, timeboxInterval]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-wider uppercase">
            <Sparkles size={16} />
            <span>Productivity Hack</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Time-Boxer & Daily Routine Planner
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Unleash hyper-focus with Elon Musk's time-boxing technique. Brain dump your tasks, pick your top 3 priorities, and block your day hour-by-hour.
          </p>
        </div>
        
        {/* Presets and options bar */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <select
            value={selectedRoutineKey}
            onChange={e => handleRoutinePresetChange(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="dev">Preset: Developer Routine</option>
            <option value="musk">Preset: Elon Musk Mode</option>
            <option value="study">Preset: Deep Study Day</option>
          </select>

          <button
            onClick={() => {
              const textContent = `ZEZHATOOLS TIMEBOXER DAILY PLANNER\n\n` +
                `DAILY TOP 3 PRIORITIES:\n` +
                `1. ${priority1 || 'Unspecified'}\n` +
                `2. ${priority2 || 'Unspecified'}\n` +
                `3. ${priority3 || 'Unspecified'}\n\n` +
                `BRAIN DUMP ITEMS:\n` +
                (brainDump.length > 0 ? brainDump.map(b => `- [${b.completed ? 'x' : ' '}] ${b.text}`).join('\n') : 'No items') +
                `\n\nHOURLY TIMEBOX BLOCKS:\n` +
                slots.map(s => `- ${s.timeLabel}: ${s.task || 'Unassigned'} [Category: ${s.category}]`).join('\n') +
                `\n\nGenerated via ZezhaTools.com`;
              const blob = new Blob([textContent], { type: 'text/plain' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'daily_timebox_routine.txt';
              link.click();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <Download size={14} />
            <span>Export Plan (TXT)</span>
          </button>
          
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 shadow-sm transition-all shrink-0"
          >
            <RefreshCw size={14} />
            <span>Clear Routine</span>
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT PANEL: Brain Dump & Priorities */}
          <div className="space-y-6">
            {/* Active Pomodoro Timer */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-center">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-center gap-1.5">
                <Timer size={16} className="text-rose-500" />
                <span>Pomodoro Focus Timer</span>
              </h2>

              <div className="py-2">
                <div className={`text-5xl font-black font-mono tracking-wider transition-colors ${
                  timerActive ? 'text-indigo-600' : 'text-slate-700'
                }`}>
                  {formattedTimerTime}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 block">
                  {timerMode === 'work' ? '🔥 Focus Mode (Work)' : '🔋 Break Time'}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2.5">
                <button
                  onClick={handleStartPauseTimer}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all text-white ${
                    timerActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {timerActive ? <Pause size={12} /> : <Play size={12} />}
                  <span>{timerActive ? 'Pause' : 'Start Focus'}</span>
                </button>

                <button
                  onClick={() => handleResetTimer('work')}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all"
                  title="Reset Work Session"
                >
                  <Square size={13} />
                </button>

                <button
                  onClick={() => handleResetTimer('break')}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold transition-all border border-emerald-200/50"
                >
                  Quick Break
                </button>
              </div>
            </div>

            {/* Top 3 Priorities */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="text-indigo-600 font-black text-sm">#</span>
                <span>Today's Top 3 Priorities</span>
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-indigo-500 bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center">1</span>
                  <input
                    type="text"
                    value={priority1}
                    onChange={e => setPriority1(e.target.value)}
                    placeholder="First major goal..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-indigo-500 bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center">2</span>
                  <input
                    type="text"
                    value={priority2}
                    onChange={e => setPriority2(e.target.value)}
                    placeholder="Second major goal..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-indigo-500 bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center">3</span>
                  <input
                    type="text"
                    value={priority3}
                    onChange={e => setPriority3(e.target.value)}
                    placeholder="Third major goal..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Brain Dump Drag-Drop zone */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                🧠 Brain Dump (Drag Tasks to Schedule)
              </h2>
              
              <form onSubmit={handleAddBrainDump} className="flex gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  placeholder="Dump a task or thought..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
                <button
                  type="submit"
                  className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-indigo-100 shrink-0"
                >
                  <Plus size={14} />
                </button>
              </form>

              <Droppable droppableId="brain-dump">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 max-h-72 overflow-y-auto pr-1 min-h-[100px] border border-dashed border-slate-200 p-2 rounded-xl"
                  >
                    {brainDump.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">Your brain is clear! Add some items above.</p>
                    ) : (
                      brainDump.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold cursor-grab active:cursor-grabbing transition-all ${
                                snapshot.isDragging
                                  ? 'bg-indigo-50 border-indigo-300 shadow-md scale-[1.02]'
                                  : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleTaskCompleted(task.id)}
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                    task.completed
                                      ? 'bg-emerald-500 border-emerald-500 text-white'
                                      : 'border-slate-300 hover:border-emerald-500'
                                  }`}
                                >
                                  {task.completed && <CheckCircle2 size={10} />}
                                </button>
                                <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                                  {task.text}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteBrainDump(task.id)}
                                className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Day Balance Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                ⚖️ Day Balance Analysis
              </h2>
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={balanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {balanceData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name as TimeBoxSlot['category']] || '#e2e8f0'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} hour(s)`, 'Duration']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                {Object.keys(CATEGORY_COLORS).map(cat => {
                  const valObj = balanceData.find(d => d.name === cat);
                  const hrs = valObj ? valObj.value : 0;
                  return (
                    <div key={cat} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat as TimeBoxSlot['category']] }} />
                      <span className="truncate">{cat}: {hrs}h</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Hourly Schedule Blocks */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                <span>Your Day Blocks (6 AM - 10 PM)</span>
              </h2>
              
              {/* Interval Switcher (1h vs 30m) */}
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setTimeboxInterval('1h')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all ${
                    timeboxInterval === '1h'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  1-Hour
                </button>
                <button
                  onClick={() => setTimeboxInterval('30m')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all ${
                    timeboxInterval === '30m'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  30-Min
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 max-h-[750px]">
              {slots.map((slot) => (
                <Droppable key={slot.id} droppableId={`slot-drop-${slot.id}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-col md:flex-row items-stretch gap-3 p-3 rounded-2xl border transition-all ${
                        snapshot.isDraggingOver
                          ? 'bg-indigo-50/50 border-indigo-300 shadow-inner'
                          : 'bg-slate-50/30 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Time Label */}
                      <div className="flex items-center gap-2 md:w-44 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[slot.category] }} />
                        <span className="text-xs font-black text-slate-500">{slot.timeLabel}</span>
                      </div>

                      {/* Task Input Box */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={slot.task}
                          onChange={e => handleSlotTaskChange(slot.id, e.target.value)}
                          placeholder="Type or drop task here..."
                          className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Category Selector */}
                      <div className="md:w-36 shrink-0 flex items-center">
                        <select
                          value={slot.category}
                          onChange={e => handleSlotCategoryChange(slot.id, e.target.value as TimeBoxSlot['category'])}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="Work/Study">Work / Study</option>
                          <option value="Health/Fitness">Health / Fitness</option>
                          <option value="Rest/Sleep">Rest / Sleep</option>
                          <option value="Leisure/Social">Leisure / Social</option>
                          <option value="Unassigned">Unassigned</option>
                        </select>
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Instruction Tips */}
      <div className="bg-indigo-950 text-white p-6 rounded-2xl border border-indigo-900 flex items-start gap-4 shadow-md">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle size={20} className="text-indigo-200" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wide">The Time-Boxing Life Hack Philosophy</h4>
          <p className="text-xs text-indigo-100/90 leading-relaxed pt-1">
            "If you don't schedule your day, someone else will." Time-boxing works by creating dedicated slots of time for specific work. Instead of a long, scary to-do list, you commit to working on one specific task during a set time window.
          </p>
          <ul className="text-[11px] text-indigo-200/80 pt-1.5 space-y-1 list-disc pl-4">
            <li><strong>The brain dump:</strong> Gets everything out of your head, reducing psychological stress and anxiety.</li>
            <li><strong>Single tasking:</strong> Once inside a box (e.g. 9-10 AM), focus strictly on that task. Shut off social media notifications.</li>
            <li><strong>Respect the rest:</strong> Schedule rest and leisure blocks just like meetings. Routine balance guarantees sustainable output.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
