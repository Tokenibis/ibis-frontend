import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Prompt } from 'react-router'
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dialog from '@material-ui/core/Dialog';
import DepositIcon from '@material-ui/icons/SwapHoriz';
import axios from "axios";

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import CustomDate, { PreciseVal } from '../__Common__/CustomDate';
import CustomMarkdown from '../__Common__/CustomMarkdown';
import IbisIcon from '../../__Common__/IbisIcon';

const config = require('../../config.json');

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	width: '80%',
    },
    progressWrapper: {
	paddingBottom: theme.spacing(5),
    },
    balanceProgress: {
	marginTop: theme.spacing(2.5),
    },
    balance: {
	paddingTop: theme.spacing(2),
	color: theme.palette.tertiary.main,
    },
    headingTitle: {
	paddingTop: theme.spacing(2),
	textAlign: 'center',
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    heading: {
	fontSize: '18px',
	color: theme.palette.tertiary.main,
	paddingLeft: theme.spacing(1),
	width: '90%',
	textAlign: 'left',
    },
    card: {
	width: '100%',
	backgroundColor: theme.palette.lightBackground.main,
	marginBottom: theme.spacing(3),
    },
    dialogInner: {
	padding: theme.spacing(2),
	textAlign: 'center',
    },
    label: {
	paddingTop: theme.spacing(2),
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    icon: {
	color: theme.palette.primary.main,
    },
    warning: {
	color: theme.palette.tertiary.main,
	fontWeight: 'bold',
	width: '90%',
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
    },
    fine: {
	fontSize: '12px',
	color: theme.palette.tertiary.main,
    },
    button: {
	width: '80%',
    },
    buttonDisabled: {
	width: '80%',
	pointerEvents: 'none',
	opacity: '50%',
    },
    title: {
	color: theme.palette.primary.main,
    },
    amount: {
	fontWeight: 'bold',
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
});

const DEFAULT_COUNT = 25;

const MAX_AMOUNT = 100000;

const MIN_AMOUNT = 500;

const query = loader('../../Static/graphql/operations/DepositList.gql')

const query_balance = loader('../../Static/graphql/operations/Deposit.gql')

class DepositList extends Component {

    makeImage = (node) => {
	let { classes } = this.props;
	if (node.paymentId.split(':')[0] === 'paypal') {
	    return <DepositIcon className={classes.icon} />
	} else {
	    return <IbisIcon className={classes.icon} />
	}
    };

    makeLabel = (node) => {
	let { classes } = this.props;

	let amount = node.amount;
	if (node.paymentId.split(':')[0] === 'paypal') {
	    amount += parseInt(node.paymentId.split(':')[1]);
	}

	return (
	    <div>
	      <Typography variant="body2" className={classes.title}>
		<span className={classes.amount}>{`$${(amount/100).toFixed(2)}`} - </span>
		<CustomDate variant={PreciseVal} date={node.created} />
	      </Typography>
	    </div>
	);
    };

    shouldComponentUpdate(nextProps, nextState) {
	let { numDeposits } = this.props;
	return numDeposits !== nextProps.numDeposits
    };

    render() {
	let { context, count } = this.props;

	count = count ? count: DEFAULT_COUNT

	let make = (data) => (
	    <ListView
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		data={data}
	    />
	);

	let variables = {
	    byUser: context.userID,
	    orderBy: "-created",
	    first: count,
	}

	return (
	    <QueryHelper
		query={query}
		variables={variables}
		make={make}
		infiniteScroll={true}
	    />
	);
    };
};

DepositList.propTypes = {
    classes: PropTypes.object.isRequired,
};

class Deposit extends Component {

    state = {
	sdkLoaded: false,
	ordering: false,
	amount: '0.00',
	enableDeposit: false,
	numDeposits: 0,
	dialog: '',
    };

    handleKeyPressAmount(event) {
	if (!/^\d+$/.test(event.key)) {
	    event.preventDefault();
	}
    }

    handleChangeAmount() {
	let value = document.getElementById('deposit_amount').value;

	// handle negatives 
	if (!isNaN(value) && Number(value) <= 0) {
	    value = '0';
	}

	// reformat anything that isn't a positive integer
	if (!/^\d+$/.test(value)) {
	    value = (value.replace(/[^\d]/g, '')/100);
	}

	// handle numbers that are out of range
	if (!isNaN(value) && Number(value) > MAX_AMOUNT / 100) {
	    value = MAX_AMOUNT / 100;
	}

	let enableDeposit = Number(value) >= MIN_AMOUNT / 100;
	this.setState({ enableDeposit, amount: parseFloat(value).toFixed(2)});
    }

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
	let { numDeposits } = this.state;

	axios('/ibis/payment/', {
	    method: 'post',
	    withCredentials: true,
	    data: { orderID },
	}).then(response => {
	    this.setState({
		ordering: false,
		amount: '0.00',
		enableDeposit: false,
		numDeposits: numDeposits + 1,
	    });
	    if (response.data.depositID) {
		this.setState({ dialog: '__Deposit successful.__ Thanks, have fun changing the world!' });
	    } else {
	    alert('Uh-oh. Something went wrong. This can happen if your connection was interrupted mid-payment. Please check your (normal) payment history and Ibis deposits to make sure they match up. If not, then email info@tokenibis.org');
	    }
	}).catch(error => {
	    alert('Uh-oh. Something went wrong. This can happen if your connection was interrupted mid-payment. Please check your (normal) payment history and Ibis deposits to make sure they match up. If not, then email info@tokenibis.org');
	    console.log(error);
	    console.log(error.response);
	})
    }

    componentDidUpdate = () => {
	let { enableDeposit } = this.state;

	if (enableDeposit) {
	    window.onbeforeunload = () => true
	} else {
	    window.onbeforeunload = undefined
	}
    }

    render() {
	let { classes, context } = this.props
	let { sdkLoaded, ordering, enableDeposit, amount, numDeposits, dialog } = this.state;

	let paypalButton;

	if (sdkLoaded && !ordering) {
	    let PaypalButton = window.paypal.Buttons.driver('react', {
	       React,
	       ReactDOM,
	    });
	    paypalButton = (
		<div
		    className={enableDeposit ? classes.button : classes.buttonDisabled}
		>
		  <PaypalButton
		      createOrder={ (data, actions) => {
			  return actions.order.create({
			      purchase_units: [{
				  amount: {
				      value: amount.toString(),
				  },
				  custom_id: context.userID,
			      }],
			      application_context: {
				  shipping_preference: 'NO_SHIPPING',
			      },
			  });
		      }}
		      onApprove={ (data, actions) => {
			  return actions.order.capture().then((details) => {
			      this.setState({ ordering: true });
			      this.updateServer(data.orderID);
			  });
		      }}
		  />
		</div>
	    );
	} else {
	    paypalButton = (
		<div className={classes.progressWrapper}>
		  <CircularProgress/>
		</div>
	    );
	}

	return (
	    <React.Fragment>
	      <Prompt
		  when={enableDeposit}
		  message='Wait! Leaving may interrupt the deposit process. Are you sure you want to continue?'
	      />
  	      <Grid container direction="column" justify="center" alignItems="center" >
		<Dialog
		    open={dialog}
		    onClose={() => this.setState({ dialog: ''})}
		>
		  <div className={classes.dialogInner}>
		    <CustomMarkdown noLink source={dialog}/>
		  </div>
		</Dialog>
		<Card raised className={classes.card}>
  		  <Grid container direction="column" justify="center" alignItems="center" >
		    <Grid container className={classes.content}>
		      <Grid item xs={12} style={{ textAlign: 'center'}}>
			<Typography variant="h6" className={classes.headingTitle} >
			  Make Deposit
			</Typography>
		      </Grid>
		      <Grid item xs={4}>
			<Typography variant="body2" className={classes.label}>
			  Balance
			</Typography>
		      </Grid>
		      <Grid item xs={8}>
			{!ordering && 
			 <Query
			     fetchPolicy="no-cache"
			     query={query_balance}
			     variables={{ id: context.userID }}
			     >
			   {({ loading, error, data, refetch }) => {
			       if (loading) return (
				   <CircularProgress size={10} className={classes.balanceProgress}/>
			       )
			       if (error) return `Error! ${error.message}`;
			       return (
				   <Typography variant="body2" className={classes.balance}>
				     ${(data.person.balance/100).toFixed(2)}
				   </Typography>
			       )
			   }}
			 </Query>
			}
		      </Grid>
		      <Grid item xs={4}>
			<Typography variant="body2" className={classes.label}>
			  Amount
			</Typography>
		      </Grid>
		      <Grid item xs={8}>
			<TextField
			    id="deposit_amount"
			    autoFocus
			    required
 			    className={classes.textField}
			    margin="normal"
			    variant="outlined"
			    fullWidth
			    value={amount}
			    onKeyPress={(e) => this.handleKeyPressAmount(e)}
			    onChange={() => this.handleChangeAmount()}
			    type="number"
			    InputProps={{
				startAdornment: <InputAdornment position="start">$</InputAdornment>,
			    }}
			/>
		      </Grid>
		      <Grid item xs={12}>
			<Typography variant="body2" className={classes.fine}>
			  * $5.00 minimum charge. The credit card processing fee (which is charged by Paypal and, as far as we can tell, standard for all online donations) will be deducted from this total.
			</Typography>
		      </Grid>
		    </Grid>
		    {paypalButton}
		  </Grid>
		</Card>
		<Typography variant="button" className={classes.heading} >
		  Deposit History
		</Typography>
	      </Grid>
	      <DepositList classes={classes} context={context} numDeposits={numDeposits}/>
	    </React.Fragment>

	);
    };
};

export default withStyles(styles)(Deposit);
