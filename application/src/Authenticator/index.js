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
	axios('https://api.tokenibis.org/auth/social/google/auth-server/', {
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
	axios('https://api.tokenibis.org/auth/social/facebook/auth-server/', {
	    method: 'post',
	    withCredentials: true
	}).then(response => {
	    window.location.href = response.data.url;
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	})
    }

    render() {

	// extract oauth parameters from url if available
	let url = new URL(window.location.href);
	let code = url.searchParams.get('code');
	let state = url.searchParams.get('state');
	window.history.replaceState({}, document.title, "/");

	// attempt to authenticate with django
	if (code != null && state != null) {
	    axios('https://api.tokenibis.org/auth/social/facebook/login/', {
		method: 'post',
		data: {
		    code: code,
		    state: state
		},
		withCredentials: true
	    }).then(response => {
		if ('data' in response && 'key' in response.data) {
		    return axios('https://api.tokenibis.org/ibis/login/', {
			method: 'post',
			withCredentials: true
		    });
		} else {
		    console.error('Did not receive data or key in social auth response');
		    console.error(response);
		}
	    }).then(response => {
		if ('user_id' in response.data) {
		    this.props.authenticate(response.data.user_id);
		} else {
		    console.error('Did not receive ibis user id in login response');
		    console.error(response);
		}
	    }).catch(error => {
		console.error(error);
		console.error(error.response);
	    })
	} 

	return (
	    <div>
	      <FacebookLoginButton onClick={this.facebookLogin}/>
	    </div>
	);
    }
}

export default Authenticator;
