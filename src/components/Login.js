import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import firebase from '../firebase';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [error_message, setErrormessage] = useState('');

    useEffect(() => {
        if (error == true) {
            setErrormessage("Invalid credentials");
        }
    }, [error]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Login: ', email, password);
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log("Successful");
            setError(false);
            navigate("/Home");

        } catch (error) {
            console.log(error);
            setError(true);
        }
    };

  return (
    <div className='container'>
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {error_message && <p className='red'>{error_message}</p>}
                <label>Email</label>
                <input type="email" name="email" id='email'value={email} onChange = {(event) => setEmail(event.target.value)} />
                <label>Password</label>
                <input type="password" name="password" id='password' value={password} onChange={(event)=> setPassword(event.target.value)} />
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
            Do not have an account? <Link to="/registration">Register Here</Link>
        </div>
    </div>
  );
}

export default Login;
