import React, {useState} from "react"
import {ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, FormFeedback, FormText} from "reactstrap"
import axios from "axios"
import {toast} from "react-toastify"

const SignUpForm = ({toggleIsLogin, toggle}) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [delay, setDelay] = useState(null)
    const [usernameValid, setUsernameValid] = useState(false)

    // USERNAME
    const handleUsername = (e) => {      
        clearTimeout(delay)
        const newUsername = e.target.value
        setUsername(newUsername)
        
        const newDelay = setTimeout(() => {
            checkUsername(newUsername) //send axios request after 500ms delay
        }, 500);
        setDelay(newDelay)
    }

    const checkUsername = newUsername => {
        axios
        .get(`https://insta.nextacademy.com/api/v1/users/check_name?username=${newUsername}`)
        .then(res=>{
            res.data.valid
            ? setUsernameValid(true)
            : setUsernameValid(false)
        })
    }
    
    const getInputProp = () => {
        if (!username.length) {
            return null;
        }
        if (username.length <= 6 || username.length >=20) {
             return { invalid: true };
        }
        if (usernameValid) {
            return { valid: true };
        } else {
            return { invalid: true };
        }
    };
    
    const getFormFeedback = () => {
        if(!username.length) {
            return null
        }
        if(username.length <=6 || username.length >=20){
            return <FormFeedback invalid>Must be between 6 and 20 characters</FormFeedback>
        }
        if (usernameValid){
            return <FormFeedback valid>Sweet! That name is available</FormFeedback>
        } else {
            return <FormFeedback invalid>Sorry! That username is taken.</FormFeedback> 
        }
    }




    
    // EMAIL
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const handleEmailInput = e => {
        setEmail(e.target.value)
    }

    const getEmailProp = () => {
        if (!email.length){
            return null
        } 
          // email check
        if(!email.match(mailformat)){
            return {invalid:true}
        } else {
            return {valid:true}
        }
    }

    const getFormEmailFeedback = () => {
        if(!email.length){
            return null
        }
        if(!email.match(mailformat)){
            return <FormFeedback invalid>Email format is not valid. Please check.</FormFeedback>
        } else {
            return <FormFeedback valid>Email format looks legit! </FormFeedback>
        }
    }

    // PASSWORD
    const handlePasswordInput = e => {
        setPassword(e.target.value)
    }

    const getPasswordProp = () => {
        if (!password.length){
            return null
        }
        if (password.length < 9 || password.length > 50){
            return {invalid:true}
        } else {
            return {valid:true}
        }
    }

    const getFormPasswordFeedback = () => {
        if (!password.length) {
            return null
        }
        if (password.length < 9 || password.length > 50) {
            return <FormFeedback invalid>Password must be between 8 and 50 characters in length!</FormFeedback>
        }
    }

    // CONFIRM PASSWORD
    const handleConfirmPasswordInput = e => {
        setConfirmPassword(e.target.value)
    }

    const getFormPasswordConfirmProp = () => {
        if (!confirmPassword.length){
            return null
        }
        if (confirmPassword != password){
            return {invalid:true}
        } else {
            return {valid:true}
        }
    }
      
    const getFormPasswordConfirmFeedback=()=>{
        if(!confirmPassword.length){
            return null
        }
        if(confirmPassword != password){
            return <FormFeedback invalid> Passwords do not match. Please check again.</FormFeedback>
        } else {
            return <FormFeedback valid>Passwords match! You're good to go!</FormFeedback>
        }
    }


    // SUBMIT
    const handleSubmit = () => { 
        axios({
            method: 'POST',
            url: 'https://insta.nextacademy.com/api/v1/users/',
            data: {
                username: username,
                email: email,
                password: password
            }
        })
        .then(response => {
            toggle()
            console.log(response)
            toast.success(response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        })
        .catch(error => {
            error.response.data.message.forEach((message) => {
                toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
        console.error(error.response) // so that we know what went wrong if the request failed
        })
    }


    return <>
        <Form>
            <ModalHeader toggle={toggle}>Sign Up</ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type="username" name="username" id="username" placeholder="Key in username" value={username} onChange={handleUsername} {...getInputProp()}/>
                    {getFormFeedback()}
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" placeholder="Key in email" value={email} onChange={handleEmailInput} {...getEmailProp()}/>
                    {getFormEmailFeedback()}
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" placeholder="Key in password" value={password} onChange={handlePasswordInput} {...getPasswordProp()}/>
                    {getFormPasswordFeedback()}
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input type="password" name="password" id="confirmPassword" placeholder="Key in password again" value={confirmPassword} onChange={handleConfirmPasswordInput} {...getFormPasswordConfirmProp()} />
                    {getFormPasswordConfirmFeedback()}
                </FormGroup>
                <p>Already a member? <a href="#" onClick ={(e) =>{
                    e.preventDefault()
                    toggleIsLogin()
                }}>Log in here</a></p>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" disabled={!(username && email && password && confirmPassword)} onClick={handleSubmit}>Sign Up</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Form>
    </>
}

export default SignUpForm