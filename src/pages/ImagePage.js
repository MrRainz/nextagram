import {useState, useEffect} from 'react'
import LoadingIndicator from '../components/LoadingIndicator'
import axios from 'axios'
import { Card, CardText, CardImg, Form, Input, Button, Jumbotron } from 'reactstrap'

function ImagePage({match, loggedIn}) {
    const [user, updateUser] = useState()
    const [userImages, updateImages] = useState([])
    const [isloading, setIsLoading] = useState(true);
    const [likes, updateLikes] = useState(0)
    const [liked, updateLiked] = useState(false)
    const [comments, updateComments] = useState([])
    const [userArray, updateUserArrays] = useState([])
    const [userComment, updateUserComment] = useState("")
    const [commentNumber, updateCommentNumber] = useState(0)
    let jwt = localStorage.getItem("jwt")
    let me = localStorage.getItem("username")

    useEffect(() => {
        axios.get("https://insta.nextacademy.com/api/v1/users")
        .then((response) => {
            updateUserArrays(response.data)
            for (let object of response.data) {
                if (Number(object.id) === Number(match.params.userid)) {
                    updateUser(object)
                    setIsLoading(false)
                    return object
                }
            }
        })
    }, [match.params.userid])
    
    useEffect(()=>{
        if (loggedIn) {
            axios.get(`https://insta.nextacademy.com/api/v2/images/${match.params.imageid}`)
            .then((response) => {
                updateImages(response.data)
                updateLikes(response.data.likes.length)
                return response.data.likes
            })
            .then((array)=> {
                console.log(array)
                axios.get(`https://insta.nextacademy.com/api/v1/users/me`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                })
                .then((response)=>{
                    for (let like of array) {
                        if (response.data.id === like.id) {
                            updateLiked(true)
                        }
                        else (
                            updateLiked(false)
                        )
                    }
                })
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [jwt, loggedIn, match.params.imageid])

    useEffect(() => {
        if (userArray.length > 0 && loggedIn) {
            axios.get(`https://insta.nextacademy.com/api/v1/images/${match.params.imageid}/comments`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
            .then((response)=>{
                updateCommentNumber(response.data.length)
                for (let object of response.data) {
                    
                    for (let info of userArray) {
                        let username=""
                        if (object.posted_by.id === info.id) {
                            username = info.username
                            updateComments((comments) => {
                                let newComments = [...comments]
                                newComments.push({username: username, content: object.content})
                                return newComments
                            })
                        }
                    }
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        }
    }, [userArray, match.params.imageid, jwt, loggedIn])
    
    let handleInput = (e) => {
        updateUserComment(e.target.value)
    }

    let handleSubmit = (e) => {
        e.preventDefault()
        updateUserComment("")
        axios.post(`https://insta.nextacademy.com/api/v1/images/${match.params.imageid}/comments`, 
        { "content": userComment },
        {
            headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },     
        })
        updateComments((comments) => {
            let newComments = [...comments]
            newComments.push({username: me, content: userComment})
            return newComments
        })
        .catch(error=>{
            console.log(error)
        })
    }
    
    let handleLike = () => {
        axios.post(`https://insta.nextacademy.com/api/v1/images/${match.params.imageid}/toggle_like`, {},
        { 
            headers: { Authorization: `Bearer ${jwt}`} 
        })
        .then((response)=>{
            console.log(response)
            if (response.data.liked) {
                updateLiked(true)
                updateLikes(likes+1)
            }
            else {
                updateLiked(false)
                updateLikes(likes-1)
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }

    let likeButton = () => {
        if (liked === false) {
            return <Button style={{width: "100%", fontSize: '30px'}} onClick={handleLike}>Like</Button>
        }
        else {
            return <Button style={{width: "100%", fontSize: '30px'}} onClick={handleLike}>Unlike</Button>
        }
    }

    const createPage = () => {
        if (user !== undefined && userImages !== []) {
            if(isloading){
                return <LoadingIndicator width="100px" height="100px" color="blue" /> 
            }
            return (
                <div style={{marginTop: "50px", display: "flex"}}>  
                    <Card className ="col-3 d-flex align-items-center" style={{backgroundColor: "lightgray", paddingTop: "50px", height: 'calc(100vh - 50px)'}}>
                        <CardImg className="rounded-circle" src={user.profileImage} style={{border: "1px solid darkgray", width: "200px"}}/>
                        <CardText id="profileName" style={{margin: "auto", fontSize: "40px", textAlign: "left"}}>{user.username}</CardText>
                    </Card>
                    
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around", backgroundColor: "gray"}} className="col-6">
                        <Card className = "justify-content-center" style={{margin: "20px"}}>
                            <CardImg src={userImages.url} style={{maxHeight: "70vh"}}/>
                            <CardText style={{margin: "20px", textAlign: "center", fontSize: "30px"}}>{likes} Likes</CardText>
                        </Card>
                        <div style={{display: "flex", justifyContent: 'center', width: "90%", margin: "auto"}}>    
                            {likeButton()}
                        </div>
                    </div>
                    <div className="col-3"  style={{backgroundColor: "lightgray"}}> 
                        <h2 style={{marginTop: '20px'}}>Comments ({commentNumber}):</h2>
                        <div id="commentsbox" style={{height: "78vh", border:"3px solid darkgray"}}>
                            {comments.map((comment)=>{
                                return (
                                    <div className="comments">
                                        <h4 style={{margin: "0", padding: "1vh"}}>{comment.username}</h4>
                                        <strong style={{padding: "1vh"}}>{comment.content}</strong>
                                    </div>
                                )
                            })}
                        </div>
                        <Form style={{display: "flex"}} >
                            <div style={{width: '100%'}}>
                                <Input type="textarea" name="text" placeholder="Type your message here..." style={{boxShadow: 'none', border: 'none'}} onChange={e=>handleInput(e)} value={userComment}></Input>
                            </div>
                            <Button color="secondary" style={{boxShadow: 'none'}} onClick={e=>{handleSubmit(e)}}>Send</Button>
                        </Form>
                    </div>
                    
                </div>
            )
        }
        else {
            return null
        }
    }
    
    if (!loggedIn) {
        return (
            <Jumbotron style={{position: "fixed", top: "35vh", left: "25vw"}}>
                <h1>You are not logged in! Login to comment and like!</h1>
            </Jumbotron>
        )
    }
    else {
        return createPage()
    }
}

export default ImagePage