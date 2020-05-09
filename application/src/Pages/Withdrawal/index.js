import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';

import QueryHelper from '../../__Common__/QueryHelper';
import ListView from '../../__Common__/ListView';
import CustomDate, { PreciseVal } from '../../__Common__/CustomDate';
import CustomMarkdown from '../../__Common__/CustomMarkdown';
import Truncated from '../../__Common__/Truncated';

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
	marginLeft: 'auto',
	marginRight: theme.spacing(2),
	float: 'right',
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

const query = loader('../../Static/graphql/operations/WithdrawalList.gql')

const query_balance = loader('../../Static/graphql/operations/Balance.gql')

const message = 'This is a history of your "withdrawals", a.k.a. real-money donations that Token Ibis has passed on your organization. In general, these will occur no later than on a monthly basis as long as the outstanding balance is more than $100. However, if you would like to expedit a payment, please email at __info@tokenibis.org__';

class WithdrawalList extends Component {

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

    makeBody = (node) => {
	let { classes } = this.props;
	return (
	    <Typography variant="body2" className={classes.body}>
  	      <Truncated text={node.description}/>
	    </Typography>
	);
    }

    render() {
	let { classes, context, count } = this.props;

	count = count ? count: DEFAULT_COUNT

	let make = (data) => (
	    <ListView
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		data={data}
	    />
	);

	let variables = {
	    byUser: context.userID,
	    orderBy: "-created",
	    first: count,
	}

	return (
	    <div className={classes.root}>
	      <QueryHelper
		  query={query}
		  variables={variables}
		  make={make}
		  infiniteScroll={true}
	      />
	    </div>
	);
    };
};

WithdrawalList.propTypes = {
    classes: PropTypes.object.isRequired,
};

class Withdrawal extends Component {

    state = {
	numWithdrawals: 0,
	dialog: '',
    };

    render() {
	let { classes, context } = this.props
	let { dialog, numWithdrawals } = this.state;

	return (
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
			  Withdrawals
			</Typography>
		      </Grid>
		      <Grid item xs={12}>
			<CustomMarkdown noLink source={message}/>
		      </Grid>
		      <Grid item xs={6}>
			<Typography variant="body2" className={classes.label}>
			  Balance
			</Typography>
		      </Grid>
		      <Grid item xs={6}>
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
				     ${(data.ibisUser.balance/100).toFixed(2)}
				   </Typography>
			       )
			   }}
			 </Query>
		      </Grid>
		    </Grid>
		  </Grid>
		</Card>
		<Typography variant="button" className={classes.heading} >
		  Withdrawal History
		</Typography>
		<WithdrawalList classes={classes} context={context} numWithdrawals={numWithdrawals}/>
		<Grid item xs={12}><div className={classes.bottom} /></Grid>
	      </Grid>
	);
    };
};

export default withStyles(styles)(Withdrawal);
