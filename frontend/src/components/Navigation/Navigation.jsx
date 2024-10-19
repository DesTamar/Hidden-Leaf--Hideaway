
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';



function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <button className='create-spot-button'>
          <NavLink to='/create-spot'>Create New Spot</NavLink>
        </button>
      </li>
      {isLoaded && (
        <li>
            <ProfileButton user={sessionUser}/>
        </li>
      )}
      
    </ul>
  );
}

export default Navigation;