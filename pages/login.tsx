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
try{
    const result = await signIn(identifier, password);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
    const token = result;
    localStorage.setItem('jwt', token); // Set the JWT token to localStorage
    console.log('Login successful');

    setTimeout(() => {
      router.push('/home'); // Redirect to the home page
    }
    , 100);
  }catch (error){
    console.error('Error:', error);
    setErrorMessage('Wrong email or password');
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
