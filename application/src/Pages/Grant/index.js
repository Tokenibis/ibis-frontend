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
import Checkbox from '@material-ui/core/Checkbox';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import axios from "axios";

import Popup from '../../__Common__/Popup';
import QueryHelper from '../../__Common__/QueryHelper';
import ListView from '../../__Common__/ListView';
import CustomDate, { DateVal } from '../../__Common__/CustomDate';
import CustomMarkdown from '../../__Common__/CustomMarkdown';
import IbisIcon from '../../__Common__/IbisIcon';
import Link from '../../__Common__/CustomLink';

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
    toIcon: {
	marginRight: 4,
	transform: 'scaleX(-1)',
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	textDecoration: 'none',
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
    },
    progressWrapper: {
	padding: theme.spacing(3),
    },
    grantBody: {
	paddingLeft: theme.spacing(6),
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
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
	display: 'flex',
	alignItems: 'center',
    },
    distributionProgress: {
	height: '100%',
	display: 'flex',
	alignItems: 'center',
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

const message = `
Want to do even more to kickstart Universal Basic Philanthropy? Token Ibis is already chugging along, but to get the next level, we'll need more contributions from many more people. Now, you can help!

By making a grant here, you'll be adding to Token Ibis's community money that we redistributed weekly to everyone on the app. Importantly, you'll be able to see _exactly_ where every penny of your money goes right on this page. Make your first grant and try it out today!
`;

const query = loader('../../Static/graphql/app/GrantList.gql')

class GrantList extends Component {

    makeImage = (node) => {
	let { classes } = this.props;

	return (
	    <IbisIcon className={classes.icon} />
	);
    };

    makeLabel = (node) => {
	let { classes } = this.props;

	console.log()
	return (
	    <div>
	      <Typography variant="body2" className={classes.title}>
		{<ToIcon className={classes.toIcon} />}
		<span className={classes.amount}>{`$${(node.amount/100).toFixed(2)} from ${node.name}`}</span>
	      </Typography>
	    </div>
	);
    };

    makeBody = (node) => {
	let { classes } = this.props;

	return (
	    <Typography variant="body2" className={classes.grantBody}>
  	      <Grid container>
		{node.description && (
		    <Grid item xs={4}>
		      Description
		    </Grid>
		)}
		{node.description && (
		    <Grid item xs={8}>
		      {node.description}
		    </Grid>
		)}
		<Grid item xs={4}>
		  Timeline
		</Grid>
		<Grid item xs={8}>
		  <CustomDate variant={DateVal} date={node.created}/> {`(${node.duration} week${node.duration === 1 ? '' : 's'})`}
		</Grid>
		<Grid item xs={4}>
		  Funded
		</Grid>
		<Grid item xs={8}>
		  {`${node.numDonations} donation${node.numDonations === 1 ? '' : 's'} to ${node.numOrganizations} org${node.numOrganizations === 1 ? '' : 's'}`}
		</Grid>
		<Grid item xs={4}>
		  Progress
		</Grid>
		<Grid item xs={8}>
		  <div className={classes.distributionProgress}>
		    <div style={{height: 8, width: 120, borderStyle: 'solid', borderWidth: 2, borderColor: '#ffcfcf'}}>
		      <div style={{height: 6, margin: 1, width: 118 * Math.min(1, node.fundedAmount / node.amount), background: "#ffcfcf"}} />
		    </div>
		  </div>
		</Grid>
	      </Grid>
	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, context } = this.props;
	
	return (
	    <div className={classes.action}>
	      <div></div>
	      <Typography
		  component={Link}
		  to={`/donation-list?filterValue=Grant:${node.id}`}
		  variant="body2"
		  className={classes.info}
	      >
		See Funded Donations
	      </Typography>
	    </div>
	);
    };

    shouldComponentUpdate(nextProps, nextState) {
	let { numGrants } = this.props;
	return numGrants !== nextProps.numGrants
    };

    render() {
	let { classes, context, count } = this.props;

	count = count ? count: DEFAULT_COUNT

	let make = (data) => (
	    <ListView
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		expandedAll
		data={data}
	    />
	);

	let variables = {
	    user: context.userID,
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

GrantList.propTypes = {
    classes: PropTypes.object.isRequired,
};

class Grant extends Component {

    state = {
	sdkLoaded: false,
	ordering: false,
	amount: '0.00',
	enableGrant: false,
	numGrants: 0,
	dialog: '',
	checked: true,
    };

    handleKeyPressAmount(event) {
	if (!/^\d+$/.test(event.key)) {
	    event.preventDefault();
	}
    }

    handleChangeAmount() {
	let value = document.getElementById('grant_amount').value;

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

	let enableGrant = Number(value) >= MIN_AMOUNT / 100;
	this.setState({ enableGrant, amount: parseFloat(value).toFixed(2)});
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
	let { numGrants } = this.state;

	axios('/ibis/payment/', {
	    method: 'post',
	    withCredentials: true,
	    data: { orderID },
	}).then(response => {
	    this.setState({
		ordering: false,
		amount: '0.00',
		enableGrant: false,
		numGrants: numGrants + 1,
	    });
	    if (response.data.grantID) {
		this.setState({ dialog: '__Grant successful.__ Thank you for doing your part to make a difference in, stay tuned to see what happens!' });
	    } else {
	    alert('Uh-oh. Something went wrong. This can happen if your connection was interrupted mid-payment. Please check your (normal) payment history and Ibis grants to make sure they match up. If not, then email info@tokenibis.org');
	    }
	}).catch(error => {
	    alert('Uh-oh. Something went wrong. This can happen if your connection was interrupted mid-payment. Please check your (normal) payment history and Ibis grants to make sure they match up. If not, then email info@tokenibis.org');
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
	    enableGrant,
	    amount,
	    numGrants,
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
		    className={(sdkLoaded && enableGrant) ? (
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
		  message='Wait! Leaving may interrupt the grant process. Are you sure you want to continue?'
	      />
  	      <Grid container direction="column" justify="center" alignItems="center" >
		<Dialog
		    open={!!dialog}
		    onClose={() => window.location.reload()}
		>
		  <div className={classes.dialogInner}>
		    <CustomMarkdown source={dialog}/>
		  </div>
		</Dialog>
		<Card raised className={classes.card}>
  		  <Grid container direction="column" justify="center" alignItems="center" >
		    <Grid container className={classes.content}>
		      <Grid item xs={12} style={{ textAlign: 'center'}}>
			<Typography variant="h6" className={classes.headingTitle} >
			  Make Grant 
			</Typography>
			<div style={{ textAlign: 'left'}}>
			  <CustomMarkdown noLink source={message}/>
			</div>
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
			    id="grant_amount"
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
		  Grant History
		</Typography>
	      </Grid>
	      <GrantList classes={classes} context={context} numGrants={numGrants}/>
	      <Grid item xs={12}><div className={classes.bottom} /></Grid>
	    </React.Fragment>

	);
    };
};

export default withStyles(styles)(Grant);
