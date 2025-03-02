import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from '../app/auth'; 
import '../style/style.css';



const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // This can be either email or username
  const [password, setPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => { 
    e.preventDefault();
    setErrorMessage('');

    const token = await signIn(identifier, password);

    if (token && token !== "Login successful, but no token received.") {
      // Token is received and saved
      localStorage.setItem('jwt', token);
      console.log("Redirecting to home...");

      // Redirect after token is saved
      setTimeout(() => {
        router.push('/home');
      }, 100);
    } else {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };  

  return (
    <div className="login-container">
      <div className="wrapper">
        <h1>Login</h1>
        <form onSubmit={handleLogin} id="login-form" method="post">
          <div className="input-field">
            <input 
              id="email" 
              type="text" 
              name="email" 
              placeholder="Email / Username" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)} 
              required
            />
            <i className='bx bx-user-circle'></i>  
          </div>
          
          <div className="input-field">
            <input 
              id="password" 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <i id="eye" className='bx bx-show-alt'></i>
          </div>
          
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
          
          <button className="btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
