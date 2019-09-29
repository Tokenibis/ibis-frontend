import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const config = require('../../config.json');

const styles = theme => ({
    warning: {
	color: theme.palette.tertiary.main,
	fontWeight: 'bold',
	width: '90%',
	paddingTop: theme.spacing(2),
    },
    paypalWrapper: {
	paddingTop: theme.spacing(2),
	width: '90%',
    },
    paypal: {
	paddingTop: theme.spacing(2),
	width: '90%',
    },
});

class Bank extends Component {

    state = {
	sdkLoaded: false,
    };

    componentDidMount() {
	this.fetchPaypalSDK();
    }

    fetchPaypalSDK() {
	let clientID = config.payments.paypal.use_sandbox ?
		   config.payments.paypal.sandbox.client_id :
		   config.payments.paypal.live.client_id

	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}&currency=USD`;
	script.async = true;
	script.onload = () => { this.setState({ sdkLoaded: true })};
	script.onerror = (e) => { console.error(e) };
	document.body.appendChild(script);
    };

    updateServer(orderID) {
	axios('https://api.tokenibis.org/ibis/payment/', {
	    method: 'post',
	    withCredentials: true,
	    data: { orderID },
	}).then(response => {
	    console.log(response.data)
	    if (response.data.depositID) {
		alert('Transaction completed!');
	    } else {
		alert('Uh-oh, something went wrong');
	    }
	}).catch(error => {
	    alert('Something went wrong...');
	    console.log(error);
	    console.log(error.response);
	})
    }

    render() {
	let { classes, context } = this.props
	let { sdkLoaded } = this.state;

	let paypalButton;

	if (sdkLoaded) {
	    let PaypalButton = window.paypal.Buttons.driver('react', {
	       React,
	       ReactDOM,
	    });
	    paypalButton = (
		<PaypalButton
		    className={classes.paypal}
		    createOrder={ (data, actions) => {
			return actions.order.create({
			    purchase_units: [{
				amount: {
				    value: '10.00',
				},
				custom_id: context.userID,
			    }],
			    application_context: {
				shipping_preference: 'NO_SHIPPING',
			    },
			});
		    }}
		    onApprove={ (data, actions) => {
			console.log(data)
			return actions.order.capture().then((details) => {
			    console.log(details);
			    this.updateServer(data.orderID);
			});
		    }}
		    
		/>
	    );
	} else {
	    paypalButton = (
		<CircularProgress className={classes.progress} />
	    );
	}

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <Typography className={classes.warning} variant="body2">
		WARNING! Ibis is currently in testing. Please do not try to send money to use at this time.
	      </Typography>
	      {paypalButton}
	    </Grid>
	);
    };
};

export default withStyles(styles)(Bank);
