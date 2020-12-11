import React, {useState} from 'react'
import {Modal} from "reactstrap"
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'


const AuthModal = ({isOpen, toggle, setLoggedIn, updateLoginUsername}) => {
  const [isLogin, setIsLogin] = useState(true)
  const toggleIsLogin = () => {
      setIsLogin(!isLogin)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} >
        {
          isLogin
            ? <LoginForm toggle={toggle} toggleIsLogin={toggleIsLogin} setLoggedIn={setLoggedIn} updateLoginUsername={updateLoginUsername}/>
            : <SignUpForm toggle={toggle} toggleIsLogin={toggleIsLogin}/>
        }
    </Modal>
  )
}

export default AuthModal