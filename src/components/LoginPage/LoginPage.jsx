import { Navigate } from 'react-router-dom';

// Auth is now handled on the landing page (/)
function LoginPage() {
  return <Navigate to="/" replace />;
}

export default LoginPage;
