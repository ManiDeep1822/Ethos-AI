import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page-footer">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Brand & Security Column */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="footer-icon-wrap">
                <ShieldCheck size={16} />
              </div>
              <span className="footer-brand-name">Ethos Enterprise</span>
            </div>
            <p className="footer-tagline">
              Institutional-grade communication intelligence and high-stakes simulation for executive teams.
            </p>
            <div className="footer-security-pill">
              <CheckCircle2 size={12} className="security-icon" />
              <span>SOC-2 Type II Compliant · 256-bit AES Encryption</span>
            </div>
          </div>

          {/* Capabilities */}
          <div className="footer-col">
            <h4 className="footer-col-title">Capabilities</h4>
            <ul className="footer-links">
              <li><Link to="/analyze">Text Intelligence</Link></li>
              <li><Link to="/chat">Simulation Arena</Link></li>
              <li><Link to="/dashboard">Executive Analytics</Link></li>
              <li><Link to="/analyze">Diplomatic Calibration</Link></li>
            </ul>
          </div>

          {/* Enterprise Solutions */}
          <div className="footer-col">
            <h4 className="footer-col-title">Solutions</h4>
            <ul className="footer-links">
              <li><span>Executive Briefings</span></li>
              <li><span>HR & Conflict Mediation</span></li>
              <li><span>Client Escalation Management</span></li>
              <li><span>Compensation Negotiation</span></li>
            </ul>
          </div>

          {/* Governance & Trust */}
          <div className="footer-col">
            <h4 className="footer-col-title">Governance</h4>
            <ul className="footer-links">
              <li><span>Zero-Retention Policy</span></li>
              <li><span>Audit Trail Architecture</span></li>
              <li><span>Enterprise Privacy</span></li>
              <li><span>SLA Guarantee</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-status">
            <span className="status-dot"></span>
            <span>All Enterprise Systems Operational</span>
          </div>
          <div className="footer-copy">
            &copy; {currentYear} Ethos Systems Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
