import { useState, useEffect } from "react"
import { Card, CardImg } from 'reactstrap'
import axios from 'axios'
import LoadingIndicator from '../components/LoadingIndicator'

const UserImages = ({userId}) => {
    const [userImages, setUserImages] = useState([]);
    const [isloading, setIsLoading] = useState(true);

    useEffect(() => {
        //perform a GET request
        axios.get(`https://insta.nextacademy.com/api/v2/images?userId=${userId}`)
        .then(result => {
            // If successful, we do stuffs with 'result'
            //console.log(result)
            setUserImages(result.data)
            setIsLoading(false)
        })
        .catch(error => {
            // If unsuccessful, we notify users what went wrong
            console.log('ERROR: ', error)
        })
    
    }, [userId])

    if(isloading){
        return <LoadingIndicator width="100px" height="100px" color="blue" /> 
    }

    return (
        <div style={{display: "flex", flexWrap: "wrap", alignItems: "center"}}>
            {userImages.map((userImage)=>{
                return(
                    <Card style={{width: "200px", margin: "5px"}}>
                        <CardImg src={userImage.url} style={{width: "180px", margin: "auto"}} />
                    </Card>
                )
            })}
        </div>
    )
}


export default UserImages