import React from 'react'
//import firestore
import { auth } from './firebase'

function ChatMessage(props){
    console.log(props.message)
    const { text, uid, photoURL } = props.message;
    const info = React.useRef();

    const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received';
    
    const date = props.message.createdAt == null ? new Date() : new Date(props.message.createdAt.seconds * 1000)
    
    
    let time = `${date.getHours()}:${date.getMinutes()}`

    const beginHover = e => {
      info.current.style.display = "block"
    }

    const endHover = e => {
      info.current.style.display = "none"
    }

    return (
      <div className={`message ${messageClass}`} >
        <img alt="" src={photoURL} className="message-picture" onMouseEnter={beginHover} onMouseLeave={endHover}/>
        <span className="info" ref={info}>{props.message.displayName} {time}</span>
        <span>{text}</span>
  
      </div>
    )
  
  }
  
  export default ChatMessage;