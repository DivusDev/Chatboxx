import React from 'react';
import { useHistory } from 'react-router-dom';


//import firestore
import { auth, firestore } from './firebase'

//for hashing
const crypto = require('crypto');



function Create(props){


    const [ usePass, setUsePass ] = React.useState(false)
    const [ name, setName ] = React.useState('');
    const [ password, setPassword ] = React.useState('');
    const history = useHistory();
    let passClass = usePass ? 'show' : 'hide';
    //for error message
    let error = false;
  
    const createRoom = async (e) => {
      
      if (auth.currentUser === null) {
        history.push('/')
        return;
      }
      


      //needed to prevent the form from refreshing the page on submit
      e.preventDefault();
      console.log("called")
      // Create hash of SHA1 type 
      let hash = crypto.createHash('sha1').update(name).digest('hex').slice(0, 6); 
      console.log(hash)
  
      let roomRef = firestore.collection("rooms").doc(hash);
      let taken = await roomRef.get()
      console.log(taken)
      taken = taken.exists
      const userID = auth.currentUser.uid
      
      if (!taken){
        //create settings for new room if not already created
        roomRef.set({settings:{
          name,
          usePass,
          password,
          hash
        }})
  
        if (usePass){
          //for authentication
          roomRef.collection("authUsers").doc(userID).set({ auth: true })
        }
        // console.log(props)
  
        history.push(`/chatboxx/${hash}`)
  
        
      } else {
        //room already made
        error = true;
        //roomRef.doc("settings").get().then(snapshot => snapshot.data()) has the data 
        
  
      }
  
  
    }
  
  
    return(
  
        <div id="create-container">
          <div className="title">
            <h1>Create Chatboxx</h1>
          </div>
          <form onSubmit={createRoom}>
            <div className="input-group">
              <label>Chatboxx Name</label>
              <input placeholder="Chatboxx" className="input-field" type="text"  required onChange={e => setName(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="password-button">Password</label>
              <input className="plus-minus" id="password-button" type="checkbox" onClick={e => setUsePass(!usePass)} /> 
              <input  className={`input-field ${passClass}`} placeholder="*********" type="password" id="password-field" onChange={e => setPassword(e.target.value)}/>
            </div>
  
            <button type='submit' className="nav-button">Create</button>
          </form>
        </div>
    )
  
  }

  export default Create;