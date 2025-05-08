
import React from 'react';
import { Store, Sparkles } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      className="bg-retail-blue text-white shadow-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Store className="h-8 w-8" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold">AI Retail Compliance Validator</h1>
            <div className="flex items-center text-xs text-blue-100">
              <Sparkles className="h-3 w-3 mr-1" />
              <p>Powered by Google Gemini AI</p>
            </div>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#upload" className="hover:text-blue-200 transition-colors">Upload</a>
          <a href="#results" className="hover:text-blue-200 transition-colors">Results</a>
          <a href="#rules" className="hover:text-blue-200 transition-colors">Rules</a>
          
          <SignedOut>
            <SignInButton>
              <motion.button 
                className="bg-white text-retail-blue px-4 py-1 rounded-md hover:bg-blue-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
