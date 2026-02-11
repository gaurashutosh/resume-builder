import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Youtube, Dribbble } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 py-20 px-6 mt-32">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
        <div className="max-w-xs space-y-6">
          <Link to="/" aria-label="Home">
            <img src="/logo.svg" alt="" className="h-10 w-auto" />
          </Link>
          <p className="text-slate-600 leading-relaxed">
            The intelligent resume builder designed to help you stand out and
            land your dream job faster with AI-augmented career tools.
          </p>
          <div className="flex items-center gap-5 text-slate-400">
            <a
              href="https://dribbble.com/prebuiltui"
              target="_blank"
              rel="noreferrer"
              aria-label="Dribbble"
              className="hover:text-green-600 transition-colors"
            >
              <Dribbble size={20} />
            </a>
            <a
              href="https://linkedin.com/company/prebuiltui"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-green-600 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://twitter.com/prebuiltui"
              target="_blank"
              rel="noreferrer"
              aria-label="X (formerly Twitter)"
              className="hover:text-green-600 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://youtube.com/@prebuiltui"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-green-600 transition-colors"
            >
              <Youtube size={22} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  AI Resume
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-green-600 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 mt-20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
        <p>© 2026 Resume-Builder. All rights reserved.</p>
        <p className="flex items-center gap-2">
          Made with <span className="text-red-500">♥</span> by gaurashutosh
        </p>
      </div>
    </footer>
  );
};

export default Footer;
