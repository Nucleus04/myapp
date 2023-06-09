import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from '../firebase';
import 'firebase/firestore';
import '../styles/Home.css';

function Home() {
    const [senders, setSenders] = useState([]);
    const [reciever, setRecievers] = useState([]);
    const [contact, setContacts] = useState([]);
    const [contactName, setContactName] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [selectedNav, setSelectedNav] = useState('inbox');
    const [isCurrentUserInitialized, setIsCurrentUserInitialized] = useState(false);

    //For Remembering users in current session
    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setCurrentUserEmail(user.email);
                setIsCurrentUserInitialized(true);
            } else {
                setCurrentUserEmail(null);
            }
        });
        return () => unsubscribe();
    }, []);


    //useEffect for retrieving inbox messages, sentmessages, contact list
    useEffect(() => {
        const sendersArray = [];
        if (isCurrentUserInitialized) {
            const inboxUnsubscribe = firebase.firestore().collection('messages')
            .where('recipientEmail', '==', currentUserEmail)
            .onSnapshot((querySnapshot) => {
                const contactsSet = new Set();
                querySnapshot.forEach((doc) => {               
                const senderEmail = doc.data().senderEmail;
                if (senderEmail !== currentUserEmail) {
                  contactsSet.add(senderEmail);
                }
                sendersArray.push({ senderEmail, messageText: doc.data().message, type: 'inbox' });
                });
            setContacts([...contactsSet]);
            setSenders(sendersArray);
            setIsLoading(false);
            });
      
            const sentUnsubscribe = firebase.firestore().collection('messages')
                .where('senderEmail', '==', currentUserEmail)
                .onSnapshot((querySnapshot) => {
                const recieversArray = [];
                const contactsSet = new Set();
                querySnapshot.forEach((doc) => {
                const recieverEmail = doc.data().recipientEmail;
                if (recieverEmail !== currentUserEmail) {
                    contactsSet.add(recieverEmail);
                }
                recieversArray.push({ senderEmail: recieverEmail, messageText: doc.data().message, type: 'sent' });
                });
                const mergedArray = [...sendersArray, ...recieversArray];
                const uniqueContacts = [...new Set(mergedArray.map(item => item.senderEmail))];
                setContacts(uniqueContacts.map(c => ({ senderEmail: c, type: 'contact' })));
                setRecievers(recieversArray);
                setIsLoading(false);
            });
      
            return () => {
                inboxUnsubscribe();
                sentUnsubscribe();
            };
        }
      }, [currentUserEmail, isCurrentUserInitialized]);
      
      
      
      

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    //Function when deleting inbox messages
    const handleDeleteClick = (recieverEmail, message) => {
        firebase.firestore().collection('messages')
          .where('recipientEmail', '==', currentUserEmail)
          .where('senderEmail', '==', recieverEmail)
          .where('message', '==',message)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete().then(() => {
                setSenders(prevSenders => prevSenders.filter((sender) => sender.senderEmail !== recieverEmail || sender.messageText !== message));
              });
            });
          })
          .catch((error) => {
            console.error('Error deleting document: ', error);
          });
      };
      
      
      
    //function for deleting sent messages
    const handleDeleteSent = (recieverEmail, message) => {
        firebase.firestore().collection('messages')
            .where('senderEmail', '==', currentUserEmail)
            .where('recipientEmail', '==', recieverEmail)
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
        return (
            <div className='center-loading'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className='home-container'>
            <div className='home-header'>
                <div className='upper-header'>
                    <div className='flex'>
                        <h3 className='left-button' onClick={handleEditClick}>{isEditing ? 'Done' : 'Edit'}</h3>
                    </div>
                    <div className='flex right'>
                        <Link to={"/Compose"}><h3 className='right-button'>Compose</h3></Link>
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
                    {reciever ? (
                        senders.map((sender, index) => (
                            <div key={index} className='list'>
                                <div className='chats'>
                                    <div className='sender-name'>
                                        <p><b>From:</b> {sender.senderEmail}</p>
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
                                            <button className='delete-button red' onClick={() => handleDeleteSent(sender.senderEmail, sender.messageText)}>Delete</button>
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
                    {contact ? (
                        contact.map((sender, index) => (
                            <div key={index} className='list'>
                            <div className='chats'>
                                <div className='sender-name contact-name'>
                                <p><b>Email: </b>{sender.senderEmail}</p>
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
