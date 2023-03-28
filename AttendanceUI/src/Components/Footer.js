import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer>  
    <div class="footer">
        <div class="row">
          <div class="col-md-4">
            <h4>Contact Us</h4>
            <p>Email: info@shanmugahospital.com</p>
            <p>Phone: 0427-2706666, 8754033833</p>
            <p>Address: 24, Saradha College Road,
    Salem-636007. Tamilnadu.</p>
          </div>
          <div class="col-md-4">
            <h4>More</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h4>Follow Us</h4>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
