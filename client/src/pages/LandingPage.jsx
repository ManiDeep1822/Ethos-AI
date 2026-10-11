import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  FileSearch, 
  MessageSquareQuote, 
  TrendingUp, 
  Lock, 
  Cpu, 
  Building2, 
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Users2,
  BarChart3,
  ShieldAlert
} from 'lucide-react';
import Footer from '../components/common/Footer';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* ─── 1. Expansive Hero Section ──────────────────────── */}
      <header className="hero-section">
        <div className="container">
          <div className="hero-grid">
          <div className="hero-text-col">
            <div className="hero-badge">
              <ShieldCheck size={14} className="badge-shield-icon" />
              <span>Enterprise Communications Intelligence</span>
            </div>
            
            <h1 className="hero-title">
              Precision Communication for Executive Leadership
            </h1>
            
            <p className="hero-description">
              Institutional-grade AI platform to audit critical communications, pressure-test high-stakes conversations, and master executive diplomacy before sending a single word.
            </p>
            
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Start Free Trial</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                <span>Enterprise Sign In</span>
              </Link>
            </div>
            
            {/* Enterprise Trust Proof */}
            <div className="hero-trust">
              <span className="trust-label">Institutional Standards</span>
              <div className="trust-items">
                <span className="trust-item"><CheckCircle2 size={13} /> SOC-2 Type II Certified</span>
                <span className="trust-item"><CheckCircle2 size={13} /> Zero-Retention Guarantee</span>
                <span className="trust-item"><CheckCircle2 size={13} /> 256-Bit Cryptographic Storage</span>
              </div>
            </div>
          </div>
          
          {/* Realistic Product Interface Mockup */}
          <div className="hero-visual-col">
            <div className="interface-frame">
              <div className="frame-header">
                <div className="frame-breadcrumbs">
                  <span className="frame-dot"></span>
                  <span className="frame-app-name">Ethos Diagnostic Suite</span>
                  <span className="frame-sep">/</span>
                  <span className="frame-view">Executive Memo Analysis</span>
                </div>
                <div className="frame-meta">
                  <span className="frame-status-badge">Audit Active</span>
                </div>
              </div>
              
              <div className="frame-body">
                {/* Score Header */}
                <div className="frame-metrics-row">
                  <div className="frame-kpi">
                    <span className="kpi-label">Overall Index</span>
                    <span className="kpi-value text-success">94<small>/100</small></span>
                  </div>
                  <div className="frame-kpi">
                    <span className="kpi-label">Diplomatic Risk</span>
                    <span className="kpi-value text-success">Low</span>
                  </div>
                  <div className="frame-kpi">
                    <span className="kpi-label">Clarity Score</span>
                    <span className="kpi-value">96%</span>
                  </div>
                  <div className="frame-kpi">
                    <span className="kpi-label">Tone Calibration</span>
                    <span className="kpi-value">Authoritative</span>
                  </div>
                </div>

                {/* Audit Comparison Panel */}
                <div className="frame-diff-card">
                  <div className="diff-header">
                    <AlertTriangle size={13} className="text-warning" />
                    <span>Identified Vulnerability & Suggested Remediation</span>
                  </div>
                  <div className="diff-original">
                    <span className="diff-tag danger">Original Draft</span>
                    <p>"You need to sign off on this headcount immediately because engineering will block the release otherwise."</p>
                  </div>
                  <div className="diff-replacement">
                    <span className="diff-tag success">Executive Polish</span>
                    <p>"To ensure our core release timeline remains unblocked, we recommend approving the engineering headcount allocation this week."</p>
                  </div>
                </div>

                <div className="frame-footer-insights">
                  <TrendingUp size={14} className="text-success" />
                  <span>Diplomatic impact improved by +24% with zero loss in strategic urgency.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

      {/* ─── 2. Institutional Impact Metrics Banner ──────────── */}
      <section className="metrics-band">
        <div className="container">
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-number">98.4%</span>
              <span className="metric-title">Tone Accuracy</span>
              <p className="metric-desc">Validated across executive correspondence</p>
            </div>
            <div className="metric-item">
              <span className="metric-number">4.2x</span>
              <span className="metric-title">Faster De-escalation</span>
              <p className="metric-desc">During sensitive workplace mediations</p>
            </div>
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-title">Data Isolation</span>
              <p className="metric-desc">Zero telemetry shared with foundation models</p>
            </div>
            <div className="metric-item">
              <span className="metric-number">&lt; 1.2s</span>
              <span className="metric-title">Real-Time Latency</span>
              <p className="metric-desc">Instant contextual parsing and guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Core Capabilities Section ───────────────────── */}
      <section className="capabilities-section">
        <div className="container">
          <div className="section-head text-center">
          <span className="badge badge-primary">Institutional Platform</span>
          <h2 className="section-heading">Engineered for High-Stakes Governance</h2>
          <p className="section-subheading">
            Three foundational pillars built to protect executive reputation and drive organizational alignment.
          </p>
        </div>

        <div className="capabilities-grid">
          <div className="capability-column card">
            <div className="cap-icon-box">
              <FileSearch size={22} />
            </div>
            <h3>Text Intelligence Suite</h3>
            <p>
              Deep semantic audits of emails, board memos, and organizational policies. Identifies passive-aggression, ambiguity, and diplomatic liability with inline one-click remediations.
            </p>
            <ul className="cap-list">
              <li><CheckCircle2 size={13} /> Audience-specific calibration (Executive, Client, Peer)</li>
              <li><CheckCircle2 size={13} /> Side-by-side diff comparison</li>
              <li><CheckCircle2 size={13} /> Multi-dimensional scoring matrix</li>
            </ul>
          </div>

          <div className="capability-column card">
            <div className="cap-icon-box">
              <MessageSquareQuote size={22} />
            </div>
            <h3>Simulation Arena</h3>
            <p>
              Interactive sandboxes replicating high-pressure workplace interactions. Roleplay against strict counter-party personas with instant turn-by-turn diplomatic coaching.
            </p>
            <ul className="cap-list">
              <li><CheckCircle2 size={13} /> Executive board briefings & budget defenses</li>
              <li><CheckCircle2 size={13} /> Critical SLA breach and client de-escalations</li>
              <li><CheckCircle2 size={13} /> Comprehensive end-of-session debrief reports</li>
            </ul>
          </div>

          <div className="capability-column card">
            <div className="cap-icon-box">
              <BarChart3 size={22} />
            </div>
            <h3>Executive Analytics</h3>
            <p>
              Institutional progression tracking that measures communication growth, sentiment trajectory, and competency velocity without frivolous gamification metrics.
            </p>
            <ul className="cap-list">
              <li><CheckCircle2 size={13} /> Multi-axis skill radar (Clarity, Conciseness, Empathy)</li>
              <li><CheckCircle2 size={13} /> Searchable historical audit logs with inspection drawer</li>
              <li><CheckCircle2 size={13} /> Exportable performance summaries</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

      {/* ─── 4. Full-Width Security & Trust Band ─────────────── */}
      <section className="security-band">
        <div className="container">
          <div className="security-layout-grid">
            <div className="security-narrative-col">
              <span className="badge badge-success">Enterprise Architecture</span>
              <h2 className="security-headline">Institutional Data Protection by Design</h2>
              <p className="security-description">
                Ethos is engineered under the strictest corporate confidentiality standards. Your strategic correspondence and internal deliberations never leave your private enterprise boundary.
              </p>
              
              <div className="security-certification-row">
                <div className="cert-badge">
                  <ShieldCheck size={16} className="text-success" />
                  <span>SOC-2 Type II Certified</span>
                </div>
                <div className="cert-badge">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Zero Data Retention</span>
                </div>
                <div className="cert-badge">
                  <Lock size={16} className="text-success" />
                  <span>AES-256 Bit Encryption</span>
                </div>
              </div>
            </div>
            
            <div className="security-cards-grid">
              <div className="security-pill-card">
                <div className="sec-pill-icon">
                  <Lock size={18} />
                </div>
                <div className="sec-pill-content">
                  <h4>Zero Model Retention</h4>
                  <p>Customer data is never utilized for foundational AI model fine-tuning or training datasets.</p>
                </div>
              </div>

              <div className="security-pill-card">
                <div className="sec-pill-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="sec-pill-content">
                  <h4>End-to-End Encryption</h4>
                  <p>All sessions are secured via TLS 1.3 in flight and AES-256 cryptographic standards at rest.</p>
                </div>
              </div>

              <div className="security-pill-card">
                <div className="sec-pill-icon">
                  <Building2 size={18} />
                </div>
                <div className="sec-pill-content">
                  <h4>Audit Trail Governance</h4>
                  <p>Granular audit logging records every evaluation, remediation, and session for compliance review.</p>
                </div>
              </div>

              <div className="security-pill-card">
                <div className="sec-pill-icon">
                  <Cpu size={18} />
                </div>
                <div className="sec-pill-content">
                  <h4>Deterministic Guardrails</h4>
                  <p>Strict schema enforcement prevents ungrounded hallucinations during high-stakes roleplay.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Executive Call to Action ──────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-banner-card card card-elevated">
            <div className="cta-inner text-center">
              <span className="badge badge-primary">Get Started Today</span>
              <h2 className="cta-headline">Elevate Your Institutional Communications</h2>
              <p className="cta-subheadline">
                Join executive leaders and enterprise teams who depend on Ethos for communication precision and diplomacy.
              </p>
              <div className="cta-button-row">
                <Link to="/register" className="btn btn-primary btn-lg">
                  <span>Start Free Trial</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  <span>Sign In to Workstation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
