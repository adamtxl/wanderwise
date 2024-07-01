import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function LoginPage() {
  const history = useHistory();

  return (
    <div>
      <LoginForm />

      <center>
      <Button variant='primary' className='button-proceed' onClick={() => history.push(`/registration`)}>
									 Switch to Register
								</Button>
      </center>
    </div>
  );
}

export default LoginPage;
