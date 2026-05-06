import { AppState, fmtDateFull, fmtDate, fmtTime, timeAgo } from '../store';

interface DashboardProps {
  state: AppState;
  onStateChange: (s: AppState) => void;
  onNavigate: (screen: 'notes') => void;
  onToast: (msg: string) => void;
}

function priorityBadge(priority: string) {
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

export function Dashboard({ state, onStateChange, onNavigate, onToast }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0];
  const active = state.tasks.filter(t => !t.completed).length;
  const done = state.tasks.filter(t => t.completed).length;
  const evCount = state.events.length;

  const showTasks = state.tasks.filter(t => !t.completed).slice(0, 5);
  const upcomingEvents = [...state.events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const recentNotes = [...state.notes].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).slice(0, 3);

  function toggleTask(id: string) {
    const newState = { ...state, tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) };
    onStateChange(newState);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100vh', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ padding: '56px 24px 20px', background: 'linear-gradient(180deg, var(--surface) 0%, transparent 100%)', flexShrink: 0 }}>
        <p style={{ color: 'var(--text2)', fontSize: '14px' }}>{fmtDateFull(new Date())}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text)', lineHeight: 1.1 }}>Dashboard</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 120px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[{ num: active, label: 'Active Tasks' }, { num: done, label: 'Completed' }, { num: evCount, label: 'Events' }].map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--accent2)' }}>{s.num}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Today's Tasks */}
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.2px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '12px' }}>Today's Tasks</div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '4px 16px', marginBottom: '20px' }}>
          {showTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)', fontSize: '14px' }}>No tasks yet — use Brain Dump to add some!</div>
          ) : showTasks.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0', borderBottom: '1px solid var(--border)' }}>
              <button
                onClick={() => toggleTask(t.id)}
                style={{
                  width: '22px', height: '22px', border: `2px solid ${t.completed ? 'var(--success)' : 'var(--surface3)'}`,
                  borderRadius: '6px', flexShrink: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: t.completed ? 'var(--success)' : 'transparent', transition: 'all 0.2s',
                }}
              >
                {t.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="var(--bg)" style={{ width: 12, height: 12 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', lineHeight: 1.4, textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? 'var(--text3)' : 'var(--text)' }}>{t.text}</div>
                {t.dueDate && <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{fmtDate(t.dueDate)}</div>}
              </div>
              {priorityBadge(t.priority)}
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.2px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '12px' }}>Upcoming Events</div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '4px 16px', marginBottom: '20px' }}>
          {upcomingEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)', fontSize: '14px' }}>No upcoming events</div>
          ) : upcomingEvents.map(e => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--accent2)', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: 'var(--text3)', width: '56px', flexShrink: 0 }}>{e.time ? fmtTime(e.time) : e.date || '—'}</div>
              <div style={{ fontSize: '14px' }}>{e.title}</div>
            </div>
          ))}
        </div>

        {/* Recent Notes */}
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.2px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '12px' }}>Recent Notes</div>
        {recentNotes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)', fontSize: '14px' }}>No notes yet</div>
        ) : recentNotes.map(n => (
          <div key={n.id} onClick={() => onNavigate('notes')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', cursor: 'pointer', transition: 'transform 0.15s, border-color 0.2s' }}>
            <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>{n.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.content}</div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '8px' }}>{n.updatedAt ? timeAgo(new Date(n.updatedAt).getTime()) : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
