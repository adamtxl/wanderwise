import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (!username) {
      dispatch({ type: 'LOGIN_FAILED_USERNAME_REQUIRED' });
    } else if (!password) {
      dispatch({ type: 'LOGIN_FAILED_PASSWORD_REQUIRED' });
    } else {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    }
  }; // end login

  return (
    <form className='formPanel op margin-top' onSubmit={login}>
      <h2 className='log-register'>Login</h2>
      {errors.loginMessage && (
        <h3 className='alert' role='alert'>
          {errors.loginMessage}
        </h3>
      )}
      <div className='form-group'>
        <label htmlFor='username'>
          Username:
          <input
            type='text'
            name='username'
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete='username'
          />
        </label>
      </div>
      <div className='form-group'>
        <label htmlFor='password'>
          Password:
          <input
            type='password'
            name='password'
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete='current-password'
          />
        </label>
      </div>
      <div>
        <Button variant='primary' className='button-proceed' type='Submit'>
          Log In
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;