import { useState } from 'react';
import { AppState, Task, genId, fmtDate } from '../store';
import { Modal } from '../components/Modal';

type Filter = 'All' | 'High' | 'Medium' | 'Low' | 'Done';

interface TasksProps {
  state: AppState;
  onStateChange: (s: AppState) => void;
  onToast: (msg: string) => void;
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    High: { bg: 'rgba(248,113,113,0.2)', color: 'var(--danger)' },
    Medium: { bg: 'rgba(251,191,36,0.2)', color: 'var(--warn)' },
    Low: { bg: 'rgba(74,222,128,0.2)', color: 'var(--success)' },
  };
  const s = map[priority] || map.Medium;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', background: s.bg, color: s.color }}>
      {priority}
    </span>
  );
}

export function Tasks({ state, onStateChange, onToast }: TasksProps) {
  const [filter, setFilter] = useState<Filter>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [form, setForm] = useState({ text: '', priority: 'Medium', dueDate: '', notes: '' });

  const filters: Filter[] = ['All', 'High', 'Medium', 'Low', 'Done'];

  let tasks = state.tasks;
  if (filter === 'Done') tasks = tasks.filter(t => t.completed);
  else if (filter === 'All') tasks = tasks.filter(t => !t.completed);
  else tasks = tasks.filter(t => t.priority === filter && !t.completed);

  function openAdd() {
    setEditId('');
    setForm({ text: '', priority: 'Medium', dueDate: '', notes: '' });
    setModalOpen(true);
  }

  function openEdit(t: Task) {
    setEditId(t.id);
    setForm({ text: t.text, priority: t.priority, dueDate: t.dueDate, notes: t.notes });
    setModalOpen(true);
  }

  function saveTask() {
    if (!form.text.trim()) { onToast('Enter a task description'); return; }
    const now = new Date().toISOString();
    let newTasks;
    if (editId) {
      newTasks = state.tasks.map(t => t.id === editId ? { ...t, ...form, priority: form.priority as Task['priority'] } : t);
      onToast('Task updated');
    } else {
      newTasks = [...state.tasks, { id: genId(), ...form, priority: form.priority as Task['priority'], completed: false, createdAt: now }];
      onToast('Task added!');
    }
    onStateChange({ ...state, tasks: newTasks });
    setModalOpen(false);
  }

  function toggleTask(id: string) {
    onStateChange({ ...state, tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) });
  }

  function deleteTask(id: string) {
    onStateChange({ ...state, tasks: state.tasks.filter(t => t.id !== id) });
    onToast('Task deleted');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100vh', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ padding: '56px 24px 20px', background: 'linear-gradient(180deg, var(--surface) 0%, transparent 100%)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text)', lineHeight: 1.1 }}>Tasks</h1>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '4px' }}>{state.tasks.filter(t => !t.completed).length} active</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 120px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: '100px',
                border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                background: filter === f ? 'var(--accent)' : 'var(--surface2)',
                color: filter === f ? '#fff' : 'var(--text2)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
                fontFamily: 'var(--font-body)',
              }}
            >{f}</button>
          ))}
        </div>

        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)', fontSize: '14px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
            <p>No tasks here.<br />Tap + to add one.</p>
          </div>
        ) : tasks.map(t => (
          <div key={t.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <button
                onClick={() => toggleTask(t.id)}
                style={{
                  width: '22px', height: '22px', marginTop: '2px',
                  border: `2px solid ${t.completed ? 'var(--success)' : 'var(--surface3)'}`,
                  borderRadius: '6px', flexShrink: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: t.completed ? 'var(--success)' : 'transparent',
                }}
              >
                {t.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="var(--bg)" style={{ width: 12, height: 12 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', marginBottom: '6px', textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? 'var(--text3)' : 'var(--text)' }}>{t.text}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <PriorityBadge priority={t.priority} />
                  {t.dueDate && <span style={{ fontSize: '12px', color: 'var(--text3)' }}>📅 {fmtDate(t.dueDate)}</span>}
                </div>
                {t.notes && <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '8px' }}>{t.notes}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button onClick={() => openEdit(t)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text2)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>✏️</button>
                <button onClick={() => deleteTask(t.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.15)', color: 'var(--danger)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={openAdd}
        style={{
          position: 'fixed', bottom: '88px', right: 'max(calc(50% - 210px + 20px), 20px)',
          width: '52px', height: '52px',
          background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
          borderRadius: '16px', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          boxShadow: '0 8px 24px var(--accent-glow)', zIndex: 50, transition: 'all 0.2s',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: 24, height: 24 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Task' : 'New Task'}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text2)', marginBottom: '8px' }}>Task</label>
          <textarea
            value={form.text}
            onChange={e => setForm({ ...form, text: e.target.value })}
            placeholder="What needs to be done?"
            style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '15px', padding: '14px 16px', outline: 'none', resize: 'none', minHeight: '80px', lineHeight: 1.6 }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text2)', marginBottom: '8px' }}>Priority</label>
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '15px', padding: '14px 16px', outline: 'none', appearance: 'none' }}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text2)', marginBottom: '8px' }}>Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '15px', padding: '14px 16px', outline: 'none', colorScheme: 'dark' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text2)', marginBottom: '8px' }}>Notes</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '15px', padding: '14px 16px', outline: 'none', resize: 'none', minHeight: '80px', lineHeight: 1.6 }} />
        </div>
        <button onClick={saveTask} style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px var(--accent-glow)' }}>
          {editId ? 'Update Task' : 'Add Task'}
        </button>
      </Modal>
    </div>
  );
}
