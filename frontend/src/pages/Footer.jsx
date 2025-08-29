import { Share2, Github, Twitter, Mail, Heart } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Share2 className="footer-logo-icon" />
              <span className="footer-logo-text">ShareBox</span>
            </div>
            <p className="footer-description">
              Secure file sharing made simple. Upload, share, and manage your files with ease.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-section-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Home</a></li>
              <li><a href="#" className="footer-link">Upload Files</a></li>
              <li><a href="#" className="footer-link">My Files</a></li>
              <li><a href="#" className="footer-link">Shared Files</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-section-title">Support</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Contact Us</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
            </ul>
          </div>

          {/* Account */}
          <div className="footer-section">
            <h3 className="footer-section-title">Account</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Sign Up</a></li>
              <li><a href="#" className="footer-link">Login</a></li>
              <li><a href="#" className="footer-link">Profile</a></li>
              <li><a href="#" className="footer-link">Settings</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2025 ShareBox. All rights reserved.
            </p>
            <p className="footer-made-with">
              Made with <Heart className="w-4 h-4 footer-heart" /> by the ShareBox team
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer