import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

export const deleteSingleImage = (image, callback = null) => {
  axios.post(serverURL + "/images/deleteImage", image)
       .then(res => {
         if(callback) callback();
       }).catch(err => {console.log(err)});
}
