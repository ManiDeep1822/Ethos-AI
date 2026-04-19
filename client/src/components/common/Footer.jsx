import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page-footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <Sparkles size={14} className="footer-logo-icon" />
          <span className="footer-brand-name">Ethos</span>
          <span className="footer-divider">|</span>
          <span className="footer-copy">&copy; {currentYear} All rights reserved.</span>
        </div>
        <nav className="footer-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/analyze">Analyzer</Link>
          <Link to="/chat">Training</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
