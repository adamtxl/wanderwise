import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';



function Nav() {
  const user = useSelector((store) => store.user);
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 768px)' });


  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">𝕎𝕒𝕟𝕕𝕖𝕣𝕎𝕚𝕤𝕖</h2>
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            

            <Link className="navLink" to="/info">
            {isDesktopOrLaptop ? (
          <>
            <i class="bi bi-info-circle-fill"></i> Info Page
          </>
        ) : (
          <i class="bi bi-info-circle-fill"></i>
        )}
            </Link>

            <Link className="navLink" to="/trips">
            {isDesktopOrLaptop ? (
          <>
            <i class="bi bi-airplane-fill"></i> Trips
          </>
        ) : (
          <i class="bi bi-airplane-fill"></i>
        )}
            </Link>

            {/* <Link className="navLink" to="/past-trips">
              Past Trips
            </Link> */}

            <Link className="navLink" to="/map">
              {isDesktopOrLaptop ? (
                <>
            <i class="bi bi-geo-alt-fill"></i>  Add to map
                </>
              ) : (
                <i class="bi bi-geo-alt-fill"></i>
              )}
            </Link>

            <LogOutButton className="navLink" />
          </>
        )}

        <Link className="navLink" to="/about">
          {isDesktopOrLaptop ? (
            <>
            <i class="bi bi-file-person-fill"></i>  About 
            </>
            ) : (
              <i class="bi bi-file-person-fill"></i>
            )}
        
        </Link>
        {user.admin === true && (
          <Link className="navLink" to="/admin">
          Admin
        </Link>
        )}
        
      </div>
    </div>
  );
}

export default Nav;
