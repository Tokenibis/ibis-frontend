/* Implement logic for authentication with the django API backend. The
   authenticator component expects a "authenticate" prop from its
   parent in order to pass back the authentication token, which should
   be subsequently used for all further interactions with the API.  */

import React, { Component } from 'react';
import axios from "axios";
import { GoogleLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

class Authenticator extends Component {

    /* retrieve the google oauth request url and redirect */
    googleLogin = () => {
	axios('http://localhost:8000/auth/social/google/auth-server/', {
	    method: 'post',
	    withCredentials: true
	}).then(response => {
	    window.location.href = response.data.url;
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	})
    }

    /* retrieve the facebook oauth request url and redirect */
    facebookLogin = () => {
	alert('implement me!');
    }

    render() {

	// extract oauth parameters from url if available
	let url = new URL(window.location.href);
	let code = url.searchParams.get('code');
	let state = url.searchParams.get('state');
	window.history.replaceState({}, document.title, "/");

	// attempt to authenticate with django
	if (code != null && state != null) {
	    axios('http://localhost:8000/auth/social/google/login/', {
		method: 'post',
		data: {
		    code: code,
		    state: state
		},
		withCredentials: true
	    }).then(response => {
		if ('data' in response && 'key' in response.data) {
		    this.props.authenticate(response.data.key);
		}
	    }).catch(error => {
		console.log(error);
		console.log(error.response);
	    })
	} 

	return (
	    <div>
	      <GoogleLoginButton onClick={this.googleLogin}/>
	      <FacebookLoginButton onClick={this.facebookLogin}/>
	    </div>
	);
    }
}

export default Authenticator;
