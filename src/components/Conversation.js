import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firebase from '../firebase';

function Conversation() {
  const { senderEmail } = useParams();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = firebase.auth().currentUser;

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const unsubscribe = firebase.firestore().collection('messages')
      .where('recipientEmail', '==', currentUser.email)
      .where('senderEmail', '==', senderEmail)
      .orderBy('createdAt')
      .onSnapshot((querySnapshot) => {
        const messagesArray = [];
        querySnapshot.forEach((doc) => {
          messagesArray.push({ id: doc.id, ...doc.data() });
        });
        setMessages(messagesArray);
        setIsLoading(false);
      });
    return () => unsubscribe();
  }, [currentUser, senderEmail]);

  const handleDeleteClick = (messageId) => {
    firebase.firestore().collection('messages').doc(messageId).delete()
      .catch((error) => {
        console.error('Error deleting document: ', error);
      });
  };

  if (!currentUser) {
    return <p>Please sign in to view conversations.</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='conversation-container'>
      <div className='conversation-header'>
        <h2 className='conversation-name'>{senderEmail}</h2>
      </div>
      <div className='conversation-body'>
        {messages.map((message) => (
          <div key={message.id} className='message'>
            <div className='message-content'>
              <p>{message.text}</p>
            </div>
            <div className='message-delete'>
              <button className='delete-button red' onClick={() => handleDeleteClick(message.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Conversation;
