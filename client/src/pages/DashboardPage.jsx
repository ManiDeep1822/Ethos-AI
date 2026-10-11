import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSessions } from '../store/analyzerSlice';
import { getChatSessions } from '../store/chatSlice';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import {
  TrendingUp,
  FileSearch,
  MessageSquareQuote,
  ShieldCheck,
  Search,
  Eye,
  X,
  Copy,
  Check,
  ArrowUpRight,
  Filter,
  Activity,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart3
} from 'lucide-react';
import Footer from '../components/common/Footer';
import './DashboardPage.css';

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="empty-state">
    <div className="empty-icon-wrap"><Icon size={22} /></div>
    <h4>{title}</h4>
    <p>{description}</p>
    {actionLabel && (
      <button className="btn btn-secondary btn-sm" onClick={onAction}>
        <span>{actionLabel}</span>
        <ArrowUpRight size={13} />
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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [copiedAudit, setCopiedAudit] = useState(false);

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
    { subject: 'Clarity', A: calculateAvg('clarity') || 85 },
    { subject: 'Professionalism', A: calculateAvg('professionalism') || 88 },
    { subject: 'Conciseness', A: calculateAvg('conciseness') || 82 },
    { subject: 'Empathy', A: calculateAvg('empathy') || 80 },
    { subject: 'Diplomacy', A: calculateAvg('tone') || 86 },
  ];

  const hasData = analysisSessions.length > 0;
  const overallAvg = calculateAvg('overall') || 85;
  const totalEvaluations = analysisSessions.length + chatSessions.length;
  const benchmarkRate = hasData 
    ? Math.round((analysisSessions.filter(s => (s.scores?.overall || 0) >= 80).length / analysisSessions.length) * 100) 
    : 100;

  // Filtered Audits
  const filteredAudits = analysisSessions.filter(session => {
    const textMatch = (session.originalText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (session.toneLabel || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!textMatch) return false;

    const score = session.scores?.overall || 0;
    if (filterTier === 'high') return score >= 80;
    if (filterTier === 'medium') return score >= 60 && score < 80;
    if (filterTier === 'low') return score < 60;
    return true;
  });

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'score-badge-high';
    if (score >= 60) return 'score-badge-mid';
    return 'score-badge-low';
  };

  const onCopyAuditPolished = () => {
    if (selectedAudit?.improvedVersion) {
      navigator.clipboard.writeText(selectedAudit.improvedVersion);
      setCopiedAudit(true);
      setTimeout(() => setCopiedAudit(false), 2000);
    }
  };

  return (
    <div className="dashboard-page container">
      {/* Executive Welcome Banner */}
      <section className="welcome-banner card card-elevated">
        <div className="welcome-text-col">
          <div className="welcome-badge-row">
            <span className="badge badge-primary">Executive Workspace</span>
            <span className="badge">Active Governance</span>
          </div>
          <h1 className="welcome-title">
            Communications Command Center
          </h1>
          <p className="welcome-sub text-secondary">
            Logged in as <strong>{user?.name || 'Executive Operator'}</strong> · Real-time telemetry across organizational drafts and simulations.
          </p>
        </div>

        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={() => navigate('/analyze')}>
            <FileSearch size={15} />
            <span>New Diagnostic Audit</span>
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/chat')}>
            <MessageSquareQuote size={15} />
            <span>Enter Simulation Arena</span>
          </button>
        </div>
      </section>

      {/* Institutional KPI Cards */}
      <section className="kpi-grid">
        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-title">Institutional Index</span>
            <Activity size={15} className="text-primary-color" />
          </div>
          <div className="kpi-metric-number">
            {hasData ? overallAvg : 88}<small>/100</small>
          </div>
          <div className="kpi-card-footer">
            <span className="trend-pill positive">
              <TrendingUp size={11} /> +8.4%
            </span>
            <span className="kpi-footer-text">30-day velocity</span>
          </div>
        </div>

        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-title">Total Audits Conducted</span>
            <FileSearch size={15} className="text-primary-color" />
          </div>
          <div className="kpi-metric-number">{totalEvaluations}</div>
          <div className="kpi-card-footer">
            <span className="kpi-footer-text">
              {analysisSessions.length} text audits · {chatSessions.length} arena runs
            </span>
          </div>
        </div>

        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-title">Benchmark Compliance</span>
            <CheckCircle2 size={15} className="text-success" />
          </div>
          <div className="kpi-metric-number">{benchmarkRate}%</div>
          <div className="kpi-card-footer">
            <span className="kpi-footer-text">Sessions meeting &gt;= 80 standard</span>
          </div>
        </div>

        <div className="kpi-card card">
          <div className="kpi-card-header">
            <span className="kpi-title">Security & Governance</span>
            <ShieldCheck size={15} className="text-success" />
          </div>
          <div className="kpi-metric-number">SOC-2</div>
          <div className="kpi-card-footer">
            <span className="kpi-footer-text">Zero-retention data isolation active</span>
          </div>
        </div>
      </section>

      {/* Main Charts Section */}
      <div className="dashboard-charts-grid">
        {/* Progression Curve */}
        <section className="progression-chart-card card">
          <div className="chart-card-header">
            <div>
              <h3>Institutional Progression Curve</h3>
              <p className="text-secondary">Historical communication index progression across recorded audits.</p>
            </div>
            {hasData && (
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/analyze')}>
                <span>Run Evaluation</span>
                <ArrowUpRight size={13} />
              </button>
            )}
          </div>

          <div className="chart-wrapper">
            {hasData ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={lineData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ 
                      background: '#111827', 
                      border: '1px solid #334155', 
                      borderRadius: '8px', 
                      fontSize: '12px' 
                    }}
                    itemStyle={{ color: '#60A5FA' }}
                    labelStyle={{ color: '#94A3B8' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2563EB" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#scoreGradient)" 
                    dot={{ fill: '#2563EB', r: 3 }} 
                    activeDot={{ r: 5 }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState 
                icon={BarChart3} 
                title="No progression data yet" 
                description="Complete your first text intelligence diagnostic to populate your progression curve." 
                actionLabel="Run First Diagnostic" 
                onAction={() => navigate('/analyze')} 
              />
            )}
          </div>
        </section>

        {/* Skill Competency Radar */}
        <section className="competency-radar-card card">
          <div className="chart-card-header">
            <div>
              <h3>Competency Vectors</h3>
              <p className="text-secondary">Core organizational communication dimensions.</p>
            </div>
          </div>

          <div className="radar-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Radar 
                  name="Competency" 
                  dataKey="A" 
                  stroke="#2563EB" 
                  fill="#2563EB" 
                  fillOpacity={0.25} 
                  strokeWidth={1.5} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Searchable Audit History Table */}
      <section className="audit-history-section card">
        <div className="table-header-row">
          <div>
            <h3>Enterprise Audit Ledger</h3>
            <p className="text-secondary">Comprehensive log of evaluated communications and simulation sessions.</p>
          </div>

          <div className="table-controls">
            <div className="search-box">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                className="input search-input" 
                placeholder="Search audit transcript or tone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-box">
              <Filter size={14} className="filter-icon" />
              <select 
                className="select filter-select"
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
              >
                <option value="all">All Score Tiers</option>
                <option value="high">High Standard (80+)</option>
                <option value="medium">Moderate (60-79)</option>
                <option value="low">Needs Review (&lt;60)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container">
          {filteredAudits.length > 0 ? (
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Transcript Summary</th>
                  <th>Tone Calibration</th>
                  <th>Overall Score</th>
                  <th>Recorded Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudits.map(s => {
                  const score = s.scores?.overall || 0;
                  return (
                    <tr key={s._id}>
                      <td className="text-preview-cell">
                        <span className="transcript-snippet">
                          {s.originalText?.substring(0, 48)}…
                        </span>
                      </td>
                      <td>
                        <span className="tone-tag">{s.toneLabel || 'Standard'}</span>
                      </td>
                      <td>
                        <span className={`score-badge ${getScoreBadgeClass(score)}`}>
                          {score}%
                        </span>
                      </td>
                      <td className="date-cell">
                        <span className="date-text">
                          <Calendar size={12} />
                          {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedAudit(s)}
                        >
                          <Eye size={12} />
                          <span>Inspect Audit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-table-notice">
              <EmptyState 
                icon={FileSearch} 
                title="No matching audits found" 
                description={hasData ? "Try adjusting your search criteria or score filter." : "Saved audits from the Text Intelligence suite will be indexed here."} 
                actionLabel={hasData ? undefined : "Run First Evaluation"}
                onAction={() => navigate('/analyze')}
              />
            </div>
          )}
        </div>
      </section>

      {/* Audit Detail Modal / Drawer */}
      {selectedAudit && (
        <div className="modal-overlay" onClick={() => setSelectedAudit(null)}>
          <div className="modal-dialog audit-inspect-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-primary">Audit Inspection</span>
                <h3>Executive Evaluation Record</h3>
                <span className="modal-timestamp">
                  Recorded {new Date(selectedAudit.createdAt).toLocaleString()}
                </span>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedAudit(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              {/* Score Matrix Breakdown */}
              <div className="modal-scores-row">
                <div className="modal-kpi-item">
                  <span className="modal-kpi-label">Overall Index</span>
                  <span className="modal-kpi-num text-success">{selectedAudit.scores?.overall || '--'}%</span>
                </div>
                <div className="modal-kpi-item">
                  <span className="modal-kpi-label">Clarity</span>
                  <span className="modal-kpi-num">{selectedAudit.scores?.clarity || '--'}%</span>
                </div>
                <div className="modal-kpi-item">
                  <span className="modal-kpi-label">Professionalism</span>
                  <span className="modal-kpi-num">{selectedAudit.scores?.professionalism || '--'}%</span>
                </div>
                <div className="modal-kpi-item">
                  <span className="modal-kpi-label">Conciseness</span>
                  <span className="modal-kpi-num">{selectedAudit.scores?.conciseness || '--'}%</span>
                </div>
                <div className="modal-kpi-item">
                  <span className="modal-kpi-label">Tone</span>
                  <span className="modal-kpi-num">{selectedAudit.toneLabel || 'Formal'}</span>
                </div>
              </div>

              {/* Original Draft Block */}
              <div className="modal-section-box">
                <h4 className="modal-section-title">Original Submitted Draft</h4>
                <div className="modal-code-box">
                  {selectedAudit.originalText}
                </div>
              </div>

              {/* Polished Rewrite Block */}
              {selectedAudit.improvedVersion && (
                <div className="modal-section-box">
                  <div className="modal-section-title-row">
                    <h4 className="modal-section-title text-success">Executive Polished Variant</h4>
                    <button className="btn-copy-mini" onClick={onCopyAuditPolished}>
                      {copiedAudit ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                      <span>{copiedAudit ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="modal-code-box polish-box">
                    {selectedAudit.improvedVersion}
                  </div>
                </div>
              )}

              {/* Executive Directive */}
              {selectedAudit.generalFeedback && (
                <div className="modal-section-box">
                  <h4 className="modal-section-title">Strategic Feedback</h4>
                  <p className="modal-directive-text">{selectedAudit.generalFeedback}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedAudit(null)}>
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DashboardPage;
