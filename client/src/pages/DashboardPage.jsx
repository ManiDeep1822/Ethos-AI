import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSessions } from '../store/analyzerSlice';
import { getChatSessions } from '../store/chatSlice';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import {
  Award, Target, MessageSquare, Activity, TrendingUp,
  Zap, PenTool, ArrowRight, ScanText, BookOpen, ArrowUpRight
} from 'lucide-react';
import Footer from '../components/common/Footer';
import './DashboardPage.css';

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="empty-state">
    <div className="empty-icon"><Icon size={24} /></div>
    <h4>{title}</h4>
    <p>{description}</p>
    {actionLabel && (
      <button className="empty-cta" onClick={onAction}>
        {actionLabel} <ArrowRight size={13} />
      </button>
    )}
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessions: analysisSessions = [] } = useSelector((state) => state.analyzer);
  const { sessions: chatSessions = [] } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSessions());
    dispatch(getChatSessions());
  }, [dispatch]);

  const calculateAvg = (key) => {
    if (!analysisSessions.length) return 0;
    const sum = analysisSessions.reduce((acc, s) => acc + (s.scores?.[key] || 0), 0);
    return Math.round(sum / analysisSessions.length);
  };

  const lineData = analysisSessions.slice(0, 15).reverse().map(s => ({
    name: s.createdAt ? new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '---',
    score: s.scores?.overall || 0
  }));

  const radarData = [
    { subject: 'Clarity', A: calculateAvg('clarity') },
    { subject: 'Pro', A: calculateAvg('professionalism') },
    { subject: 'Concise', A: calculateAvg('conciseness') },
    { subject: 'Empathy', A: calculateAvg('empathy') },
    { subject: 'Tone', A: calculateAvg('tone') },
  ];

  const hasData = analysisSessions.length > 0;
  const xp = analysisSessions.length * 120 + chatSessions.length * 80;

  return (
    <div className="dashboard-page container">

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <p className="welcome-label">Welcome back</p>
          <h1 className="welcome-name">{user?.name || 'Communicator'} 👋</h1>
          <p className="welcome-sub text-secondary">
            {hasData
              ? `You've completed ${analysisSessions.length} analysis session${analysisSessions.length > 1 ? 's' : ''}. Keep going.`
              : 'Start your first training session to unlock your analytics.'}
          </p>
        </div>
        <div className="quick-actions">
          <button className="quick-btn primary" onClick={() => navigate('/analyze')}>
            <ScanText size={15} /> Run Analysis
          </button>
          <button className="quick-btn secondary" onClick={() => navigate('/chat')}>
            <BookOpen size={15} /> Start Training
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <section className="stat-summary-row">
        <div className="stat-card card">
          <div className="stat-header">
            <Target size={14} />
            <span>Mastery Score</span>
          </div>
          <div className="stat-value">{hasData ? `${calculateAvg('overall')}` : '--'}</div>
          <div className="stat-footer">
            <span className="stat-label">out of 100</span>
            {hasData && <span className="stat-trend positive"><TrendingUp size={12} /> Improving</span>}
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-header">
            <MessageSquare size={14} />
            <span>Total Sessions</span>
          </div>
          <div className="stat-value">{chatSessions.length + analysisSessions.length}</div>
          <div className="stat-footer">
            <span className="stat-label">{analysisSessions.length} analysis · {chatSessions.length} chats</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-header">
            <Award size={14} />
            <span>Current Rank</span>
          </div>
          <div className="stat-value rank-value">{hasData ? 'Elite' : 'Rookie'}</div>
          <div className="stat-footer">
            <span className="stat-label">{hasData ? 'Top 5% of users' : 'Begin training to rank up'}</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-header">
            <Activity size={14} />
            <span>XP Earned</span>
          </div>
          <div className="stat-value">{xp.toLocaleString()}</div>
          <div className="stat-footer">
            <span className="stat-label">lifetime points</span>
          </div>
        </div>
      </section>

      {/* Progression Chart */}
      <section className="main-chart-section card">
        <div className="chart-header">
          <div>
            <h3>Progression Pulse</h3>
            <p className="text-secondary">Your overall communication score over time.</p>
          </div>
          {hasData && (
            <button className="chart-action-btn" onClick={() => navigate('/analyze')}>
              New Analysis <ArrowUpRight size={13} />
            </button>
          )}
        </div>
        <div className="chart-container">
          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#00C9A7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '13px' }}
                  itemStyle={{ color: '#00C9A7' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Area type="monotone" dataKey="score" stroke="#00C9A7" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" dot={{ fill: '#00C9A7', r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={Zap} title="No data yet" description="Complete a text analysis and save it to start tracking your score." actionLabel="Run First Analysis" onAction={() => navigate('/analyze')} />
          )}
        </div>
      </section>

      {/* Skill DNA + Audit */}
      <div className="bottom-grid">
        <section className="radar-section card">
          <div className="chart-header">
            <div>
              <h3>Skill DNA</h3>
              <p className="text-secondary">Your communication dimensions.</p>
            </div>
          </div>
          <div className="radar-box">
            {hasData ? (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <Radar name="Skills" dataKey="A" stroke="#00C9A7" fill="#00C9A7" fillOpacity={0.3} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={Target} title="Skill Map Empty" description="Your radar chart appears after your first saved analysis." actionLabel="Analyze Text" onAction={() => navigate('/analyze')} />
            )}
          </div>
        </section>

        <section className="history-section card">
          <div className="chart-header">
            <div>
              <h3>Recent Audit</h3>
              <p className="text-secondary">Last saved analysis sessions.</p>
            </div>
          </div>
          <div className="table-box">
            {hasData ? (
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Text Preview</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisSessions.slice(0, 5).map(s => (
                    <tr key={s._id}>
                      <td className="text-truncate">{s.originalText?.substring(0, 28)}…</td>
                      <td><span className="status-badge">{s.scores?.overall}%</span></td>
                      <td className="date-cell">{new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState icon={PenTool} title="No Audits Yet" description="Saved analyses will appear here." actionLabel="Start Analyzing" onAction={() => navigate('/analyze')} />
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
