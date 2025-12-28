import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { SubmissionProvider } from './context/SubmissionContext'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SubmissionProvider>
      <App />
    </SubmissionProvider>
  </AuthProvider>
);
