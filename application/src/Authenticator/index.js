/*

   Implement logic for authentication with the django API backend. The
   authenticator component expects a "authenticate" prop from its
   parent in order to pass back the authentication token, which should
   be subsequently used for all further interactions with the API.
   
   The component returns a loading splash screen while it is trying to
   decide whether the user has authentication. Depending on the
   results, it either provides App.js the userID to proceed to the
   content or it displays the login screen.

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GoogleLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

class Authenticator extends Component {

    constructor() {
	super()
	this.state = {
	    checkedAuth: false,
	};
    };

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

	let { authenticate } = this.props;
	let { checkedAuth } = this.state;

	// this block triggers while we are checking authentication status
	if (!checkedAuth) {
	    // see if user is already authenticated
	    axios('https://api.tokenibis.org/ibis/identify/', {
		withCredentials: true
	    }).then(response => {
		if (response.data.user_id !== '') {
		    authenticate(response.data.user_id);
		} else {
		    this.setState({ checkedAuth: true });
		}
	    }).catch(error => {
		this.setState({ userID: '' });
		console.log(error);
		this.setState({ checkedAuth: true });
	    })
	    return null;
	}

	// if we've gotten this far, that means that we need to login

	// attempt to extract oauth code and state
	let url = new URL(window.location.href);
	let code = url.searchParams.get('code');
	let state = url.searchParams.get('state');
	window.history.replaceState({}, document.title, "/");

	// attempt to authenticate with django
	if (/* TODO: make sure url path == '/' */code != null && state != null) {
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
		    authenticate(response.data.user_id);
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
    };
};

Authenticator.propTypes = {
    authenticate: PropTypes.func.isRequired,
};

export default Authenticator;
