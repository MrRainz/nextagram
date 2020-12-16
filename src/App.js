import './App.css';
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import LoadingIndicator from './components/LoadingIndicator'
import HomePage from './pages/HomePage'
import UserProfilePage from './pages/UserProfilePage'
import UserPage from './pages/UserPage'
import { Route } from "react-router-dom"
import NavBarDisplay from './components/NavBarDisplay';
import { ToastContainer } from 'react-toastify';
import MyProfilePage from './pages/MyProfilePage'
import ImageUploadPage from './pages/ImageUploadPage'
import ImagePage from './pages/ImagePage'

function App() {
    const [users, setUsers] = useState([])
    const [isloading, setIsLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem("jwt") !== null
    )
    



    useEffect(() => {
        //perform a GET request
        axios.get('https://insta.nextacademy.com/api/v1/users')
        .then(result => {
            // If successful, we do stuffs with 'result'
            setUsers(result.data)
            setIsLoading(false)
        })
        .catch(error => {
            // If unsuccessful, we notify users what went wrong
            console.log(error)
            console.log('ERROR: ', error)
        }) 
    }, [])

    if(isloading){
        return <LoadingIndicator width="150px" height="150px" color="green" /> 
    }

    return(
        <> 
            <NavBarDisplay loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <Route exact path="/" component={() => <HomePage users={users}/>}/>
            <Route exact path="/user/:id" component={UserProfilePage} />
            <Route exact path="/user" component={UserPage} />
            <Route exact path="/profile" component={() => <MyProfilePage loggedIn={loggedIn} />} />
            <Route exact path="/upload" component={() => <ImageUploadPage loggedIn={loggedIn} />} />
            <Route exact path="/image/:userid/:imageid" component={({match}) => <ImagePage loggedIn={loggedIn} match={match}/>} />
            <ToastContainer />
        </>
      );
}

export default App;
