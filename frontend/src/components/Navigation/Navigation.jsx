import './Nav.css'
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';



function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className='nav-bar'>
      <ul>
        <li className='logo'>
          <NavLink to="/">Home</NavLink>
        </li>
        <li className='create-spot'>
          <button className='create-spot-button'>
            <NavLink to='/create-spot'>Create New Spot</NavLink>
          </button>
        </li>
        {isLoaded && (
          <li className='profile'>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;