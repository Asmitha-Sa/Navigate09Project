
import React from 'react';
import { Store } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-retail-blue text-white shadow-md">
      <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Store className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">AI Retail Compliance Validator</h1>
            <p className="text-xs text-blue-100">Powered by Gemini AI</p>
          </div>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#upload" className="hover:text-blue-200 transition-colors">Upload</a>
          <a href="#results" className="hover:text-blue-200 transition-colors">Results</a>
          <a href="#rules" className="hover:text-blue-200 transition-colors">Rules</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
