import './Header.css'
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';



function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <header className='header'>
      <ul className='header-nav'>
        <li className='home-link'>
          <NavLink to="/">
            Home
          </NavLink>
        </li>
        <div className='header-right'>
          <li className='create-spot'>
            {sessionUser ? (

              <NavLink to='/create-spot'>Create New Spot</NavLink>
            ): (
              ''
            )
          }
          </li>
          {isLoaded && (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )}
        </div>
      </ul>
      <hr/>
    </header>
  );
}

export default Navigation;