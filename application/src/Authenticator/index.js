/*

   Implement logic for authentication with the django API backend. The
   authenticator component sits between App.js and Content.js, acting
   as a sort of gate-keeper to ensure authentication is properly
   performed before displaying anything else.

   The logic is a little bit messy because it needs to handle social
   authentication. Roughly speaking, the intended workflow is as
   follows for a brand new login:

   1. Query the /ibis/identify to determine the current user. If
   recognized (based on cached authentication), then proceed to the
   content. Otherwise, initiate the login splashcreen.

   2. Once the user clicks a social login option, intiate the Oauth
   process with the social login site.

   3. If everything goes well, the social login site redirects back to
   the app with a 'redirect' element in the url path. If so, take the
   Oauth artifacts and post them to the ibis api social login endpoint
   to complete Oauth.

   4. If that goes well, then post to the ibis api login endpoint to
   actually login (or create a user, if this is the first time).

   5. Proceed to the content.

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { GoogleLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";

import { IbisProvider } from '../Context'
import { IbisConsumer } from '../Context';

import IbisIcon from '../__Common__/IbisIcon';
import UserAgreement from '../__Common__/UserAgreement'

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
    progressWrapper: {
	paddingTop: theme.spacing(10),
	display: 'flex',
	justifyContent: 'center'
    },
    agreement: {
	textAlign: 'center',
	color: 'white',
	position: 'fixed',
	bottom: '5%',
    },
});

class Authenticator extends Component {

    constructor({ context }) {
	super()
	this.state = {
	    userID: null,
	    userType: '',
	    width: Math.ceil(Math.min(window.innerWidth, context.maxWindowWidth)),
	    anonClicks: 0,
	};
    };

    resizeImage = () => {
	let { context } = this.props;
	this.setState({
	    width: Math.ceil(Math.min(window.innerWidth, context.maxWindowWidth)),
	});
    };


    /* retrieve the facebook oauth request url and redirect */
    facebookLogin = () => {
	axios('/auth/social/facebook/auth-server/', {
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
	axios('/auth/social/google/auth-server/', {
	    method: 'post',
	    withCredentials: true
	}).then(response => {
	    window.location.href = response.data.url;
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	})
    }

    anonLogin = () => {
	let { anonClicks } = this.state;

	if (anonClicks >= 2) {
	    this.setState({ anonClicks: 0 })
	    axios('/ibis/login-anon/', {
		method: 'post',
		withCredentials: true
	    }).then(response => {
		if ('user_id' in response.data) {
		    this.setState({
			userID: response.data.user_id,
			userType: response.data.user_type,
		    });
		} else {
		    console.error('Did not receive ibis user id in login response');
		    console.error(response);
		}
	    })
	} else {
	    this.setState({ anonClicks: anonClicks + 1 });
	}
    }

    /* flag app the user as unauthenticated and clear the token */
    logout = () => {
	axios('/ibis/logout/', {
	    method: 'post',
	    withCredentials: true
	}).then(response => {
	    this.setState({ userID: '', userType: '' });
	}).catch(error => {
	    console.log(error);
	    this.setState({ userID: '', userType: '' });
	})
    };

    componentDidMount() {

	let url = new URL(window.location.href);
	let path = url.pathname.split('/').slice(1)

	if (path[0] === 'redirect') {
	    window.history.replaceState({}, document.title, "/");
	    let code = url.searchParams.get('code');
	    let state = url.searchParams.get('state');

	    axios(`/auth/social/${path[1]}/login/`, {
		method: 'post',
		data: {
		    code: code,
		    state: state
		},
		withCredentials: true
	    }).then(response => {
		if ('data' in response && 'key' in response.data) {
		    return axios('/ibis/login/', {
			method: 'post',
			withCredentials: true
		    });
		} else {
		    console.error('Did not receive data or key in social auth response');
		    console.error(response);
		}
	    }).then(response => {
		if ('user_id' in response.data) {
		    this.setState({
			userID: response.data.user_id,
			userType: response.data.user_type
		    });
		} else {
		    console.error('Did not receive ibis user id in login response');
		    console.error(response);
		}
	    }).catch(error => {
		console.error(error);
		console.error(error.response);
	    })
	} else {
	    axios('/ibis/identify/', {
		withCredentials: true
	    }).then(response => {
		this.setState({
		    userID: response.data.user_id,
		    userType: response.data.user_type,
		});
	    }).catch(error => {
		console.log(error);
		this.setState({ userID: '', userType: '' });
	    })
	}
    };

    render() {

	let { classes, children, context } = this.props;
	let { userID, userType, width  } = this.state;

	let url = new URL(window.location.href);
	let path = url.pathname.split('/').slice(1)

	if (userID) {
	    // app has successfully authenticated
	    return (
		<IbisProvider value={{
		    userID,
		    userType,
		    logout: this.logout,
		    ...context,
		}}>
		  {children}
		</IbisProvider>
	    );
	} else if (userID === '' && path[0] !== 'redirect') {
	    // app has identified that no user is logged in and not redirecting
	    window.addEventListener('resize', this.resizeImage);
	    return (
  		<Grid container direction="column" justify="center" alignItems="center" >
		  <img
		      style={{
			  width: '100%',
			  minHeight: '100%',
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
			  top: `${window.innerHeight < 460 ? 40 : Math.min(60, Math.round(window.innerWidth/window.innerHeight*100))}%`,
			  left: '50%',
			  transform: 'translate(-50%, -50%)',
		      }}
		      className={classes.content}
		  >
  		    <Grid container direction="column" justify="center" alignItems="center" >
		      <IbisIcon
			  className={classes.icon}
		          onClick={() => this.anonLogin()}
		      />
		      <Typography variant="body2" className={classes.welcome}>
			Welcome to ibis
		      </Typography>
		      <FacebookLoginButton className={classes.facebook} onClick={this.facebookLogin}/>
		      <GoogleLoginButton className={classes.google} onClick={this.googleLogin}/>
		    </Grid>
		  </div>
		  <Typography 
		    variant="body2"
		    style={{ width: width * 0.7 }}
		    className={classes.agreement}
		  >
		    <UserAgreement/>
		  </Typography>
		</Grid>
	    );
	} else {
	    // app is between api calls
	    return (
		<div className={classes.progressWrapper}>
		  <CircularProgress />
		</div>
	    );
	}
    };
};

Authenticator.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
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

