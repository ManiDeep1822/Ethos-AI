import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  PenTool, 
  MessageSquare, 
  ArrowRight, 
  Zap, 
  Shield, 
  Sparkles, 
  Globe, 
  Cpu, 
  Layers,
  CheckCircle2,
  Users,
  Activity
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Decorative Background Elements */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <header className="hero-section container">
        <div className="hero-grid">
          <div className="hero-text">
            <div className="hero-badge animate-float">
              <span className="badge-icon"><Sparkles size={12} /></span>
              Next-Gen AI Intelligence
            </div>
            <h1 className="hero-title">
              Elevate Your <span className="text-gradient">Professional Presence</span>
            </h1>
            <p className="hero-description">
              The advanced platform for high-stakes workplace diplomacy. 
              Audit your tone, simulate critical scenarios, and master the art of professional communication with Ethos's precision AI.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-premium">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-outline">
                Live Demo
              </Link>
            </div>
            
            {/* Trust Badges / Social Proof */}
            <div className="hero-social-proof">
              <p>Trusted by professionals at</p>
              <div className="social-icons">
                <div className="social-item"><Globe size={16} /> GlobalTech</div>
                <div className="social-item"><Cpu size={16} /> InnovateAI</div>
                <div className="social-item"><Layers size={16} /> StackFlow</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="visual-container">
              <div className="visual-card main-card">
                <div className="viz-header">
                  <div className="viz-dot"></div>
                  <span>Ethos Intelligence Report v4.2</span>
                  <Activity size={14} className="viz-icon-pulse" />
                </div>
                <div className="viz-content">
                  <div className="viz-main-stat">
                    <span className="stat-label">Communication Score</span>
                    <span className="stat-value">94<small>/100</small></span>
                    <div className="stat-trend positive">
                      <TrendingUp size={12} /> +12% this week
                    </div>
                  </div>
                  
                  <div className="viz-stats">
                    {[
                      { label: 'Diplomatic Tone', val: 96, color: 'var(--primary)' },
                      { label: 'Strategic Impact', val: 88, color: '#6366f1' },
                      { label: 'Empathy Calibration', val: 82, color: '#f59e0b' }
                    ].map(v => (
                      <div key={v.label} className="viz-row">
                        <div className="viz-info">
                          <span>{v.label}</span>
                          <span className="viz-percentage">{v.val}%</span>
                        </div>
                        <div className="viz-bar-wrapper">
                          <div className="viz-bar-bg">
                            <div className="viz-bar-fill" style={{width: `${v.val}%`, backgroundColor: v.color}}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Micro-Cards (Moved outside main-card to avoid overflow:hidden clipping) */}
              <div className="micro-card micro-card-1 animate-float-delayed">
                <CheckCircle2 size={14} color="var(--primary)" />
                <span>Tone Adjusted</span>
              </div>
              <div className="micro-card micro-card-2 animate-float">
                <Users size={14} color="#6366f1" />
                <span>Audience Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Stats Banner ───────────────────────────────────── */}
      <section className="stats-banner">
        <div className="container stats-grid">
          <div className="stat-item">
            <h3>50k+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-item">
            <h3>1.2M</h3>
            <p>Analyzed Drafts</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Satisfaction Rate</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>AI Support</p>
          </div>
        </div>
      </section>

      {/* ─── Features Section ───────────────────────────────── */}
      <section className="features-section container" id="features">
        <div className="section-header">
          <span className="section-tag">Core Capabilities</span>
          <h2 className="section-title">Engineered for <span className="text-gradient">Professional Excellence</span></h2>
          <p className="section-description">Precision tools built for high-performance teams and individual contributors who value clarity and diplomacy.</p>
        </div>
        
        <div className="feature-grid">
          {[
            {
              icon: <PenTool size={24} />,
              title: "Pulse Analyzer",
              desc: "Deep-learning audits of your professional drafts with real-time tone calibration and impact forecasting."
            },
            {
              icon: <MessageSquare size={24} />,
              title: "Mission Simulator",
              desc: "Practice high-stakes conversations in a sandbox environment. From negotiations to conflict resolution."
            },
            {
              icon: <Activity size={24} />,
              title: "Growth Matrix",
              desc: "Visualize your communication evolution with high-fidelity historical data and personalized skill-gap analysis."
            },
            {
              icon: <Shield size={24} />,
              title: "Enterprise Security",
              desc: "Bank-grade encryption ensures your drafts and private simulations remain strictly confidential and secure."
            },
            {
              icon: <Zap size={24} />,
              title: "Instant Refactoring",
              desc: "One-click tone shifting. Convert aggressive drafts into assertive masterpieces without losing your core message."
            },
            {
              icon: <Sparkles size={24} />,
              title: "Ethos Intelligence",
              desc: "Proprietary LLM context-mapping that understands organizational hierarchy and cultural nuances."
            }
          ].map((feature, idx) => (
            <div key={idx} className="feature-card-premium">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
              <div className="feature-card-bg"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Section ────────────────────────────────────── */}
      <section className="cta-section container">
        <div className="cta-content">
          <div className="cta-glow"></div>
          <h2 className="cta-title">Ready to Transform Your Communication?</h2>
          <p className="cta-description">Join thousands of leaders who are mastering the art of professional diplomacy with Ethos AI.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn-premium btn-xl">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <p className="cta-note">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
