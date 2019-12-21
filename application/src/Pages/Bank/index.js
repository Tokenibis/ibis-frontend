import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { loader } from 'graphql.macro';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const config = require('../../config.json');

const styles = theme => ({
    heading: {
	fontSize: '18px',
	color: theme.palette.tertiary.main,
	paddingLeft: theme.spacing(1),
	width: '90%',
	textAlign: 'left',
    },
    warning: {
	color: theme.palette.tertiary.main,
	fontWeight: 'bold',
	width: '90%',
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
    },
    paypal: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	width: '100%',
    },
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
});

const DEFAULT_COUNT = 25;

const query = loader('../../GraphQL/DepositList.gql')

class DepositList extends Component {

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
	      <Typography variant="body2" className={classes.title}>
		{`$${(node.amount/100).toFixed(2)}`} - {new Date(node.created).toDateString()}
	      </Typography>
	    </div>
	);
    }

    render() {
	let { context, variant, filterValue, count } = this.props;

	let make = (data) => (
	    <ListView
		scrollButton
		makeLabel={this.makeLabel}
		data={data}
	    {...this.props}
	    />
	);

	let variables = {
	    byUser: context.userID,
	    orderBy: "-created",
	    first: DEFAULT_COUNT,
	}

	return (
	    <QueryHelper
		query={query}
		variables={variables}
		make={make}
		infiniteScroll={true}
	    {...this.props}
	    />
	);
    };
};

DepositList.propTypes = {
    classes: PropTypes.object.isRequired,
};

class Bank extends Component {

    state = {
	sdkLoaded: false,
	ordering: false,
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
	    this.setState({ ordering: false });
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
	let { sdkLoaded, ordering } = this.state;

	let paypalButton;

	if (sdkLoaded && !ordering) {
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
			    this.setState({ ordering: true} );
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
	    <div>
  	      <Grid container direction="column" justify="center" alignItems="center" >
		<Typography className={classes.warning} variant="body2">
		  WARNING! Ibis is currently in testing. Please do not try to send money to use at this time.
		</Typography>
		{paypalButton}
		<Typography variant="button" className={classes.heading} >
		  Past Deposits
		</Typography>
	      </Grid>
	      <DepositList classes={classes} context={context}/>
	    </div>
	);
    };
};

export default withStyles(styles)(Bank);
