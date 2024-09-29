import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function LogOutButton(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // useNavigate replaces history.push

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login'); 
  };

  return (
    <button
      className={props.className}
      onClick={handleLogout}
      data-cy="logout-button"
    >
      Log Out
    </button>
  );
}

export default LogOutButton;