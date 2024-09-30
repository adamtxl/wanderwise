import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css'; // Import the CSS file



function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerUser = (event) => {
    event.preventDefault();

    if (username && password && email) {
      dispatch({
        type: 'REGISTER',
        payload: { username, password, email },
      });
    } else {
      dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  };

useEffect(() => {
  if (errors.registrationMessage === 'Registration successful!') {
    navigate('/trips'); // Navigate to /trips on success
  } else if (errors.registrationMessage === 'Username already exists. Please choose another one.') {
    alert('Username already exists. Please choose another one.'); // Display alert message
    setTimeout(() => {
      navigate('/login'); // Navigate to /login after showing the alert
    }, 2000); // 2-second delay before redirect
  }
}, [errors.registrationMessage, navigate]);

  return (
    <form className='formPanel op margin-top' onSubmit={registerUser}>
      <h2 className='log-register'>Register</h2>
      {errors.registrationMessage && (
        <h3 className='alert' role='alert'>
          {errors.registrationMessage}
        </h3>
      )}
      <div className='form-group'>
        <label htmlFor='username'>Username:</label>
        <input
          type='text'
          name='username'
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete='username'
        />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          name='password'
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete='new-password'
        />
      </div>
      <div className='form-group'>
        <label htmlFor='email'>Email:</label>
        <input
          type='email'
          name='email'
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete='email'
        />
      </div>
      <div>
        <Button variant='primary' className='button-proceed' type='Submit'>
          Register
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;
