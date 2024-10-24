import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './Modal.css'

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal()

  const handleDemoUser = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'demo@demo.com', password: 'demopassword' }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };






  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (

    <div className='modal'>
      <h2>Log In</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder='Username or Email'
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />


        <input
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />


        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>

      </form>

      <button onClick={handleDemoUser}>Login as Demo User</button>
    </div>


  );
}

export default LoginFormModal;