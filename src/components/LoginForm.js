import React, {useState} from "react"
import {ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input} from "reactstrap"
import {toast} from "react-toastify"
import axios from "axios"

const LoginForm = ({toggleIsLogin, toggle, setLoggedIn, updateLoginUsername}) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        axios({
            method: 'post',
            url: 'https://insta.nextacademy.com/api/v1/login',
            data: {
            username: username,
            password: password
            }
        })
        .then(result => {
            console.log(result)
            localStorage.clear()
            localStorage.setItem('jwt', result.data.auth_token)
            localStorage.setItem('username', result.data.user.username)
            setLoggedIn(true)
            updateLoginUsername(result.data.user.username)
            toggle()

            toast.success(`Welcome back, ${username}!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
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
        })
    }

    return (
    <>
        <Form>
        <ModalHeader toggle={toggle}>Log In</ModalHeader>
        <ModalBody>
            <FormGroup>
                <Label for="username">Username</Label>
                <Input type="username" name="username" id="username" placeholder="username" value={username}  onChange={(e) => {setUsername(e.target.value)}}/>
            </FormGroup>
            <FormGroup>
                <Label for="password">Password</Label>
                <Input type="password" name="password" id="password" placeholder="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
            </FormGroup>
            <p>New member? <span onClick ={(e) =>{
                e.preventDefault()
                toggleIsLogin()
            }}>Sign up!</span></p>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={handleSubmit}>Log In</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
        </Form>
    </>
    )
}

export default LoginForm