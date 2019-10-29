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
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { GoogleLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";
import { IbisConsumer } from '../Context';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";

import IbisIcon from '../__Common__/IbisIcon';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const styles = theme => ({
    icon: {
	color: 'white',
	height: 60,
	width: 60,
	paddingBottom: theme.spacing(1),
    },
    welcome: {
	fontSize: 32,
	color: 'white',
	paddingBottom: theme.spacing(1),
    },
    facebook: {
	width: '80%',
    },
    google: {
	width: '80%',
    },
});

class Authenticator extends Component {

    constructor({ context }) {
	super()
	this.state = {
	    checkedAuth: false,
	    width: Math.ceil(Math.min(window.innerWidth, context.maxWindowWidth)),
	};
    };

    resizeImage = () => {
	let { context } = this.props;
	this.setState({
	    width: Math.ceil(Math.min(window.innerWidth, context.maxWindowWidth)),
	});
    };

    /* retrieve the google oauth request url and redirect */
    googleLogin = () => {
	alert('Sorry, we haven\'t gotten around to implementing this yet. Please try Facebook instead')
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

    render() {

	let { authenticate, classes } = this.props;
	let { checkedAuth, height, width } = this.state;

	window.addEventListener('resize', this.resizeImage);

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
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <img
		  style={{
		      width: width,
		      margin: '0 auto',
		      filter: "brightness(60%)",
		      position: 'fixed',
		      top: '50%',
		      left: '50%',
		      transform: 'translate(-50%, -50%)',
		  }}
		  alt="construction"
		  src={require('../Static/Images/splash.jpg')}
	      />
	      <div
		  style={{
		      width: width,
		      margin: '0 auto',
		      position: 'fixed',
		      top: `${Math.min(60, Math.round(window.innerWidth/window.innerHeight*100))}%`,
		      left: '50%',
		      transform: 'translate(-50%, -50%)',
		  }}
		  className={classes.content}
	      >
  		<Grid container direction="column" justify="center" alignItems="center" >
		  <IbisIcon className={classes.icon}/>
		  <Typography variant="body2" className={classes.welcome}>
		    Welcome to ibis
		  </Typography>
		  <FacebookLoginButton className={classes.facebook} onClick={this.facebookLogin}/>
		  <GoogleLoginButton className={classes.google} onClick={this.googleLogin}/>
		</Grid>
	      </div>
	    </Grid>
	);
    };
};

Authenticator.propTypes = {
    authenticate: PropTypes.func.isRequired,
};

function AuthenticatorWrapper(props) {
    return (
	<IbisConsumer>
	  {context => (
	      <Authenticator context={context} {...props}/>
	  )}
	</IbisConsumer> 
    );
}


export default withStyles(styles)(AuthenticatorWrapper);

