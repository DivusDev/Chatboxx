import React from 'react';
import logo from './logo.svg';
import './App.sass';


//images
import chatbox from './images/chatbox_no_background.svg'

//import hooks for firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

//import router
import {  Route, Switch, useParams, Link, Redirect, useHistory } from 'react-router-dom';

// import components
import Create from './Create';
import ChatRoom from './ChatRoom';


//import firestore
import { auth, firestore, roomsRef, firebase } from './firebase'





//TODO: fix enter button
//TODO: make text scroll up
//TODO: fix deployed routing
//TODO: added chats list and button
//TODO: change the limit of chats from 25 to update to more if you scroll up




function App() {

  //if user is signed in user will be a user object, if not user will be null
  const [user] = useAuthState(auth);


  return (
    <div className="App">
      <header className="App-header">
        <Navbar/>
                {/* if user logged in show chat room if not show sign in */}
                
        <Switch>
          <Route path="/" exact>
            { user ? <ChatRoom/> : <SignIn/>}
          </Route>
          <Route path="/create" component={ Create } />
          <Route path="/chatboxx/:id">
            { user ? <ChatRoom/> : <SignIn/>}
          <ChatRoom/>
          </Route>
        </Switch>

      </header>
    </div>
  );
}


function SignIn() {
  const signInWithGoogle = () => {
    //get firebase google auth
    const provider = new firebase.auth.GoogleAuthProvider();
    //give to user with popup using firebase
    auth.signInWithPopup(provider);
  }
  return(
    <span className="signIn" onClick={signInWithGoogle}>Sign in with Google</span>
  )

}

function SignOut() {
    //if signed in (auth user will be null if not so falsy) then show sign in button
    return auth.currentUser && (
      <button className="nav-button" onClick={()=> auth.signOut()}><span>Sign Out</span><img className="invert" src="https://img.icons8.com/material-outlined/30/000000/export.png"/></button>
    )

  }


function Navbar(){

  const history = useHistory();
  const goCreate = () => {
    history.push('/create')
  }
  const goHome = () => {
    history.push('/')
  }

  return(

    <div className="navbar">
      <div className="logo" onClick={goHome}>
        <img src={chatbox} />
        <span className="chatboxx">ChatBoxx</span>
      </div>
      <button className="nav-button create" onClick={goCreate}>
        <img className="invert" src="https://img.icons8.com/pastel-glyph/32/000000/create-new--v2.png"/>
          <span>Create Chatboxx</span>
      </button>
    { auth.currentUser && 
      <div className="profile">
        <span>Signed in as</span><span>{auth.currentUser.displayName}</span>
        <img id="profile-pic" src={auth.currentUser.photoURL}/> 
        <SignOut/> 
      </div>
    }

    </div>


  )
}





export default App;
