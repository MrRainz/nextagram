import React, {useState, useEffect} from 'react'
import {
    Card, 
    CardImg, 
    CardBody,
    CardTitle,
} from 'reactstrap';
import axios from 'axios'
import {Link} from 'react-router-dom'

function UserPage() {
    const [users, updateUsers] = useState([])
    const [search, updateSearch] = useState("")
    
    useEffect(() => {
        axios.get("https://insta.nextacademy.com/api/v1/users")
        .then((response) => {
            console.log(response.data)
            updateUsers(response.data)
        })
    }, [])


    const handleInput = e => {
        if(e.target.name === "username"){
            updateSearch(e.target.value);
        }   
    }

    let returnProfiles = (user) => {
        return (
            <div className="col-3" style={{display:"flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center"}}>
                <Card style={{backgroundColor: "lightgray", width: "300px", height: "400px"}}>
                    <Link to={`/user/${user.id}`} className="links">   
                        <CardImg className="rounded-circle" width="100%" height="300px" src={user.profileImage} style={{border: "1px darkgray solid", marginTop: '10px'}} />
                        <CardBody>
                            <CardTitle style={{fontSize: "24px", textAlign: "center"}}>{user.username}</CardTitle>
                        </CardBody>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <>
            <div style={{display: "flex", position: "fixed", top: "1.5vh", left: "80vw", zIndex: "1"}}>
                <input type="text" name="username" value={search} onChange={handleInput} style={{height: '30px', fontSize: '15px'}} placeholder="Search filter..."/>
            </div>

            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around", backgroundColor: "gray", marginTop: "50px"}}>
                {users.map((user) => {
                    if (search === "") {
                        return returnProfiles(user)
                    }
                    else if (search.length >= 1 && user.username.toLowerCase().includes(search.toLowerCase())) {
                        return returnProfiles(user)
                    }
                    else {
                        return null
                    }
                })}
            </div>
        </>
    )
}

export default UserPage