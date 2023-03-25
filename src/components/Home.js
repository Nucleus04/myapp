import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from '../firebase';
import 'firebase/firestore';
import '../styles/Home.css';

function Home() {
    const [senders, setSenders] = useState([]);
    const [reciever, setReciever] = useState([]);
    const [contact, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [selectedNav, setSelectedNav] = useState('inbox');

    //For Remembering users in current session
    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setCurrentUserEmail(user.email);
            } else {
                setCurrentUserEmail(null);
            }
        });
        return () => unsubscribe();
    }, []);



    useEffect(() => {
        if (currentUserEmail) {
            const unsubscribe = firebase.firestore().collection('messages')
                .where('recipientEmail', '==', currentUserEmail)
                .onSnapshot((querySnapshot) => {
                    const sendersArray = [];
                    const contactsSet = new Set();
                    querySnapshot.forEach((doc) => {
                        const senderEmail = doc.data().senderEmail;
                        const messageText = doc.data().message;
                        sendersArray.push({ senderEmail, messageText });
                        console.log(senderEmail);
                        if (senderEmail === currentUserEmail) {
                            
                        } else {
                          contactsSet.add(senderEmail);

                        }
                        
                    });
                    console.log([...contactsSet]);
                    setContacts([...contactsSet]);
                    setSenders(sendersArray);
                    setIsLoading(false);
                });
            return () => unsubscribe();
        } else {
            setIsLoading(false);
        }
    }, [currentUserEmail]);

    
    useEffect(() => {
        if (currentUserEmail) {
            const unsubscribe = firebase.firestore().collection('messages')
                .where('senderEmail', '==', currentUserEmail)
                .onSnapshot((querySnapshot) => {
                    const sendersArray = [];
                    const contactsSet = new Set();
                    querySnapshot.forEach((doc) => {
                        const senderEmail = doc.data().recipientEmail;
                        const messageText = doc.data().message;
                        sendersArray.push({ senderEmail, messageText });
                        if (senderEmail === currentUserEmail) {
                            
                        } else {
                          contactsSet.add(senderEmail);

                        }
                        
                    });
                    console.log("Array",sendersArray);
                    setContacts([...contactsSet]);
                    setReciever(sendersArray);
                    setIsLoading(false);
                });
            return () => unsubscribe();
        } else {
            setIsLoading(false);
        }
    }, [currentUserEmail]);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    //Function when deleting messages
    const handleDeleteClick = (senderEmail, message) => {
        firebase.firestore().collection('messages')
            .where('recipientEmail', '==', currentUserEmail)
            .where('senderEmail', '==', senderEmail)
            .where('message', '==',message)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                });
            })
            .catch((error) => {
                console.error('Error deleting document: ', error);
            });
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className='home-container'>
            <div className='home-header'>
                <div className='upper-header'>
                    <div className='flex'>
                        <button className='left-button' onClick={handleEditClick}>{isEditing ? 'Done' : 'Edit'}</button>
                    </div>
                    <div className='flex right'>
                        <Link to={"/Compose"}><button className='right-button'>Compose</button></Link>
                    </div>
                </div>
                <div className='lower-header'>
                    <h1 className='home-name'>Chats</h1>
                </div>
            </div>

            <div className='home-body'>
                <div className='navigations'>
                    <div className={`navigation-buttons ${selectedNav === 'inbox' ? 'selected' : ''}`} onClick={() => setSelectedNav('inbox')}>
                    <p>Inbox</p>
                    </div>
                    <div className={`navigation-buttons ${selectedNav === 'sent' ? 'selected' : ''}`} onClick={() => setSelectedNav('sent')}>
                    <p>Sent</p>
                    </div>
                    <div className={`navigation-buttons ${selectedNav === 'contacts' ? 'selected' : ''}`} onClick={() => setSelectedNav('contacts')}>
                    <p>Contact List</p>
                    </div>
                </div>
                {selectedNav === 'inbox' && (
                    <div className='messages'>
                    {reciever.length > 0 ? (
                        senders.map((sender, index) => (
                            <div key={index} className='list'>
                                <div className='chats'>
                                    <div className='sender-name'>
                                        <p><b>To:</b> {sender.senderEmail}</p>
                                    </div>
                                    <div className='message'>
                                        <p><b>Message:</b> {sender.messageText}</p>
                                        {isEditing && (
                                        <div className='delete-buttons'>
                                            <button className='delete-button red' onClick={() => handleDeleteClick(sender.senderEmail, sender.messageText)}>Delete</button>
                                        </div>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='no-message'>No messages in your inbox</div>
                    )}
                    </div>
                    )}

                    {selectedNav === 'sent' && (
                    <div className='messages'>
                    {senders ? (
                        reciever.map((sender, index) => (
                            <div key={index} className='list'>
                                <div className='chats'>
                                    <div className='sender-name'>
                                        <p><b>To:</b> {sender.senderEmail}</p>
                                    </div>
                                    <div className='message'>
                                        <p><b>Message:</b> {sender.messageText}</p>
                                        {isEditing && (
                                        <div className='delete-buttons'>
                                            <button className='delete-button red' onClick={() => handleDeleteClick(sender.senderEmail, sender.messageText)}>Delete</button>
                                        </div>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='no-message'>No sent messages</div>
                    )}
                    </div>
                )}

                {selectedNav === 'contacts' && (
                    <div className='messages'>
                    {contact.length > 0 ? (
                        contact.map((sender, index) => (
                            <div key={index} className='list'>
                                <div className='chats'>
                                    <div className='sender-name contact-name'>
                                        <p><b>Email: </b>{sender}</p>
                                    </div>
        
                                    
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='no-message'>No contacts.</div>
                    )}
                    </div>
                    )}
                </div>
                </div>

        
    );
}

export default Home;
