import React from 'react';
import UserImages from '../utilities/UserImages';
import {
    Card, 
    CardImg, 
    CardBody,
    CardTitle,
} from 'reactstrap';
import { Link } from 'react-router-dom';

const HomePage = ({users}) => {
    return (
        <div className="d-flex flex-wrap" style={{marginTop: "60px"}}>
            {users.map(user => {
                return (
                    <div className="row d-flex flex-wrap" style={{margin: '5px', backgroundColor: "gray", width: "98vw"}}>
                        <Card className="col-3 d-flex align-items-center" style={{backgroundColor: "lightgray"}}>
                            <CardImg className="rounded-circle" top width="100%" src={user.profileImage} style={{border: "1px darkgray solid", marginTop: '10px'}} />
                            <CardBody>
                                <Link to={`/user/${user.id}`} className="links">
                                    <CardTitle style={{fontSize: "30px"}}>{user.username}</CardTitle>
                                </Link>
                            </CardBody>
                        </Card>
                        <div className="col-9 d-flex flex-wrap">
                            <UserImages userId={user.id} />
                        </div>
                    </div>
                )
            })}

        </div>
    )
}

export default HomePage