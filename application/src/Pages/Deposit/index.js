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
import GiftIcon from '@material-ui/icons/CakeOutlined';
import Checkbox from '@material-ui/core/Checkbox';
import axios from "axios";

import Popup from '../../__Common__/Popup';
import QueryHelper from '../../__Common__/QueryHelper';
import ListView from '../../__Common__/ListView';
import CustomDate, { PreciseVal } from '../../__Common__/CustomDate';
import CustomMarkdown from '../../__Common__/CustomMarkdown';
import IbisIcon from '../../__Common__/IbisIcon';
import PaypalIcon from '../../__Common__/PaypalIcon';

const config = require('../../__config__.json');

const styles = theme => ({
    root: {
	width: '100%',
    },
    content: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	width: '80%',
    },
    info: {
	marginTop: theme.spacing(-0.5),
    },
    progressWrapper: {
	padding: theme.spacing(3),
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
    readme: {
	textAlign: 'center',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
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
    checkBox: {
	paddingTop: theme.spacing(2),
    },
    dialogInner: {
	padding: theme.spacing(2),
	textAlign: 'center',
    },
    label: {
	paddingTop: theme.spacing(2),
	paddingRight: theme.spacing(2),
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    fine: {
	paddingTop: theme.spacing(2),
	fontSize: '12px',
	color: theme.palette.tertiary.main,
    },
    min: {
	fontSize: '12px',
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
    buttonActive: {
	width: '80%',
    },
    buttonDisabled: {
	width: '80%',
	pointerEvents: 'none',
	opacity: '50%',
    },
    buttonOrdering: {
	width: '80%',
	display: 'none',
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
    paypalWrapper: {
	width: '100%',
	textAlign: 'center',
	paddingBottom: theme.spacing(3),
    },
    bottom: {
	height: theme.spacing(5),
    },
});

const DEFAULT_COUNT = 25;

const FEE_FIXED = 49;

const FEE_PERCENT = 0.0199;

const MAX_AMOUNT = 100000;

const MIN_AMOUNT = 1000;

const message = `## Payment Guide

### Where is my money going?

By making a deposit on this page, you will be exchanging real money
(from your credit card, Paypal, etc) in exchange for donable ibis
tokens on the app.

### Are you sure this is safe?

Yes! Token Ibis does not store your actual payment information at any
__ever__. The entire workflow goes through _Paypal_, so you can feel
safe making this payment as long as you trust them.

### Can anybody else see this deposit?

The details will not appear on app, but by making a donation
here, you are agreeing to be recognized on various Token Ibis
donor gratitude materials.

### What is this fee?

Token Ibis collects zero fees. However, all credit card rewards
have a hidden fee that's usually silently charged to the vendor; in
this case, the fee goes to _Paypal_. Please note that similar charges
apply no matter where you make your online donation, so going through
Ibis _does not_ add any more fees to the processes. If you would like
to put money into your account without any fees at all, please get in
contact with us and we will be happy to arrange for a donation via
physical check or money transfer.

### Something went wrong, what do I do?

No need to panic. The most likely explanation is either a temporary
network hiccup or a bug in our code. Assuming that Paypal engineers
know what they're doing, your money is either in our bank account or
still in yours. Please get in contact at __info@tokenibis.org__ to let
us know about the bug and so that we can credit your balance as
necessary.`;

const query = loader('../../Static/graphql/app/DepositList.gql')

const query_balance = loader('../../Static/graphql/app/Finance.gql')

class DepositList extends Component {

    makeImage = (node) => {
	let { classes } = this.props;
	switch (node.category.title) {
	    case 'paypal':
		return <PaypalIcon className={classes.icon} />
	    case 'ubp':
		return <GiftIcon className={classes.icon} />
	    default:
		return <IbisIcon className={classes.icon} />
	}
    };

    makeLabel = (node) => {
	let { classes } = this.props;

	return (
	    <div>
	      <Typography variant="body2" className={classes.title}>
		<span className={classes.amount}>{`$${(node.amount/100).toFixed(2)}`} - </span>
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
	let { classes, context, count } = this.props;

	count = count ? count: DEFAULT_COUNT

	let make = (data) => (
	    <ListView
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		data={data}
	    />
	);

	let variables = {
	    user: context.userID,
	    orderBy: "-created",
	    first: count,
	}

	return (
	    <div className={classes.root}>
	      <QueryHelper
		  query={query}
		  variables={variables}
		  make={make}
		  scroll="infinite"
	      />
	    </div>
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
	checked: true,
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
	script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}&disable-funding=credit,card&currency=USD`;
	script.async = true;
	script.onload = () => { this.setState({ sdkLoaded: true })};
	script.onerror = (e) => { console.error(e) };
	document.body.appendChild(script);
    };

    updateServer(orderID) {
	let { numDeposits } = this.state;

	axios('/distribution/payment/', {
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
	let { ordering } = this.state;

	if (ordering) {
	    window.onbeforeunload = () => true
	} else {
	    window.onbeforeunload = undefined
	}
    }

    render() {
	let { classes, context } = this.props
	let {
	    sdkLoaded,
	    ordering,
	    enableDeposit,
	    amount,
	    numDeposits,
	    dialog,
	    checked
	} = this.state;

	let amount_final = amount;
	if (checked) {
	    amount_final = (Math.round((amount * 100 + FEE_FIXED) / (1 - FEE_PERCENT)) / 100).toFixed(2);
	}

	let paypalButton = <div></div>;
	if (sdkLoaded) {
	    let PaypalButton = window.paypal.Buttons.driver('react', {
	       React,
	       ReactDOM,
	    });
	    paypalButton = (
		<div
		    className={(sdkLoaded && enableDeposit) ? (
			ordering ? (
			    classes.buttonOrdering
			):(
			    classes.buttonActive
			)
		    ):(
			classes.buttonDisabled
		    )}
		>
		  <PaypalButton
		      createOrder={ (data, actions) => {
			  this.setState({ ordering: true });
			  return actions.order.create({
			      purchase_units: [{
				  amount: {
				      value: amount_final.toString(),
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
			      this.updateServer(data.orderID);
			  });
		      }}
		      onCancel={ () => {this.setState({ ordering: false })}}
		  />
		</div>
	    );
	}

	return (
	    <React.Fragment>
	      <Prompt
		  when={ordering}
		  message='Wait! Leaving may interrupt the deposit process. Are you sure you want to continue?'
	      />
  	      <Grid container direction="column" justify="center" alignItems="center" >
		<Dialog
		    open={!!dialog}
		    onClose={() => window.location.reload()}
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
			<div>
			  <Popup wide message={message}>
			    <Typography variant="body2" className={classes.readme} >
			      Read me
			    </Typography>
			  </Popup>
			</div>
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
			       if (error) return `Error! ${error.message}`; return (
				   <Typography variant="body2" className={classes.balance}>
				     ${(data.user.balance/100).toFixed(2)}
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
			<Typography variant="body2" className={classes.min}>
			  Min $10.00
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
		      <Grid item xs={4}>
			<Typography variant="body2" className={classes.label}>
			  Cover Our Fees?
			</Typography>
		      </Grid>
		      <Grid item xs={2}>
			<Checkbox
			    className={classes.checkBox}
			    color="secondary"
			    checked={checked}
			    onClick={() => {this.setState({ checked: !checked })}}
			    value="primary"
			    inputProps={{ 'aria-label': 'primary checkbox' }}
			/>
		      </Grid>
		      <Grid item xs={6}>
			<Typography variant="body2" className={classes.fine}>
			  This is the standard Paypal processing fee.
			</Typography>
		      </Grid>
		    </Grid>
		    <div className={classes.paypalWrapper}>
  		      <Grid container direction="column" justify="center" alignItems="center" >
			{paypalButton}
		      </Grid>
		    </div>
		    {(!sdkLoaded || ordering) &&
			<div className={classes.progressWrapper}>
			  <CircularProgress/>
			</div>
		    }
		  </Grid>
		</Card>
		<Typography variant="button" className={classes.heading} >
		  Deposit History
		</Typography>
	      </Grid>
	      <DepositList classes={classes} context={context} numDeposits={numDeposits}/>
	      <Grid item xs={12}><div className={classes.bottom} /></Grid>
	    </React.Fragment>

	);
    };
};

export default withStyles(styles)(Deposit);
