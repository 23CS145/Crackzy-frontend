import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>MockTest Platform</h3>
            <p>Prepare for your exams with confidence.</p>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/tests">Tests</Link></li>
              <li><Link to="/news">News</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} MockTest Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
  
export default Footer;