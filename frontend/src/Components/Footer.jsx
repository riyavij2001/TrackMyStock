import React, { useState } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = () => {
    if (!email) {
      setError('Please enter a valid email address.');
    } else {
      setError('');
      window.location.href = '/subscribe'; // Redirect to the subscribe page
    }
  };

  return (
    <footer id="footer" className="text-gray-300 py-12 mt-12">
      <div className="container mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Logo and Address */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#a8d603]">Track My Stocks</h2>
          <p className="text-sm">123 Stock Street, Market City, NY 10001</p>
          <p className="text-sm">Email: support@trackmystocks.com</p>
        </div>

        {/* Column 2: Subscribe */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subscribe for Updates</h3>
          <p className="text-sm">Get the latest stock market insights delivered to your inbox.</p>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-l-lg w-full text-black"
            />
            <button
              onClick={handleSubscribe}
              className="bg-[#a8d603] text-black font-semibold px-5 py-3 rounded-r-lg hover:bg-[#94c102] transition-all"
            >
              Subscribe
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Column 3: Social Media Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex gap-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#a8d603] transition">
              <FacebookIcon style={{ fontSize: '2.5rem' }} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#a8d603] transition">
              <TwitterIcon style={{ fontSize: '2.5rem' }} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#a8d603] transition">
              <LinkedInIcon style={{ fontSize: '2.5rem' }} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#a8d603] transition">
              <InstagramIcon style={{ fontSize: '2.5rem' }} />
            </a>
          </div>
        </div>

        {/* Column 4: Phone Number */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="text-sm">Phone: +1 (555) 123-4567</p>
          <p className="text-sm">Support: +1 (555) 987-6543</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pt-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Track My Stocks. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;