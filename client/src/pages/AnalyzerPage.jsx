import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { analyzeText, saveSession } from '../store/analyzerSlice';
import { Sparkles, Save, AlertCircle, ChevronRight, Copy, ArrowLeft, Zap, FileText, RotateCcw, CheckCircle } from 'lucide-react';
import Footer from '../components/common/Footer';
import './AnalyzerPage.css';

const AnalyzerPage = () => {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const { currentAnalysis, isLoading } = useSelector((state) => state.analyzer);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

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
        scores: currentAnalysis.scores,
        toneLabel: currentAnalysis.toneLabel,
        highlights: currentAnalysis.highlights,
        improvedVersion: currentAnalysis.improvedVersion,
        generalFeedback: currentAnalysis.generalFeedback
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const onClear = () => {
    setText('');
  };

  const getScoreColor = (val) => {
    if (val >= 80) return '#00C9A7';
    if (val >= 60) return '#F59E0B';
    return '#FF6B6B';
  };

  return (
    <div className="analyzer-page container">
      <button className="btn-back" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <header className="page-header">
        <div className="header-content">
          <span className="badge">AI Diagnostic</span>
          <h1>Text Intelligence</h1>
          <p className="text-secondary">Paste or type your professional text. AI analysis fires automatically.</p>
        </div>
      </header>

      <div className="analyzer-grid">
        {/* Left Column: Editor */}
        <main className="editor-section">
          <div className="editor-card card">
            {/* Editor Top Bar */}
            <div className="editor-topbar">
              <div className="editor-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="editor-filename">
                <FileText size={13} />
                <span>workspace.txt</span>
              </div>
              <div className="editor-actions">
                <span className="editor-meta">{wordCount} words · {text.length} chars</span>
                {text.length > 0 && (
                  <button className="editor-clear-btn" onClick={onClear} title="Clear">
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Textarea Zone */}
            <div className="editor-body">
              <textarea
                ref={textareaRef}
                className="saas-textarea"
                placeholder="Start typing your professional text here...&#10;&#10;AI analysis will begin automatically after 1.2 seconds of inactivity."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {/* Editor Bottom Bar */}
            <div className="editor-bottombar">
              <div className="editor-status">
                {isLoading ? (
                  <span className="status-analyzing">
                    <span className="pulse-dot" />
                    Analyzing...
                  </span>
                ) : currentAnalysis ? (
                  <span className="status-done">
                    <CheckCircle size={13} />
                    Analysis complete
                  </span>
                ) : (
                  <span className="status-idle">
                    {text.length < 20 ? 'Type at least 20 characters to begin' : 'Ready to analyze'}
                  </span>
                )}
              </div>
              <button
                className="btn btn-primary editor-save-btn"
                onClick={onSave}
                disabled={!currentAnalysis || isLoading}
              >
                {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Audit</>}
              </button>
            </div>

            {/* Observations */}
            {currentAnalysis?.highlights && (
              <div className="feedback-layer">
                <h3>Observations</h3>
                <div className="observation-list">
                  {currentAnalysis.highlights.map((h, i) => (
                    <div key={i} className="obs-item">
                      <div className="obs-marker">
                        <AlertCircle size={14} className="text-error" />
                        <span>Issue</span>
                      </div>
                      <p className="obs-content">"{h.text}"</p>
                      <div className="obs-action">
                        <ChevronRight size={14} className="text-primary" />
                        <span>{h.suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Column: Vitals */}
        <aside className="vitals-section">
          <div className="vitals-card card">
            <h3>Score Matrix</h3>
            <div className="matrix-hero">
              <div
                className="matrix-value"
                style={{ color: getScoreColor(currentAnalysis?.overall || 0) }}
              >
                {currentAnalysis?.overall || '--'}
              </div>
              <div className="matrix-label">Overall Index</div>

              {currentAnalysis?.toneLabel && (
                <div className="tone-badge">{currentAnalysis.toneLabel}</div>
              )}
            </div>

            <div className="matrix-rows">
              {[
                { label: 'Clarity', val: currentAnalysis?.clarity || 0 },
                { label: 'Professionalism', val: currentAnalysis?.professionalism || 0 },
                { label: 'Conciseness', val: currentAnalysis?.conciseness || 0 },
                { label: 'Tone', val: currentAnalysis?.tone || 0 },
              ].map(row => (
                <div key={row.label} className="matrix-row">
                  <div className="row-info">
                    <span>{row.label}</span>
                    <span style={{ color: getScoreColor(row.val) }}>{row.val}%</span>
                  </div>
                  <div className="row-bar">
                    <div
                      className="row-fill"
                      style={{ width: `${row.val}%`, background: getScoreColor(row.val) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currentAnalysis?.improvedVersion && (
            <div className="refined-card card">
              <div className="refined-header">
                <Zap size={16} className="text-primary" />
                <span>Refined Logic</span>
              </div>
              <p>{currentAnalysis.improvedVersion}</p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigator.clipboard.writeText(currentAnalysis.improvedVersion)}
              >
                <Copy size={14} /> Copy
              </button>
            </div>
          )}

          <div className="coach-brief card">
            <div className="brief-header">
              <Sparkles size={16} className="text-primary" />
              <span>Coach Directive</span>
            </div>
            <p className="text-secondary">{currentAnalysis?.generalFeedback || 'Awaiting input data...'}</p>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default AnalyzerPage;
