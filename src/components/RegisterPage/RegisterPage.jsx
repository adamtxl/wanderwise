import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';
import { Button } from 'react-bootstrap';

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className='pageContainer'>
      <RegisterForm />
      <center>
        <Button variant='primary' className='button-proceed switchButton' onClick={() => navigate('/login')}>
          Switch to Login
        </Button>
      </center>
    </div>
  );
}

export default RegisterPage;