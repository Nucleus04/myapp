import React, {useState, useEffect} from 'react';
import '../styles/Registration.css';
import { Link } from 'react-router-dom';
import firebase from '../firebase';
import { useNavigate } from 'react-router-dom';


function Registration() {
    
    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        const emailRegex = /\S+@\S+\.\S+/;
        if (email.length > 0 && !emailRegex.test(email)) {
            setEmailError("Invalid email address");
        } 
        else {
            setEmailError("");
            }
    }, [email]);
    

    useEffect(() => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$!%*?&]{8,}$/;
        if (password.length > 0 && !passwordRegex.test(password)) {
            setPasswordError(
                "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number"
            );
        } 
        else {
            setPasswordError("");
        }
    }, [password]);



    function register(email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Register: ', email, password);
        register(email, password)
        .then((e) => {
            console.log('User registered successfully');
            navigate("/");

        })
        .catch(error => {
            console.error('Error registering user:', error);
        });
    };



    return (
        <div className='container'>
            <div className="registration-container">
            <h2>Registration</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    {emailError && <p className='red'>{emailError}</p>}
                    <input type="text" name="email" id='email' required value={email} onChange = {(event)=>setUsername(event.target.value)}/>
                   
                    <label>Password</label>
                    {passwordError && <p className='red'>{passwordError}</p>}
                    <input type="password" name="password" id='password' required value={password} onChange = {(event)=>setPassword(event.target.value)} />

                    <button type="submit" className="btn btn-primary">
                    Register
                    </button>
                </form>
                Already have an account?<Link to="/"> Click Here!</Link>
            </div>
        </div>
    );
}

export default Registration;
