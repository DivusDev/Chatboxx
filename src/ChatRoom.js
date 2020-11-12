import React, { useEffect } from 'react'
import ChatMessage from './ChatMessage'

//import firestore
import { auth, firestore, roomsRef, firebase } from './firebase'

//import hooks for firebase
import { useCollectionData, useDocumentDataOnce } from 'react-firebase-hooks/firestore';

//import router
import {  Route, Switch, useParams, useLocation, useHistory } from 'react-router-dom';

function ChatRoom() {


  //get the uid and photo url from the current user
  const { uid, photoURL, displayName } = auth.currentUser;

  let { id } = useParams()
  if (id === '' || id === undefined) id = "global"
  // create state values for form value and set state value as setformvalue
  const [formValue, setFormValue] = React.useState('');

  //for scrolling 
  const dummy = React.useRef()
  //for copying
  const copyText = React.useRef()

  //create refs
  const roomRef = firestore.collection('rooms').doc(id);
  const messagesRef = roomRef.collection("messages");
  

  //create query to order by newest
  const query = messagesRef.orderBy("createdAt").limit(25);

  //location and history hooks 
  const location = useLocation();
  const history = useHistory();


  //use collection data hook to listen in real time
  //because hooks react will re render every time the data changes
  const [messages] = useCollectionData(query, {idField: 'id'})
  const [room] = useDocumentDataOnce(roomRef)
  
  //useEffect hook for component will update method
  useEffect( () => {

    dummy.current.scrollIntoView({behavior: 'smooth'})

    async function checkPass(){
      //retrieve settings 
      let roomData = await roomRef.get()
      roomData = roomData.data()
      const settings = roomData.settings
      const authUsers = roomData.authUsers
      console.log(`authUsers[uid] ${authUsers[uid]}   !authUsers[uid] ${!authUsers[uid]}    uid ${uid}`)
      if (settings.usePass && !authUsers[uid]) {
        history.push(`/${id}/password`)
      }
    }

  })



  const sendMessage = async (e) => {
    //needed to prevent the form from refreshing the page on submit
    e.preventDefault();

   

    //add message document to firestore
    if (formValue == '') return
    await messagesRef.add({
      uid,
      photoURL,
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      displayName
    })

    //reset form
    setFormValue('');

    dummy.current.scrollIntoView({behavior: 'smooth'})

  }

  const copy = e => {
    copyText.current.select();
    document.execCommand("copy");
    e.target.focus();
  }



  return (
    <div className="content">
      <div className="invite" onClick={copy}>
        <textarea id="location" ref={copyText} readOnly value={`localhost:3000${location.pathname}`}/>
        <img src="https://img.icons8.com/material-outlined/18/000000/copy.png"/>
        <span> Click here to copy an invite link</span>
      </div>
      <div className="currentRoom" onClick={copy}>
        <span id="room-label">Room: </span><span>{room && room.settings.name}</span>
      </div>
      <div className="messages">
        <div className="buffer" ref={dummy} ></div>
        {/* if messages then map over them, creating array of messages for react */}
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>).reverse()}
        <div className="buffer small"></div>
        <div className="buffer"></div>
      </div>
      <form className="input" onSubmit={sendMessage}>
        <input id="message-bar" value={formValue} onChange={ e => setFormValue(e.target.value)} placeholder="Chat Message"/>
        <button id="message-submit" ><img alt="" className="invert grey" src="https://img.icons8.com/material-sharp/50/000000/send-comment.png"/></button>
      </form>
    </div>
    
  )
}

export default ChatRoom