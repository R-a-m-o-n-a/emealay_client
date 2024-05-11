import { track } from 'react-tracking';
import App from "./App";
import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

const TrackedApp = track(
  // app-level tracking data
  {},
  // top-level options
  {
    // custom dispatch to console.log
    dispatch: data => {
      // console.log('Tracking-Object', data);
      // send to DB
      axios.post(serverURL + '/tracking/', data)
           .then(res => {
             // console.log('result of adding tracking data to DB', res);
           }).catch(err => {console.log(err)});
    }
  }
)(App);

export default TrackedApp;
