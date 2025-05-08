
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Import Clerk publishable key from environment variable or use the provided fallback
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_dHJ1c3Rpbmctc3BhcnJvdy05Mi5jbGVyay5hY2NvdW50cy5kZXYk';

// No need to throw an error now as we have a fallback key
createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
