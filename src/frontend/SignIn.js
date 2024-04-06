import React, { useState, useEffect } from "react";
import * as Components from '../component/Components';
import { Link } from "react-router-dom";
import { signIn, signInAsGuest } from '../backend/userService';
import "../style/log.css"; 
function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault(); // no default page

    try {
      const { redirectUrl } = await signIn(email, password);
      window.location.href = redirectUrl;
      alert('Sign in successful!');
    } catch (error) {
      console.error('Error during sign in:', error);
      setErrorMessage('Invalid email or password');
    }
  };

  const handleGuestSignIn = async () => {
    try {
      await signInAsGuest();
      window.location.href = '/guest';
      alert('Guest sign in successful!');
    } catch (error) {
      console.error('Error during guest sign in:', error);
      setErrorMessage('Error during guest sign in');
    }
  };

  useEffect(() => {
    document.body.classList.add('custom');

    return () => {
      document.body.classList.remove('custom');
    };
  }, []);

  return (
    <Components.Container className="Container fadeInAnimation">
      <Components.SignInContainer className="SignInContainer fadeInAnimation">
        <Components.Form onSubmit={handleSignIn}>
          <Components.Title>Sign in</Components.Title>
          <Components.Input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <Components.Input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Components.Button type="submit" className="user-button">Sign In</Components.Button>
          <Components.Button onClick={handleGuestSignIn} className="guest-button">Sign In as Guest</Components.Button>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </Components.Form>
      </Components.SignInContainer>
      
      <Components.OverlayContainer className="OverlayContainer fadeInAnimation">
        <Components.Overlay className="Overlay">
          <h1 className="Title">Hello User</h1>
          <p>To continue, connect with <br />your personal details<br />
          or<br /> you can connect as a guest</p>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default SignIn;
