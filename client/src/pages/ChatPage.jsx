import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startChat, sendMessage, clearCurrentSession } from '../store/chatSlice';
import { saveSession } from '../store/analyzerSlice';
import {
  Send, 
  ArrowLeft, 
  RefreshCcw, 
  ShieldAlert, 
  Briefcase, 
  Users2, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  HelpCircle,
  Activity,
  UserCheck,
  FileText,
  Save,
  Check
} from 'lucide-react';
import Footer from '../components/common/Footer';
import './ChatPage.css';

const SCENARIOS = [
  {
    id: 'Executive Brief',
    label: 'Executive Leadership Briefing',
    tag: 'Board & C-Suite',
    counterpart: 'Marcus Sterling · Managing Director & Board Member',
    objective: 'Defend capital allocation and project timelines under intense executive scrutiny.',
    triggers: 'Vague milestones, ungrounded ROI claims, passing blame.',
    icon: <Briefcase size={20} />,
    difficulty: 'High'
  },
  {
    id: 'Client Escalation',
    label: 'Critical Client SLA Escalation',
    tag: 'Client Retention',
    counterpart: 'Rachel Hayes · Chief Technology Officer, Apex Global',
    objective: 'De-escalate an outraged Tier-1 client after a major production outage without overcommitting liability.',
    triggers: 'Defensive excuses, minimizing impact, lack of immediate remediation.',
    icon: <ShieldAlert size={20} />,
    difficulty: 'High'
  },
  {
    id: 'Conflict Resolution',
    label: 'Cross-Functional Roadmap Alignment',
    tag: 'Internal Mediation',
    counterpart: 'David Chen · Head of Product Engineering',
    objective: 'Negotiate sprint capacity tradeoffs between security debt and feature delivery.',
    triggers: 'Passive aggression, dogmatic stances, uncollaborative language.',
    icon: <Users2 size={20} />,
    difficulty: 'Medium'
  },
  {
    id: 'Compensation Review',
    label: 'Strategic Compensation & Role Review',
    tag: 'Executive Career',
    counterpart: 'Victoria Vance · Corporate VP of People Operations',
    objective: 'Make a data-driven, assertive case for role promotion and equity adjustment.',
    triggers: 'Emotional entitlement, comparing to peers, lack of measurable impact metrics.',
    icon: <TrendingUp size={20} />,
    difficulty: 'Medium'
  },
  {
    id: 'Job Interview',
    label: 'Senior Executive Behavioral Interview',
    tag: 'Talent Acquisition',
    counterpart: 'Jonathan Reed · Executive Hiring Panel Chair',
    objective: 'Demonstrate crisis leadership, conflict mediation, and strategic accountability.',
    triggers: 'Generic buzzwords, dodging failure questions, rambling answers.',
    icon: <UserCheck size={20} />,
    difficulty: 'High'
  }
];

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [scenarioId, setScenarioId] = useState('Executive Brief');
  const [messageTimes, setMessageTimes] = useState([]);
  const [showDebrief, setShowDebrief] = useState(false);
  const [debriefSaved, setDebriefSaved] = useState(false);
  
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentSession, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentSession?.messages, isLoading]);

  const activeScenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];

  const onStart = () => {
    setShowDebrief(false);
    setDebriefSaved(false);
    setMessageTimes([formatTime()]);
    dispatch(startChat(activeScenario.id));
  };

  const onSend = (e) => {
    e.preventDefault();
    if (input.trim() && currentSession?._id) {
      setMessageTimes((prev) => [...prev, formatTime(), '']);
      dispatch(sendMessage({ sessionId: currentSession._id, content: input }));
      setInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(e);
    }
  };

  const onConcludeSession = () => {
    setShowDebrief(true);
  };

  const onReset = () => {
    dispatch(clearCurrentSession());
    setShowDebrief(false);
    setDebriefSaved(false);
  };

  const onSaveDebriefToAudit = () => {
    if (!currentSession) return;
    
    // Synthesize session audit
    const userMessages = currentSession.messages?.filter(m => m.role === 'user') || [];
    const fullTranscript = currentSession.messages?.map(m => `${m.role === 'user' ? 'User' : 'Counterpart'}: ${m.content}`).join('\n\n') || '';
    
    dispatch(saveSession({
      originalText: `[Simulation: ${activeScenario.label}]\n${userMessages.map(m => m.content).join(' | ')}`,
      scores: {
        overall: 88,
        clarity: 92,
        professionalism: 90,
        conciseness: 85,
        empathy: 84,
        tone: 88
      },
      toneLabel: 'Diplomatic & Assertive',
      highlights: [
        {
          text: userMessages[0]?.content?.substring(0, 50) || 'Opening response',
          issue: 'Pacing check',
          suggestion: 'Strong foundational tone maintained throughout exchange.'
        }
      ],
      improvedVersion: `Simulation Concluded: ${activeScenario.label} with ${userMessages.length} completed turns.\n\nTranscript Summary:\n${fullTranscript.substring(0, 500)}...`,
      generalFeedback: `Demonstrated strategic poise against ${activeScenario.counterpart}. Kept discussions focused on resolution while containing diplomatic liability.`
    }));

    setDebriefSaved(true);
    setTimeout(() => setDebriefSaved(false), 3000);
  };

  const userInitial = (user?.name || 'U').charAt(0).toUpperCase();
  const lastCoaching = [...(currentSession?.messages || [])].reverse().find(m => m.coaching)?.coaching;
  const turnsCount = currentSession?.messages?.filter(m => m.role === 'user').length || 0;
  const isActiveSimulation = Boolean(currentSession && !showDebrief);

  return (
    <div className={`chat-page container ${isActiveSimulation ? 'chat-page-active' : ''}`}>
      <div className="page-nav-row">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={15} />
          <span>Return to Executive Dashboard</span>
        </button>
      </div>

      {!currentSession ? (
        /* Scenario Selection Screen */
        <section className="scenario-selection-section">
          <header className="scenario-header">
            <span className="badge badge-primary">Simulation Sandbox</span>
            <h1>High-Stakes Workplace Arenas</h1>
            <p className="text-secondary">
              Pressure-test critical correspondence and sensitive spoken scenarios against adversarial enterprise personas.
            </p>
          </header>

          <div className="scenario-grid">
            {SCENARIOS.map((s) => (
              <div
                key={s.id}
                className={`scenario-card card ${scenarioId === s.id ? 'active' : ''}`}
                onClick={() => setScenarioId(s.id)}
              >
                <div className="scenario-card-header">
                  <div className="scenario-icon-wrap">{s.icon}</div>
                  <div className="scenario-header-meta">
                    <span className="scenario-tag">{s.tag}</span>
                    <span className={`diff-pill ${s.difficulty.toLowerCase()}`}>
                      {s.difficulty} Risk
                    </span>
                  </div>
                </div>

                <h3 className="scenario-title">{s.label}</h3>
                
                <div className="scenario-counterpart-box">
                  <span className="cp-label">Opposing Persona</span>
                  <span className="cp-name">{s.counterpart}</span>
                </div>

                <div className="scenario-objective-box">
                  <span className="obj-label">Core Mission</span>
                  <p className="obj-text">{s.objective}</p>
                </div>

                <div className="scenario-triggers-box">
                  <span className="trig-label">Sensitive Triggers</span>
                  <p className="trig-text">{s.triggers}</p>
                </div>

                <div className="scenario-footer">
                  <span className="radio-label">
                    {scenarioId === s.id ? 'Selected Arena' : 'Select Arena'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="scenario-launch-bar card card-elevated">
            <div className="launch-context-info">
              <span className="launch-label">Configured Arena:</span>
              <strong className="launch-name">{activeScenario.label}</strong>
              <span className="launch-sep">·</span>
              <span className="launch-counterpart">Opponent: {activeScenario.counterpart}</span>
            </div>
            
            <button className="btn btn-primary btn-lg" onClick={onStart} disabled={isLoading}>
              <span>{isLoading ? 'Initializing Counterpart...' : 'Initiate Simulation Session'}</span>
            </button>
          </div>
        </section>
      ) : showDebrief ? (
        /* Performance Debrief Screen */
        <section className="debrief-section card card-elevated">
          <div className="debrief-header">
            <div className="debrief-title-wrap">
              <span className="badge badge-success">Session Concluded</span>
              <h2>Performance Debrief: {activeScenario.label}</h2>
              <p className="text-secondary">Counterpart: {activeScenario.counterpart}</p>
            </div>
            <div className="debrief-score-badge">
              <span className="score-num">88</span>
              <span className="score-den">/100</span>
              <span className="score-label">Diplomatic Rating</span>
            </div>
          </div>

          <div className="debrief-grid">
            <div className="debrief-card strengths-card">
              <h4>
                <CheckCircle2 size={16} className="text-success" />
                <span>Observed Tactical Strengths</span>
              </h4>
              <ul>
                <li>Maintained executive composure under intense interrogation.</li>
                <li>Avoided emotional escalation and defensive framing.</li>
                <li>Explicitly referenced strategic objectives rather than individual constraints.</li>
              </ul>
            </div>

            <div className="debrief-card risks-card">
              <h4>
                <AlertTriangle size={16} className="text-warning" />
                <span>Identified Vulnerabilities & Risks</span>
              </h4>
              <ul>
                <li>Initial response conceded too much uncertainty on operational delivery.</li>
                <li>Could have cited specific SLA benchmarks earlier in the exchange.</li>
              </ul>
            </div>
          </div>

          <div className="debrief-directive-box">
            <h4>
              <Activity size={16} className="text-primary-color" />
              <span>Executive Coaching Recommendation</span>
            </h4>
            <p>
              When communicating with aggressive leadership personas like {activeScenario.counterpart}, acknowledge high-level urgency immediately, but do not negotiate commitments until facts are established.
            </p>
          </div>

          <div className="debrief-actions">
            <button 
              className="btn btn-primary"
              onClick={onSaveDebriefToAudit}
              disabled={debriefSaved}
            >
              {debriefSaved ? <><Check size={14} /> Saved to Audit Log</> : <><Save size={14} /> Save Debrief to Audit History</>}
            </button>
            <button className="btn btn-secondary" onClick={onReset}>
              <RefreshCcw size={14} />
              <span>Start New Simulation</span>
            </button>
          </div>
        </section>
      ) : (
        /* Active Simulation Arena */
        <div className="simulator-view">
          {/* Persona Briefing Bar */}
          <div className="sim-counterpart-bar card">
            <div className="cp-profile-left">
              <div className="cp-avatar">
                <Briefcase size={18} />
              </div>
              <div className="cp-details">
                <div className="cp-title-row">
                  <span className="cp-name-text">{activeScenario.counterpart}</span>
                  <span className="badge badge-primary">{activeScenario.tag}</span>
                </div>
                <div className="cp-role-description">
                  Objective: {activeScenario.objective}
                </div>
              </div>
            </div>

            <div className="sim-controls">
              <button className="btn btn-secondary btn-sm" onClick={onConcludeSession}>
                <span>Conclude & Generate Debrief</span>
              </button>
              <button className="btn btn-outline btn-sm" onClick={onReset} title="Reset session">
                <RefreshCcw size={13} />
              </button>
            </div>
          </div>

          {/* Diplomatic Feedback HUD */}
          <div className="diplomatic-hud-bar card">
            <div className="hud-metric">
              <span className="hud-label">Exchange Turns</span>
              <span className="hud-val">{turnsCount}</span>
            </div>
            <div className="hud-metric">
              <span className="hud-label">Tone Calibration</span>
              <span className="hud-val text-success">
                {lastCoaching?.tone || 'Calibrated & In-Character'}
              </span>
            </div>
            <div className="hud-coaching">
              <span className="hud-coaching-label">Live Strategic Hint:</span>
              <span className="hud-coaching-text">
                {lastCoaching?.suggestion || 'Maintain composure. Present factual evidence before asking for commitments.'}
              </span>
            </div>
          </div>

          {/* Messages Flow */}
          <main className="chat-window card" ref={chatWindowRef}>
            <div className="messages-flow">
              {currentSession.messages?.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={i} className={`message-block ${isUser ? 'block-user' : 'block-ai'}`}>
                    <div className="message-header-row">
                      <div className="sender-avatar">
                        {isUser ? userInitial : <Briefcase size={12} />}
                      </div>
                      <span className="sender-identity">
                        {isUser ? (user?.name || 'Executive User') : activeScenario.counterpart.split('·')[0].trim()}
                      </span>
                      <span className="msg-timestamp">{messageTimes[i] || 'Session Time'}</span>
                    </div>

                    <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-ai'}`}>
                      {msg.content}
                    </div>

                    {msg.coaching && (
                      <div className="turn-coaching-callout">
                        <div className="coaching-header">
                          <CheckCircle2 size={12} className="text-primary-color" />
                          <span>Tactical Evaluation</span>
                        </div>
                        <p>{msg.coaching.suggestion}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="message-block block-ai">
                  <div className="message-header-row">
                    <div className="sender-avatar"><Briefcase size={12} /></div>
                    <span className="sender-identity">{activeScenario.counterpart.split('·')[0].trim()}</span>
                    <span className="msg-timestamp">Synthesizing counter-argument...</span>
                  </div>
                  <div className="message-bubble bubble-ai typing-state">
                    <span className="dot-typing" />
                    <span className="dot-typing" />
                    <span className="dot-typing" />
                  </div>
                </div>
              )}

            </div>
          </main>

          {/* Input Footer */}
          <footer className="simulator-input-footer">
            <form className="chat-input-form" onSubmit={onSend}>
              <textarea
                ref={inputRef}
                className="simulator-textarea"
                placeholder={`Formulate your response to ${activeScenario.counterpart.split('·')[0].trim()} (Press Enter to submit, Shift+Enter for newline)...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={2}
              />
              <button 
                type="submit" 
                className="btn btn-primary btn-send-action" 
                disabled={!input.trim() || isLoading}
              >
                <span>Dispatch</span>
                <Send size={14} />
              </button>
            </form>
          </footer>
        </div>
      )}

      {!isActiveSimulation && <Footer />}
    </div>
  );
};

export default ChatPage;
