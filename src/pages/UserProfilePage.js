import React, {useState, useEffect} from 'react'
import axios from 'axios'
import LoadingIndicator from '../components/LoadingIndicator'
import { Card, CardText, CardImg, Button } from 'reactstrap'
import {useHistory} from 'react-router-dom'

function UserProfilePage({match}) {
    const [user, updateUser] = useState()
    const [userImages, updateImages] = useState([])
    const [isloading, setIsLoading] = useState(true);
    const history = useHistory()

    useEffect(() => {
        axios.get("https://insta.nextacademy.com/api/v1/users")
        .then((response) => {
            for (let object of response.data) {
                if (Number(object.id) === Number(match.params.id)) {
                    updateUser(object)
                    setIsLoading(false)
                    return object
                }
            }
        })
        .then((object) => {
            axios.get(`https://insta.nextacademy.com/api/v2/images?userId=${object.id}`)
            .then((response) => {
                updateImages(response.data)
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }, [match.params.id])


    if (user !== undefined && userImages !== []) {
        if(isloading){
            return <LoadingIndicator width="100px" height="100px" color="blue" /> 
        }
        return (
            <div style={{marginTop: "50px"}}>  
                <Card className ="col-12 d-flex align-items-center" style={{backgroundColor: "lightgray", paddingTop: "50px"}}>
                    <CardImg className="rounded-circle" src={user.profileImage} style={{border: "1px solid darkgray", width: "500px"}}/>
                    <CardText id="profileName" style={{margin: "auto", fontSize: "50px", textAlign: "left"}}>{user.username}</CardText>
                </Card>
                
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around", backgroundColor: "gray"}}>
                    {userImages.map((images) => {
                        return (
                            <Card className = "col-3 justify-content-center" style={{margin: "20px"}}>
                                <CardImg src={images.url} style={{width: "100%"}}/>
                                <Button className="btn-secondary" style={{boxShadow: 'none', margin: "5px"}} onClick={()=>{history.push(`/image/${user.id}/${images.id}`)}}>Like/Comment</Button>
                            </Card>
                        )
                    })}
                </div>
            </div>
        )
    }
    else {
        return null
    }

}

export default UserProfilePage