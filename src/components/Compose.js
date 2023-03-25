import React, {useState, useEffect} from 'react'
import '../styles/Compose.css';
import 'firebase/auth';
import 'firebase/firestore';
import firebase from '../firebase';
import { Link } from 'react-router-dom';
import 'firebase/compat/firestore';
import { useNavigate } from 'react-router-dom';

function Compose() {

    const [recipientEmail, setRecipientEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState("");


    const handleRecipientEmailChange = (event) => {
        setRecipientEmail(event.target.value);
    }


    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    
    useEffect(() => {
        const emailRegex = /\S+@\S+\.\S+/;
        if (recipientEmail.length > 0 && !emailRegex.test(recipientEmail)) {
            setEmailError("Invalid email address");
        } 
        else {
            setEmailError("");
            }
    }, [recipientEmail]);
    

    const handleSend = () => {
        firebase.auth().fetchSignInMethodsForEmail(recipientEmail)
            .then((signInMethods) => {
                if (signInMethods.length === 0) {
                    throw new Error('User not found');
                }
                console.log("signInMethods", signInMethods);
                const email = recipientEmail;
                const uid = signInMethods[0].split(':')[0];

                console.log("signInMethods", uid);
    
                firebase.firestore().collection('messages').add({
                    recipientEmail: email,
                    senderUid: firebase.auth().currentUser.uid,
                    senderEmail: firebase.auth().currentUser.email,
                    message: message,
                  
                });
                navigate("/Home");
                console.log('Message sent successfully');
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                setError("Message not sent. Recipient may not be on database.");
            });
    }
      
    return (
        <div className='compose-container'>
            <div className='compose-body'>
                <div className='compose-body2'>
                    <div className='search-user'>
                        {error && <p className='red'>{error}</p>}
                    </div>
                     <label>To:</label>
                    {emailError && <p className='red'>{emailError}</p>}
                    <div className='search-user'>
                        
                        <input type="email" value={recipientEmail} onChange={handleRecipientEmailChange} placeholder='Type here the email address of the reciever'/>
                       
                    </div>
                    <label>Message:</label>
                    <div className='search-user'>
                        <textarea value={message} onChange={handleMessageChange} placeholder='Write your message here!'></textarea>
                    </div>
                    <div className='button-container'>
                        <Link to={"/Home"}><button className='reds'>Back</button></Link>
                        <button onClick={handleSend} className='greens'>Send</button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Compose
