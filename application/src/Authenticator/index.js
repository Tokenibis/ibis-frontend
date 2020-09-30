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
import {
    GoogleLoginButton,
    FacebookLoginButton,
    createButton,
} from "react-social-login-buttons";
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/KeyboardBackspace';
import StudentIcon from '@material-ui/icons/School';
import OrganizationIcon from '@material-ui/icons/StoreOutlined';
import PersonIcon from '@material-ui/icons/PeopleOutlined';
import axios from "axios";

import { IbisProvider } from '../Context'
import { IbisConsumer } from '../Context';

import IbisIcon from '../__Common__/IbisIcon';
import UserAgreement from '../__Common__/UserAgreement'

const styles = theme => ({
    img: {
	width: '100%',
	minHeight: '100%',
	margin: '0 auto',
	filter: "brightness(50%)",
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	zIndex: -2,
    },
    icon: {
	color: 'white',
	height: 60,
	width: 60,
	paddingBottom: theme.spacing(1),
    },
    back: {
	color: 'white',
	height: 60,
	width: 60,
    },
    welcome: {
	fontSize: 26,
	color: 'white',
	paddingBottom: theme.spacing(1),
    },
    disclaimer: {
	fontSize: 16,
	color: 'white',
	paddingTop: theme.spacing(1),
	width: '80%',
    },
    button: {
	width: '80%',
    },
    orgSpacer: {
	height: theme.spacing(2),
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
	zIndex: -1,
    },
    agreementOrganization: {
	textAlign: 'center',
	color: 'white',
	position: 'fixed',
	top: '5%',
    },
    textField: {
	backgroundColor: 'white',
	width: '90%',
    },
});


const StudentSelectButton = createButton({
    icon: StudentIcon,
    text: "Student",
    activeStyle: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: 'white',
	background: "#84ab3f"
    },
    style: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: '#84ab3f',
	background: '#84ab3f',
    },
});

const OrganizationSelectButton = createButton({
    icon: OrganizationIcon,
    text: "Organization/Bot",
    activeStyle: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: '#84ab3f',
    },
    style: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: 'white',
    },
});

const OtherSelectButton = createButton({
    icon: PersonIcon,
    text: "Non-Student",
    activeStyle: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: '#84ab3f',
    },
    style: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: 'white',
    },
});

const UnmLoginButton = createButton({
    icon: StudentIcon,
    activeStyle: { background: "rgb(149, 6, 27)" },
    style: { background: "rgb(186, 10, 38)" },
    text: "Login with UNM",
});

const OrganizationLoginButton = createButton({
    icon: OrganizationIcon,
    text: "Login",
    activeStyle: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: '#84ab3f',
    },
    style: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: 'white',
    },
});

class Authenticator extends Component {

    constructor({ context }) {
	super()
	this.state = {
	    userID: null,
	    userType: '',
	    width: Math.ceil(Math.min(window.innerWidth, context.maxWindowWidth)),
	    organizationClicks: 0,
	    loginEnabled: false,
	    loginMode: '',
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

    /* retrieve the google oauth request url and redirect */
    microsoftLogin = () => {
	axios('/auth/social/microsoft/auth-server/', {
	    method: 'post',
	    withCredentials: true
	}).then(response => {
	    window.location.href = response.data.url;
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	    alert(error.response);
	})
    }

    passLogin = () => {
	axios('/ibis/login-pass/', {
	    method: 'post',
	    withCredentials: true,
	    data: {
		username: document.getElementById(`form_username`).value,
		password: document.getElementById(`form_password`).value,
	    },
	}).then(response => {
	    if ('user_id' in response.data && response.data.user_id) {
		window.location.reload()
	    } else {
		alert('Username or password not found');
		console.error(response);
	    }
	})
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
		alert(error.response.data.detail);
		this.setState({ userID: '', userType: '' });
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
	let { userID, userType, width, loginMode, loginEnabled  } = this.state;

	let url = new URL(window.location.href);
	let path = url.pathname.split('/').slice(1)

	let loginSelect = (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <IbisIcon className={classes.icon} />
	      <Typography variant="body2" className={classes.welcome}>
		Welcome to Token Ibis
	      </Typography>
	      <StudentSelectButton
		  Button
		  className={classes.button}
		  onClick={() => this.setState({ loginMode: 'student'})}
		/>
	      <OtherSelectButton
		  Button
		  className={classes.button}
		  onClick={() => this.setState({ loginMode: 'other'})}
		/>
	      <OrganizationSelectButton
		  Button
		  className={classes.button}
		  onClick={() => this.setState({ loginMode: 'organization'})}
		/>
	    </Grid>
	);

	let loginStudent = (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <UnmLoginButton className={classes.button} onClick={this.microsoftLogin}/>
	      <Typography variant="body2" className={classes.disclaimer}>
		Token Ibis Inc. is not affiliated with UNM in anyway.
		Logging in with your NetID just lets us authenticate
		you and give you more free money.
	      </Typography>
	      <IconButton>
		<BackIcon className={classes.back} onClick={() => this.setState({ loginMode: '' })}/>
	      </IconButton>
	    </Grid>
	);

	let loginOrganization  = (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <TextField
		  id="form_username"
		  required
		  defaultValue=""
 		  className={classes.textField}
		  margin="normal"
		  variant="filled"
		  fullWidth
		  label="Username"
		  onChange={() => this.setState({
		      loginEnabled: document.getElementById(`form_username`).value &&
				    document.getElementById(`form_password`).value
		  })}
	      />
	      <TextField
		  id="form_password"
		  type="password"
		  required
		  defaultValue=""
 		  className={classes.textField}
		  margin="normal"
		  variant="filled"
		  fullWidth
		  label="Password"
		  onChange={() => this.setState({
		      loginEnabled: document.getElementById(`form_username`).value &&
				    document.getElementById(`form_password`).value
		  })}
	      />
	      <div className={classes.orgSpacer}/>
	      <OrganizationLoginButton className={classes.button} onClick={this.passLogin}/>
	      <IconButton>
		<BackIcon className={classes.back} onClick={() => this.setState({ loginMode: '' })}/>
	      </IconButton>
	    </Grid>
	);

	let loginOther = (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <FacebookLoginButton className={classes.button} onClick={this.facebookLogin}/>
	      <GoogleLoginButton className={classes.button} onClick={this.googleLogin}/>
	      <Typography variant="body2" className={classes.disclaimer}>
		If you are a (UNM) student, please go back and login
		with your NetID. By logging in with Facebook or Google,
		you will not receive the full weekly UBP payout.
	      </Typography>
	      <IconButton>
		<BackIcon className={classes.back} onClick={() => this.setState({ loginMode: '' })}/>
	      </IconButton>
	    </Grid>
	);

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
		  className={classes.img}
		      alt="construction"
		      src={require('../Static/Images/splash.jpg')}
		  />
		  <div
		      style={{
			  width: width,
			  margin: '0 auto',
			  position: 'fixed',
			  top: `${window.innerHeight < 500 ? 40 : Math.min(60, Math.round(window.innerWidth/window.innerHeight*100))}%`,
			  left: '50%',
			  transform: 'translate(-50%, -50%)',
		      }}
		      className={classes.content}
		  >
		    {loginMode === '' ? (
			loginSelect
		    ):(
			loginMode === 'student' ? (
			    loginStudent
			):(
			    loginMode === 'organization' ? (
				loginOrganization
			    ):(
				loginOther
			    )
			)
		    )}
		  </div>
		  {loginMode !== '' && (
		      <Typography 
			  variant="body2"
			  style={{ width: width * 0.7 }}
			  className={classes.agreement}
			  >
			<UserAgreement/>
		      </Typography>
		  )}
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

