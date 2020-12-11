import React, { useState } from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import {useHistory} from 'react-router-dom'
import AuthModal from "./AuthModal"
import {toast} from "react-toastify"

const NavBarDisplay = ({loggedIn, setLoggedIn}) => {
    const history = useHistory()
    
    const handleUseStateUsername = () => {
        if (localStorage.getItem("username") !== null) {
            return localStorage.getItem("username")
        }
        else {
            return "Guest"
        }
    }
    const [loginUsername, updateLoginUsername] = useState(handleUseStateUsername())

    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => {
        setShowModal(!showModal)
    }

    const handleLogOut = () => {
        console.log("Logging out...")
        localStorage.clear()
        setLoggedIn(false)
        updateLoginUsername("Guest")
        
        toast.success(`Successfully logged out!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

    const handleLogButton = () => {
        if (!loggedIn) {
            return <NavLink style={{cursor:"pointer", paddingRight: "25px"}} onClick = {toggleModal}>Log In</NavLink>
        }
        else {
            return <NavLink style={{cursor:"pointer", paddingRight: "25px"}} onClick = {handleLogOut}>Log Out</NavLink>
        }
    }

    const handleProfilePage = () => {
        if (loggedIn === true) {
            history.push(`/profile`)
        }
        else (
            alert("You are not logged in!")
        )
    }

    return (
    <div>
        <Navbar color="dark" dark expand="md" style={{position: "fixed", width: "100vw", zIndex: "1", top: "0"}}>
            <NavbarBrand style={{cursor:"pointer"}} onClick = {() => {history.push("/")}}>Nextagram</NavbarBrand>
            <Nav className="mr-auto" navbar>
                <NavItem style={{display: "flex"}}>
                    <NavLink style={{cursor:"pointer"}} onClick= {() => {history.push("/")}}>Home</NavLink>
                    <NavLink style={{cursor:"pointer"}} onClick = {() => {history.push("/user")}}>Users</NavLink>
                </NavItem>
            </Nav>
            <Nav className="margin-auto" navbar>
                <NavItem>
                    <NavLink style={{cursor:"pointer"}} onClick ={handleProfilePage}>{loginUsername}</NavLink>
                </NavItem>
            </Nav>
            <Nav className="ml-auto " navbar >
                <NavItem style={{display: "flex"}}>
                    {handleLogButton()}
                </NavItem>
            </Nav>
        </Navbar>
        <AuthModal 
            isOpen={showModal} 
            toggle={toggleModal}
            loggedIn={loggedIn} 
            setLoggedIn={setLoggedIn}
            updateLoginUsername={updateLoginUsername}
        />
    </div>
    );
}

export default NavBarDisplay