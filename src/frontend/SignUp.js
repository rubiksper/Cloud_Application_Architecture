import React, { useState, useEffect } from "react";
import * as Components from '../component/Components';
import { Link } from "react-router-dom";
import { signUp } from '../backend/userService';
import "../style/log.css"; // Importez votre fichier de style CSS ici

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page par défaut

    if (!name || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      await signUp(name, email, password);
      setName('');
      setEmail('');
      setPassword('');
      setErrorMessage(''); // Réinitialiser l'erreur après une inscription réussie
      alert('Sign up successful!');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error === 'Email already in use') {
        setErrorMessage('This email is already in use. Please use a different email.');
      } else {
        console.error('Error during sign up:', error);
        setErrorMessage('An error occurred during sign up');
      }
    }
  };

  useEffect(() => {
    // Ajoutez la classe personnalisée au body lorsque le composant est monté
    document.body.classList.add('custom');

    // Supprimez la classe personnalisée du body lorsque le composant est démonté
    return () => {
      document.body.classList.remove('custom');
    };
  }, []);

  return (
    <Components.Container className="Container fadeInAnimation">
      <Components.SignUpContainer className="SignUpContainer fadeInAnimation">
        <Components.Form onSubmit={handleSignUp}>
          <Components.Title>Create Account</Components.Title>
          <Components.Input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
          <Components.Input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <Components.Input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Components.Button type="submit" className="user-button">Sign up</Components.Button>
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.OverlayContainer className="OverlayContainer fadeInAnimation">
        <Components.Overlay className="Overlay">
          <h1 className="Title">Welcome!</h1>
          <p>Please, register your personal <br />infos, to continue with us and<br /> become a member of<br /></p>
          <h1 className="Title">PRAHA-GEM!</h1>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default SignUp;
