import { Navigate } from 'react-router-dom';

// Registration is now handled on the landing page (/)
function RegisterPage() {
  return <Navigate to="/" replace />;
}

export default RegisterPage;
