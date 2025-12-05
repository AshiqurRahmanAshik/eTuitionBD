import React from "react";
import MyLink from "./MyLink";
import MyContainer from "./MyContainer";
import Logo from "./Logo";
import { FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-base-200 pt-16 pb-10 mt-20 mx-auto">
      {/* Subscribe Section */}
      <MyContainer>
        <div className="bg-primary text-white p-10  shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-2xl md:text-3xl font-semibold max-w-lg leading-snug">
            Subscribe for the latest updates and new features.
          </h2>

          <div className="join w-full md:w-auto">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered join-item w-full md:w-72"
            />
            <button className="btn bg-primary text-white join-item px-6">
              Subscribe
            </button>
          </div>
        </div>
      </MyContainer>

      {/* Main Footer Section */}
      <MyContainer>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 w-11/12 mx-auto justify-items-start">
          {/* Logo + Description */}
          <div>
            <div className="flex items-center gap-3">
              <Logo className="w-12 h-12" />
              <h2 className="font-bold text-xl text-primary">eTuitionBD</h2>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">
              eTuitionBD connects students with qualified tutors across
              Bangladesh, making quality learning accessible and effortless for
              everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li>
                <MyLink to="/Tuitions">Find Tutor</MyLink>
              </li>
              <li>
                <MyLink to="/request">Request for Tutor</MyLink>
              </li>
              <li>
                <MyLink to="/teacher">Become a Tutor</MyLink>
              </li>
              <li>
                <MyLink to="/subscription">Subscription Plan</MyLink>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Company</h3>
            <ul className="space-y-2 text-gray-600 leading-relaxed">
              <li>
                <MyLink to="/contact">Contact Us</MyLink>
              </li>
              <li>
                <MyLink to="/privacy">Privacy Policy</MyLink>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Socials</h3>
            <ul className="space-y-3 text-gray-600 leading-relaxed ">
              <li className="flex items-center gap-2">
                <span className="w-5 flex justify-center">
                  <FaFacebook size={20} color="blue" />
                </span>
                <a>Facebook</a>
              </li>

              <li className="flex items-center gap-2">
                <span className="w-5 flex justify-center">
                  <FaYoutube size={20} color="red" />
                </span>
                <a>YouTube</a>
              </li>

              <li className="flex items-center gap-2">
                <span className="w-5 flex justify-center">
                  <FaXTwitter size={20} color="black" />
                </span>
                <a>Twitter</a>
              </li>

              <li className="flex items-center gap-2">
                <span className="w-5 flex justify-center">
                  <FaLinkedin size={20} color="blue" />
                </span>
                <a>LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-5">
          Copyright © {new Date().getFullYear()} - All Rights Reserved.
        </p>
      </MyContainer>
    </div>
  );
};

export default Footer;
