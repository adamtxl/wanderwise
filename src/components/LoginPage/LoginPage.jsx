import React, { useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const from = location.state?.from?.pathname || '/trips';

  useEffect(() => {
    if (user.id) {
      navigate(from);
    }
  }, [user.id, from, navigate]);

  return (
    <div className='pageContainer'>
      <LoginForm from={from} />
      <center>
        <Button variant='primary' className='button-proceed switchButton' onClick={() => navigate('/register')}>
          Switch to Register
        </Button>
      </center>
    </div>
  );
}

export default LoginPage;