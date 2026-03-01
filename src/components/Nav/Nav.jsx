import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <nav className="nav">
      <Link to="/home" className="nav-brand">
        WanderWise
      </Link>

      <div className="nav-links">
        {!user.id && (
          <Link className="navLink" to="/login">Login / Register</Link>
        )}

        {user.id && (
          <>
            <Link className="navLink" to="/info">Info Page</Link>
            <Link className="navLink" to="/trips">Trips</Link>
            <Link className="navLink" to="/map-page">Add to Map</Link>
            <Link className="navLink" to="/about">About</Link>
            <LogOutButton className="navLink" />
            {user.admin === true && (
              <Link className="navLink nav-admin" to="/admin">Admin</Link>
            )}
          </>
        )}

        {!user.id && (
          <Link className="navLink" to="/about">About</Link>
        )}
      </div>
    </nav>
  );
}

export default Nav;
