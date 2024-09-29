import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerUser = (event) => {
    event.preventDefault();
    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
        email: email,
      },
    });
    navigate('/trips');
  };

  return (
    <Form className="formPanel op margin-top" onSubmit={registerUser}>
      <h2 className='log-register'>Register User</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="username">
          Username:
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            type="text"
            name="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
            autoComplete='username'
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="password">
          Password:
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            type="password"
            name="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
            autoComplete='new-password'
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} htmlFor="email">
          Email:
        </Form.Label>
        <Col sm={9}>
          <Form.Control
            type="email"
            name="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </Col>
      </Form.Group>
      <Button variant='primary' className='button-proceed' type='submit'>
        Register
      </Button>
    </Form>
  );
}

export default RegisterForm;