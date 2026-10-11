import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { analyzeText, saveSession } from '../store/analyzerSlice';
import { 
  ArrowLeft, 
  Save, 
  Copy, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Download, 
  Sparkles,
  FileText,
  Sliders,
  Columns,
  Check,
  Zap,
  Target
} from 'lucide-react';
import Footer from '../components/common/Footer';
import './AnalyzerPage.css';

const SAMPLE_DRAFTS = {
  executive: "You need to approve our budget request immediately because engineering will block the next release cycle if we don't get the servers.",
  client: "We cannot fix your issue right now because your team didn't provide the logs we asked for three days ago.",
  internal: "I don't understand why product changed the specifications again without notifying anyone on the dev channel.",
  policy: "All employees must stop submitting expense reports late or finance will reject all reimbursements unconditionally."
};

const CONTEXT_OPTIONS = [
  { id: 'executive', label: 'Executive Board & Leadership' },
  { id: 'client', label: 'Critical Client Escalation' },
  { id: 'internal', label: 'Cross-Functional Alignment' },
  { id: 'policy', label: 'Enterprise Policy & Memo' }
];

const AnalyzerPage = () => {
  const [text, setText] = useState('');
  const [docTitle, setDocTitle] = useState('Executive Strategic Memo');
  const [context, setContext] = useState('executive');
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'diff'
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appliedFixId, setAppliedFixId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const { currentAnalysis, isLoading } = useSelector((state) => state.analyzer);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  useEffect(() => {
    if (text.trim().length < 20) return;
    const timer = setTimeout(() => {
      dispatch(analyzeText(text));
    }, 1200);
    return () => clearTimeout(timer);
  }, [text, dispatch]);

  const onSave = () => {
    if (currentAnalysis) {
      dispatch(saveSession({
        originalText: text,
        scores: {
          overall: currentAnalysis.overall || 50,
          clarity: currentAnalysis.clarity || 50,
          professionalism: currentAnalysis.professionalism || 50,
          conciseness: currentAnalysis.conciseness || 50,
          empathy: currentAnalysis.empathy || 50,
          tone: currentAnalysis.tone || 50
        },
        toneLabel: currentAnalysis.toneLabel || 'Formal',
        highlights: currentAnalysis.highlights || [],
        improvedVersion: currentAnalysis.improvedVersion || text,
        generalFeedback: currentAnalysis.generalFeedback || 'Session verified.'
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const onClear = () => {
    setText('');
    textareaRef.current?.focus();
  };

  const onLoadSample = (type) => {
    const sample = SAMPLE_DRAFTS[type] || SAMPLE_DRAFTS.executive;
    setText(sample);
  };

  const onApplyFix = (originalSnippet, replacementText, index) => {
    if (!originalSnippet || !replacementText) return;
    if (text.includes(originalSnippet)) {
      const updated = text.replace(originalSnippet, replacementText);
      setText(updated);
      setAppliedFixId(index);
      setTimeout(() => setAppliedFixId(null), 2000);
    }
  };

  const onCopyPolished = () => {
    if (currentAnalysis?.improvedVersion) {
      navigator.clipboard.writeText(currentAnalysis.improvedVersion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onDownloadAudit = () => {
    if (!currentAnalysis) return;
    const content = `ETHOS ENTERPRISE COMMUNICATION AUDIT REPORT
Document: ${docTitle}
Context: ${CONTEXT_OPTIONS.find(c => c.id === context)?.label}
Date: ${new Date().toISOString()}

--- SCORE MATRIX ---
Overall Index: ${currentAnalysis.overall || 0}/100
Tone Calibration: ${currentAnalysis.toneLabel || 'N/A'}
Clarity: ${currentAnalysis.clarity || 0}%
Professionalism: ${currentAnalysis.professionalism || 0}%
Conciseness: ${currentAnalysis.conciseness || 0}%
Empathy: ${currentAnalysis.empathy || 0}%
Tone: ${currentAnalysis.tone || 0}%

--- ORIGINAL DRAFT ---
${text}

--- POLISHED EXECUTIVE REWRITE ---
${currentAnalysis.improvedVersion || ''}

--- STRATEGIC DIRECTIVE ---
${currentAnalysis.generalFeedback || ''}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${docTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (val) => {
    if (val >= 80) return 'var(--status-success)';
    if (val >= 60) return 'var(--status-warning)';
    return 'var(--status-danger)';
  };

  return (
    <div className="analyzer-page container">
      {/* Back button */}
      <div className="page-nav-row">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={15} />
          <span>Return to Executive Dashboard</span>
        </button>
      </div>

      {/* Page Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-badge-row">
            <span className="badge badge-primary">Diagnostic Suite</span>
            <span className="badge">Real-Time Evaluation</span>
          </div>
          <h1>Text Intelligence & Governance</h1>
          <p className="text-secondary">
            Draft, audit, and calibrate executive communications against institutional standards.
          </p>
        </div>
      </header>

      {/* Control Bar */}
      <div className="diagnostic-control-bar card">
        <div className="control-group">
          <label className="control-label">Document Subject</label>
          <input 
            type="text" 
            className="input doc-title-input" 
            value={docTitle} 
            onChange={(e) => setDocTitle(e.target.value)} 
            placeholder="e.g. Q4 Strategy Memo"
          />
        </div>

        <div className="control-group">
          <label className="control-label">Target Audience & Context</label>
          <select 
            className="select" 
            value={context} 
            onChange={(e) => {
              setContext(e.target.value);
              onLoadSample(e.target.value);
            }}
          >
            {CONTEXT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="control-group view-switcher-group">
          <label className="control-label">Inspection View</label>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'editor' ? 'active' : ''}`}
              onClick={() => setViewMode('editor')}
            >
              <FileText size={13} />
              <span>Editor</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'diff' ? 'active' : ''}`}
              onClick={() => setViewMode('diff')}
            >
              <Columns size={13} />
              <span>Diff View</span>
            </button>
          </div>
        </div>

        <div className="control-group actions-group">
          <button className="btn btn-outline btn-sm" onClick={() => onLoadSample(context)}>
            Load Sample
          </button>
          {text.length > 0 && (
            <button className="btn btn-outline btn-sm" onClick={onClear}>
              <RotateCcw size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="analyzer-grid">
        {/* Left Column: Editor or Diff View */}
        <main className="editor-section">
          {viewMode === 'editor' ? (
            <div className="editor-card card">
              {/* Editor Top Bar */}
              <div className="editor-topbar">
                <div className="editor-file-info">
                  <FileText size={14} className="text-secondary" />
                  <span className="editor-doc-name">{docTitle || 'Untitled Draft'}</span>
                </div>
                <div className="editor-metrics-tags">
                  <span className="metric-tag">{wordCount} words</span>
                  <span className="metric-tag">{text.length} chars</span>
                  <span className="metric-tag">{readingTime} min read</span>
                </div>
              </div>

              {/* Textarea */}
              <div className="editor-body">
                <textarea
                  ref={textareaRef}
                  className="enterprise-textarea"
                  placeholder="Paste or compose your sensitive correspondence here... Instant diagnostic evaluation will run in the background."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              {/* Status & Save Action Bar */}
              <div className="editor-bottombar">
                <div className="editor-status-indicator">
                  {isLoading ? (
                    <span className="status-badge-analyzing">
                      <span className="status-pulse-dot" />
                      Evaluating Syntax & Tone...
                    </span>
                  ) : currentAnalysis ? (
                    <span className="status-badge-ready">
                      <CheckCircle2 size={13} />
                      Diagnostic Complete
                    </span>
                  ) : (
                    <span className="status-badge-idle">
                      {text.length < 20 ? 'Enter at least 20 characters to initiate audit' : 'Ready for evaluation'}
                    </span>
                  )}
                </div>

                <div className="editor-actions-row">
                  <button
                    className="btn btn-primary"
                    onClick={onSave}
                    disabled={!currentAnalysis || isLoading}
                  >
                    {saved ? <><Check size={14} /> Audit Saved</> : <><Save size={14} /> Save to Audit Log</>}
                  </button>
                </div>
              </div>

              {/* Observations Panel */}
              {currentAnalysis?.highlights && currentAnalysis.highlights.length > 0 && (
                <div className="observations-container">
                  <div className="observations-header">
                    <h4>Identified Observations & Remediation Opportunities</h4>
                    <span className="observations-count">{currentAnalysis.highlights.length} items flagged</span>
                  </div>

                  <div className="observation-list">
                    {currentAnalysis.highlights.map((h, i) => (
                      <div key={i} className="obs-card">
                        <div className="obs-meta-row">
                          <span className="obs-type-badge">
                            <AlertTriangle size={12} />
                            <span>Risk Flag #{i + 1}</span>
                          </span>
                          <span className="obs-issue-label">{h.issue}</span>
                        </div>

                        <div className="obs-body">
                          <div className="obs-original-snippet">
                            <span className="snippet-label">Flagged Phrasing:</span>
                            <p className="snippet-text">"{h.text}"</p>
                          </div>

                          <div className="obs-remediation-snippet">
                            <span className="snippet-label">Remediation:</span>
                            <p className="remediation-text">{h.suggestion}</p>
                          </div>
                        </div>

                        <div className="obs-action-footer">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onApplyFix(h.text, h.suggestion, i)}
                            disabled={!text.includes(h.text)}
                          >
                            {appliedFixId === i ? (
                              <><Check size={13} /> Applied</>
                            ) : (
                              <><CheckCircle2 size={13} /> Apply Suggested Replacement</>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Diff Comparison View */
            <div className="diff-view-card card">
              <div className="diff-view-header">
                <div>
                  <h3>Side-by-Side Comparison</h3>
                  <p className="text-secondary">Compare original draft directly against the polished executive rewrite.</p>
                </div>
                <div className="diff-view-actions">
                  <button className="btn btn-secondary btn-sm" onClick={onCopyPolished}>
                    {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy Rewrite</>}
                  </button>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => {
                      if (currentAnalysis?.improvedVersion) {
                        setText(currentAnalysis.improvedVersion);
                        setViewMode('editor');
                      }
                    }}
                    disabled={!currentAnalysis?.improvedVersion}
                  >
                    Apply to Workspace
                  </button>
                </div>
              </div>

              <div className="diff-columns">
                <div className="diff-col original-col">
                  <div className="diff-col-bar">
                    <span className="diff-col-title">Original Composition</span>
                    <span className="diff-col-meta">{text.length} chars</span>
                  </div>
                  <div className="diff-content">
                    {text || <span className="diff-empty">No content in workspace.</span>}
                  </div>
                </div>

                <div className="diff-col polished-col">
                  <div className="diff-col-bar">
                    <span className="diff-col-title text-success">Executive Polish</span>
                    <span className="diff-col-meta">
                      {currentAnalysis?.improvedVersion ? `${currentAnalysis.improvedVersion.length} chars` : '--'}
                    </span>
                  </div>
                  <div className="diff-content">
                    {currentAnalysis?.improvedVersion || (
                      <span className="diff-empty">Evaluation pending or text insufficient.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Rail: Score Matrix & Directives */}
        <aside className="vitals-section">
          {/* Main Score Index Card */}
          <div className="score-matrix-card card">
            <div className="matrix-title-row">
              <h3>Score Matrix</h3>
              <span className="matrix-status-label">Audited</span>
            </div>

            <div className="matrix-index-hero">
              <div 
                className="matrix-index-number"
                style={{ color: getScoreColor(currentAnalysis?.overall || 0) }}
              >
                {currentAnalysis?.overall || '--'}
              </div>
              <div className="matrix-index-sub">Overall Communication Index</div>

              {currentAnalysis?.toneLabel && (
                <div className="tone-pill">
                  <span className="tone-pill-label">Detected Tone</span>
                  <span className="tone-pill-value">{currentAnalysis.toneLabel}</span>
                </div>
              )}
            </div>

            {/* Score Breakdown Rows */}
            <div className="matrix-breakdown-list">
              {[
                { label: 'Clarity Index', val: currentAnalysis?.clarity || 0, desc: 'Unambiguous structure' },
                { label: 'Professionalism', val: currentAnalysis?.professionalism || 0, desc: 'Corporate decorum' },
                { label: 'Conciseness', val: currentAnalysis?.conciseness || 0, desc: 'Signal-to-noise ratio' },
                { label: 'Empathy Calibration', val: currentAnalysis?.empathy || 0, desc: 'Perspective alignment' },
                { label: 'Diplomatic Tone', val: currentAnalysis?.tone || 0, desc: 'De-escalation stability' }
              ].map(item => (
                <div key={item.label} className="matrix-metric-item">
                  <div className="metric-info-row">
                    <span className="metric-name">{item.label}</span>
                    <span className="metric-val" style={{ color: getScoreColor(item.val) }}>
                      {item.val}%
                    </span>
                  </div>
                  <div className="metric-bar-bg">
                    <div 
                      className="metric-bar-fill"
                      style={{ 
                        width: `${item.val}%`, 
                        backgroundColor: getScoreColor(item.val) 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Polished Rewrite Quick Card */}
          {currentAnalysis?.improvedVersion && (
            <div className="polished-quick-card card">
              <div className="quick-card-header">
                <div className="quick-card-title">
                  <Zap size={14} className="text-primary-color" />
                  <span>Polished Rewrite</span>
                </div>
                <button className="btn-copy-mini" onClick={onCopyPolished} title="Copy to clipboard">
                  {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                </button>
              </div>
              <p className="polished-preview-text">{currentAnalysis.improvedVersion}</p>
            </div>
          )}

          {/* Strategic Directive */}
          <div className="directive-card card">
            <div className="directive-header">
              <Target size={14} className="text-primary-color" />
              <span>Strategic Executive Directive</span>
            </div>
            <p className="directive-text">
              {currentAnalysis?.generalFeedback || 'Compose or paste draft text to generate institutional recommendations.'}
            </p>
          </div>

          {/* Export Actions */}
          <div className="export-actions-card card">
            <button 
              className="btn btn-outline full-width"
              onClick={onDownloadAudit}
              disabled={!currentAnalysis}
            >
              <Download size={14} />
              <span>Export Audit Summary</span>
            </button>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default AnalyzerPage;
