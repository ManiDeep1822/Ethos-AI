import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startChat, sendMessage, clearCurrentSession } from '../store/chatSlice';
import {
  Send, Sparkles, AlertCircle, Zap, Target, RefreshCcw, ArrowLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import './ChatPage.css';

const SCENARIOS = [
  {
    id: 'Job Interview',
    icon: <Target size={20} />,
    label: 'Job Interview',
    desc: 'Practice answering tough HR and technical interview questions.',
    tag: 'Career',
  },
  {
    id: 'Email Reply',
    icon: <MessageSquare size={20} />,
    label: 'Email Reply',
    desc: 'Sharpen your writing by replying to challenging professional email threads.',
    tag: 'Writing',
  },
  {
    id: 'Conflict Resolution',
    icon: <AlertCircle size={20} />,
    label: 'Conflict Resolution',
    desc: 'Navigate difficult conversations with empathy and calm authority.',
    tag: 'Leadership',
  },
  {
    id: 'Executive Brief',
    icon: <Zap size={20} />,
    label: 'Executive Brief',
    desc: 'Deliver concise, high-impact executive summaries under pressure.',
    tag: 'Strategy',
  },
];

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [scenario, setScenario] = useState('Job Interview');
  const [messageTimes, setMessageTimes] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentSession, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);

  const onStart = () => dispatch(startChat(scenario));

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

  const userInitial = (user?.name || 'U').charAt(0).toUpperCase();
  const active = SCENARIOS.find((s) => s.id === scenario);

  return (
    <div className="chat-page container">
      <button className="btn-back" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={15} />
        <span>Back to Dashboard</span>
      </button>

      {!currentSession ? (
        <section className="scenario-page">
          <header className="scenario-header">
            <span className="badge">Simulation Module</span>
            <h1>Choose Your Arena</h1>
            <p className="text-secondary">
              Select a training environment. The AI adapts to your communication level.
            </p>
          </header>

          <div className="scenario-grid">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                className={`scenario-card ${scenario === s.id ? 'active' : ''}`}
                onClick={() => setScenario(s.id)}
              >
                <div className="scenario-card-top">
                  <div className="scenario-icon">{s.icon}</div>
                  <span className="scenario-tag">{s.tag}</span>
                </div>
                <h3>{s.label}</h3>
                <p>{s.desc}</p>
                {scenario === s.id && (
                  <div className="scenario-selected-indicator">
                    <ChevronRight size={13} /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="scenario-launch">
            <div className="launch-preview">
              <Sparkles size={13} className="text-primary-color" />
              <span>
                Training as: <strong>{active?.label}</strong>
              </span>
            </div>
            <button className="btn btn-primary btn-launch" onClick={onStart} disabled={isLoading}>
              {isLoading ? 'Starting...' : 'Begin Session →'}
            </button>
          </div>
        </section>
      ) : (
        <div className="simulator-view">
          {/* Header */}
          <div className="sim-header">
            <div className="sim-header-left">
              <div className="sim-ai-avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="sim-name">Ethos AI</div>
                <div className="sim-context">{currentSession.scenario} · Active Session</div>
              </div>
            </div>
            <button className="btn-sim-reset" onClick={() => dispatch(clearCurrentSession())}>
              <RefreshCcw size={13} />
              End Session
            </button>
          </div>

          {/* Messages */}
          <main className="chat-window">
            {/* Session start notice */}
            <div className="session-divider">
              <span>Session started · {currentSession.scenario}</span>
            </div>

            <div className="messages-flow">
              {currentSession.messages?.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={i} className={`message-block ${isUser ? 'block-user' : 'block-ai'}`}>
                    {/* Avatar + Name row */}
                    <div className="block-header">
                      {isUser ? (
                        <div className="avatar avatar-user">{userInitial}</div>
                      ) : (
                        <div className="avatar avatar-ai"><Sparkles size={13} /></div>
                      )}
                      <span className="sender-name">
                        {isUser ? (user?.name || 'You') : 'Ethos AI'}
                      </span>
                      <span className="msg-time">{messageTimes[i] || 'now'}</span>
                    </div>

                    {/* Message text */}
                    <div className={`msg-text ${isUser ? 'msg-user' : 'msg-ai'}`}>
                      {msg.content}
                    </div>

                    {/* Coaching hint */}
                    {msg.coaching && (
                      <div className="coaching-pill">
                        <Sparkles size={11} />
                        <span>{msg.coaching.suggestion}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing */}
              {isLoading && (
                <div className="message-block block-ai">
                  <div className="block-header">
                    <div className="avatar avatar-ai"><Sparkles size={13} /></div>
                    <span className="sender-name">Ethos AI</span>
                    <span className="msg-time">typing…</span>
                  </div>
                  <div className="msg-text msg-ai typing-msg">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </main>

          {/* Input */}
          <footer className="chat-footer">
            <div className="input-container container">
              <form className="chat-form" onSubmit={onSend}>
                <div className="user-input-avatar">{userInitial}</div>
                <input
                  ref={inputRef}
                  type="text"
                  className="chat-input"
                  placeholder={`Reply as ${user?.name || 'you'}…`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
