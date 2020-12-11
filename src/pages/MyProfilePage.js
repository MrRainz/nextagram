import axios from "axios"
import { useState, useEffect } from "react"
import { Jumbotron, Card, CardImg, CardText } from 'reactstrap'
import LoadingIndicator from '../components/LoadingIndicator'
import {useHistory} from 'react-router-dom'

const MyProfilePage = ({loggedIn}) => {
    
    const history = useHistory()
    const [user, updateUser] = useState()
    const [profilePicture, updateProfilePicture] = useState("")
    const [userImages, updateImages] = useState([])
    const [isloading, setIsLoading] = useState(true);

    let jwt = localStorage.getItem("jwt")

    useEffect(() => {
        axios({
            method: 'get',
            url: 'https://insta.nextacademy.com/api/v1/users/me',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            }
        })
        .then(response => {
            console.log("API request successful! ")
            console.log(response)
            updateUser(response.data.username)
            updateProfilePicture(response.data.profile_picture)
            setIsLoading(false)
        })
        .catch(err => {
            console.log("API request failed.")
            console.log(err)
        })
    }, [])

    useEffect(() => {
        axios({
            method: 'get',
            url: 'https://insta.nextacademy.com/api/v1/images/me',
            headers: {
                'Authorization' : `Bearer ${jwt}`
            }
        })
        .then((response) => {
            console.log("Pictures data") 
            console.log(response)
            updateImages(response.data)
        })
        .catch(err => {
            console.log("API request failed.")
            console.log(err)
        })
        
    }, [])

    
    const createPage = () => {
        if (user !== undefined && userImages !== []) {
            if(isloading){
                return <LoadingIndicator width="100px" height="100px" color="blue" /> 
            }
            return (
                <>
                    <button style={{position: "absolute", top: "20vh", left: "80vw", fontSize: "25px", zIndex: "1"}} onClick={()=>{history.push(`/upload`)}}>Upload Image</button>
                    <div style={{marginTop: "50px"}}>  
                        <Card className ="col-12 d-flex align-items-center" style={{backgroundColor: "lightgray", paddingTop: "50px"}}>
                            <CardImg className="rounded-circle" src={profilePicture} style={{border: "1px solid darkgray", width: "500px"}}/>
                            <CardText id="profileName" style={{margin: "auto", fontSize: "50px", textAlign: "left"}}>{user}</CardText>
                        </Card>
                        
                        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around", backgroundColor: "gray"}}>
                            {userImages.map((images) => {
                                return (
                                    <Card className = "col-3 justify-content-center" style={{margin: "20px"}}>
                                        <CardImg src={images} style={{width: "100%"}}/>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </>
            )
        }
        else {
            return null
        }
    }
    
    
    if (!loggedIn) {
        return (
            <Jumbotron style={{position: "fixed", top: "35vh", left: "25vw"}}>
                <h1>You are not logged in! Login to access your profile!</h1>
            </Jumbotron>
        )
    }
    else {
        return createPage()
    }
}


export default MyProfilePage