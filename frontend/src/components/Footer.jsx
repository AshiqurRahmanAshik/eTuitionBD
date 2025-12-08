import { Link } from "react-router";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              <span className="text-primary">eTuition</span>
              <span className="text-secondary">BD</span>
            </h3>
            <p className="text-sm">
              Bangladesh's leading platform connecting students with qualified
              tutors. Find the perfect tutor for your educational needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="link link-hover">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tuitions" className="link link-hover">
                  Find Tuitions
                </Link>
              </li>
              <li>
                <Link to="/tutors" className="link link-hover">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link to="/about" className="link link-hover">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 Dhaka, Bangladesh</li>
              <li>📞 +880 1712-345678</li>
              <li>✉️ info@etuitionbd.com</li>
              <li>🕐 Sun - Thu: 9AM - 6PM</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <p className="text-sm mb-4">
              Stay connected with us on social media
            </p>
            <div className="flex gap-4">
              <FaFacebook className="text-lg" />

              <FaXTwitter className="text-lg" />

              <FaLinkedin className="text-lg" />

              <FaYoutube className="text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-base-300 py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>
            © {new Date().getFullYear()} eTuitionBD. All rights reserved. |
            Designed with ❤️ in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
