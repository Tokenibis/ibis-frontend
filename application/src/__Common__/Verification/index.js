import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask';
import { withRouter } from "react-router-dom";
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import axios from "axios";

import Link from '../../__Common__/CustomLink';
import CustomMarkdown from '../../__Common__/CustomMarkdown';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(2),
	width: '90%',
    },
    actionOnly: {
	width: '100%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
    },
    actionForward: {
	width: '100%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
    },
    actionBackward: {
	width: '100%',
	backgroundColor: theme.palette.secondary.main,
	color: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
    },
    message: {
	paddingRight: theme.spacing(1),
	paddingLeft: theme.spacing(1),
    },
    buttonWrapper: {
	paddingTop: theme.spacing(2),
    },
    forwardWrapper: {
	paddingTop: theme.spacing(2),
	paddingLeft: theme.spacing(1),
    },
    backwardWrapper: {
	paddingTop: theme.spacing(2),
	paddingRight: theme.spacing(1),
    },
    textField: {
	'& .MuiOutlinedInput-root': {
	    'color': theme.palette.tertiary.main,
	    '& inputMultiline': {
		borderColor: theme.palette.tertiary.main,
	    },
	    '& fieldset': {
		borderColor: theme.palette.tertiary.main,
	    },
	    '&:hover fieldset': {
		borderColor: theme.palette.tertiary.main,
	    },
	    '&.Mui-focused fieldset': {
		borderColor: theme.palette.tertiary.main,
	    },
	},
    },
    action: {
	textAlign: 'center',
    },
    fine: {
	fontSize: '12px',
	color: 'red',
    },
    dialogPaper: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	width: '70%',
    },
});

const LENGTH_NUMBER = 10
const LENGTH_CODE = 6

const alertError = 'Oops, something went wrong. Please try again or contact info@tokenibis.org for help'

const messageNumber = `
## Verify Your Phone Number

In order to keep receiving weekly donation money, please enter a valid
phone number. We will only use it to send a one-time verification code
to ensure you are a real person. Thank you!

If you are unable to do this, please email us at
__info@tokenibis.org__ for other verification options.
`

const messageCode = `
Okay, we just texted you a 6-Digit verification code. Please enter it below.
`

const messageSuccess = `
Congratulations, you're all verified. Thanks for your patience and
happy donating!
`

function NumberMask(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/, /\d/, /\d/]}
      showMask
	inputmode="numeric"
	pattern="[0-9]*"
    />
  );
}

function CodeMask(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={Array(LENGTH_CODE).fill(/\d/)}
      showMask
	inputmode="numeric"
	pattern="[0-9]*"
    />
  );
}

class Verification extends Component {

    state = {
	step: 'number',
	codeError: false,
	canSubmitNumber: false,
	canSubmitCode: false,
	otherUsers: [],
	dialog: false,
    };

    handleNumber() {
	let number = document.getElementById('phone_number').value;
	number = number.replace(/[^\d]/g, '');
	this.setState({
	    canSubmitNumber: number.length === LENGTH_NUMBER,
	});
    }

    handleCode() {
	let code = document.getElementById('phone_code').value;
	code = code.replace(/[^\d]/g, '');
	this.setState({ canSubmitCode: code.length === LENGTH_CODE });
    }

    submitNumber() {
	let number = document.getElementById('phone_number').value;
	number = number.replace(/[^\d]/g, '');

	axios('/ibis/phone/number/', {
	    method: 'post',
	    withCredentials: true,
	    data: { number: '1' + number },
	}).then(response => {
	    if (response.data.success) {
		this.setState({ step: 'code' });
	    } else {
		alert(alertError);
	    }
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	    alert(alertError);
	})
    }

    submitCode() {
	let code = document.getElementById('phone_code').value;

	axios('/ibis/phone/code/', {
	    method: 'post',
	    withCredentials: true,
	    data: { code: code },
	}).then(response => {
	    if (response.data.matches && response.data.verified) {
		this.setState({ step: 'success' });
	    } else if (response.data.matches) {
		this.setState({ step: 'confirm', otherUsers: response.data.other_users });
	    } else {
		this.setState({ codeError: true });
	    }
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	    alert(alertError);
	})
    }

    submitConfirm() {

	axios('/ibis/phone/confirm/', {
	    method: 'post',
	    withCredentials: true,
	}).then(response => {
	    if (response.data.success) {
		this.setState({ step: 'success' });
	    } else {
		alert(alertError);
	    }
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	    alert(alertError);
	})
    }

    render() {
	let { classes, children, onSuccess } = this.props;
	let {
	    step,
	    valueNumber,
	    valueCode,
	    canSubmitNumber,
	    canSubmitCode,
	    codeError,
	    otherUsers,
	    dialog,
	} = this.state;

	const messageConfirm = `
This phone number is already associated with the following users:

${otherUsers.map(item => '* __@' + item[1] + '__').join('\n')}

If you prefer to stick with your other account, then please log out
and use that one instead. If you choose to proceed, you will start
receiving weekly payments to this account _instead of_ your other
ones. Would you like to proceed?
`

	let displayNumber = (
	    <Grid container className={classes.content}>
	      <Grid item xs={12}>
		<CustomMarkdown className={classes.message} source={messageNumber}/>
	      </Grid>
	      <Grid item xs={12}>
		<TextField
		    id="phone_number"
		    autoFocus
		    required
		    className={classes.textField}
		    margin="normal"
		    variant="outlined"
		    fullWidth
		    label="Phone Number"
		    onChange={() => this.handleNumber()}
		    InputProps={{
			startAdornment: <InputAdornment position="start">+1</InputAdornment>,
			inputComponent: NumberMask,
		    }}
		/>
	      </Grid>
	      <Grid item xs={12} className={classes.buttonWrapper}>
		<Button
		  disabled={!canSubmitNumber}
		  className={classes.actionOnly}
		    onClick={() => this.submitNumber()}
		>
		  Send
		</Button>
	      </Grid>
	    </Grid>
	);

	let displayCode = (
	    <Grid container className={classes.content}>
	      <Grid item xs={12}>
		<CustomMarkdown className={classes.message} source={messageCode}/>
	      </Grid>
	      <Grid item xs={12}>
		<TextField
		    id="phone_code"
		    autoFocus
		    required
		    className={classes.textField}
		    margin="normal"
		    variant="outlined"
		    fullWidth
		    label="6-Digit Code"
		    onChange={() => this.handleCode()}
		    InputProps={{
			inputComponent: CodeMask,
		    }}
		/>
		{codeError && (
		    <Typography variant="body2" className={classes.fine}>
		      That code doesn't seem to match. Try again?
		    </Typography>
		)}
	      </Grid>
	      <Grid item xs={6} className={classes.backwardWrapper}>
		<Button
		    onClick={() => this.setState({ step: 'number' })}
		    className={classes.actionBackward}
		>
		  Go Back
		</Button>
	      </Grid>
	      <Grid item xs={6} className={classes.forwardWrapper}>
		<Button
		    disabled={!canSubmitCode}
		    className={classes.actionForward}
		    onClick={() => this.submitCode()}
		>
		  Submit 
		</Button>
	      </Grid>
	    </Grid>
	);

	let displayConfirm = (
	    <Grid container className={classes.content}>
	      <Grid item xs={12}>
		<CustomMarkdown className={classes.message} source={messageConfirm}/>
	      </Grid>
	      <Grid item xs={6} className={classes.backwardWrapper}>
		<Button
		    onClick={() => this.setState({ step: 'number' })}
		    className={classes.actionBackward}
		>
		  Go Back
		</Button>
	      </Grid>
	      <Grid item xs={6} className={classes.forwardWrapper}>
		<Button
		    disabled={!canSubmitCode}
		    className={classes.actionForward}
		    onClick={() => this.submitConfirm()}
		>
		  Proceed 
		</Button>
	      </Grid>
	    </Grid>
	)

	let displaySuccess = (
	    <Grid container className={classes.content}>
	      <Grid item xs={12}>
		<CustomMarkdown className={classes.message} source={messageSuccess}/>
	      </Grid>
	      <Grid item xs={12} className={classes.buttonWrapper}>
		<Button
		    className={classes.actionOnly}
		    onClick={(e) => { this.setState({ dialog: false }); onSuccess && onSuccess(e)}}
		>
		  Close
		</Button>
	      </Grid>
	    </Grid>
	)

	return (
	    <div>
	      <Dialog
		  PaperProps={{ className: classes.dialogPaper }}
		  open={dialog}
		  onClose={() => this.setState({ dialog: false })}
	      >
  		<Grid container direction="column" justify="center" alignItems="center" >
		  {
		      step === 'number' ? (
			  displayNumber
		      ):(
			  step === 'code' ? (
			      displayCode 
			  ):(
			      step === 'confirm' ? (
				  displayConfirm 
			      ):(
				  displaySuccess
			      )
			  )
		      )
		  }
		</Grid>
	      </Dialog>
	      <div
		  onClick={() => this.setState({ dialog: true })}
	      >
		{children}
	      </div>
	    </div>
	);
    };
};

Verification.propTypes = {
    classes: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Verification));
