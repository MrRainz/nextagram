import { Jumbotron, Form, FormGroup, Input, FormText, Button } from 'reactstrap'
import { useState } from 'react'
import axios from 'axios'
import {toast} from "react-toastify"

const ImageUploadPage = ({loggedIn}) => {
    
    const [imageValue, setImageValue] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [message, setMessage] = useState('')
    let jwt = localStorage.getItem("jwt")

    const handleFile = (e) => {
        if (e.target.value) {
            setImageValue(e.target.value)
            setPreviewImage(URL.createObjectURL(e.target.files[0]))
            setImageFile(e.target.files[0])
        } 
        else {
            setImageValue(null)
            setPreviewImage(null)
            setImageFile(null)
        }
    }

    const handleUpload = (e) => {
        e.preventDefault();
        // Formdata object to hold the image file to send to the server
        let formData = new FormData();
        // Append the key:value pair to the formData object
        formData.append("image", imageFile);
      
        axios.post("https://insta.nextacademy.com/api/v1/images/", formData, {
            headers: { Authorization: `Bearer ${jwt}` }
          })
            .then(response => {
                if (response.data.success) {
                    setMessage("Image Uploaded Successfully!")
                    setPreviewImage(null)
                    setImageFile(null)
                    toast.success(`Successfully Uploaded!`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
                else {
                    toast.error(`Upload failed`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            })
            .catch(error => {
                console.log(error.response);
                toast.error(`POST request failed`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            });
    }

    const createPage = () => {
        return (
            <div className="mx-auto" style={{display: "flex", marginTop: "105px", width: "95vw", height:"85vh", backgroundColor: "darkgray"}}>
                <div style={{display: "flex", margin: "auto", backgroundColor: "gray"}}>
                    <div className="card" style={{height: "400px", width: "400px", justifyContent: "center"}}>
                        {previewImage ? (
                            <img
                            src={previewImage}
                            width="380px"
                            height="380px"
                            alt=""
                            />
                            ) : (
                            <h3  className="text-center" >
                                {message ? message : "Live Preview"}
                            </h3>
                        )}
                    </div>
                    <div style={{height: "400px", width: "400px"}}>
                        <Form style={{margin: "auto", position: "relative", top: "150px", left: "20px"}} onSubmit={(e) => {handleUpload(e)}}>
                            <FormGroup >
                                <Input type="file" name="image-file" multiple={false} value={imageValue} onChange={e => {handleFile(e)}}/>
                                <FormText color="black">
                                    Make sure the image being uploaded is a supported format.
                                </FormText>
                            </FormGroup>
                            <Button type="submit" color="primary">
                                Upload
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        )
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

export default ImageUploadPage