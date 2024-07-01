import React from 'react';

import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';
import { Button } from 'react-bootstrap';

function RegisterPage() {
  const history = useHistory();

  return (
    <div>
      <RegisterForm />

      <center>
      <Button variant='primary' className='button-proceed' onClick={() => history.push(`/login`)}>
									 Switch to Login
								</Button>
      </center>
    </div>
  );
}

export default RegisterPage;
