import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query, withApollo } from "react-apollo";
import { loader } from 'graphql.macro';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withRouter } from "react-router-dom";

import Confirmation from '../Confirmation';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(2),
	width: '90%',
    },
    actionTransfer: {
	width: '100%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	marginBottom: theme.spacing(3),
    },
    name: {
	paddingTop: theme.spacing(2),
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    username: {
	color: theme.palette.tertiary.main,
    },
    label: {
	paddingTop: theme.spacing(2),
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    buttonWrapper: {
	paddingTop: theme.spacing(2),
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
});

const MAX_AMOUNT = 100;

const VARIANTS = {
    donation: {
	query: loader('../../../Static/graphql/operations/DonationForm.gql'),
	mutation: loader('../../../Static/graphql/operations/DonationCreate.gql'),
    },
    transaction: {
	query: loader('../../../Static/graphql/operations/TransactionForm.gql'),
	mutation: loader('../../../Static/graphql/operations/TransactionCreate.gql'),
    },
};

class TransferCreate extends Component {

    state = {
	amount: '0.00',
	enableTransfer: false,
    };

    handleTransfer(mutation) {
	let { context, client, target, history, variant } = this.props;

	let description = document.getElementById(`transfer_description`).value
	let amount_str = document.getElementById(`transfer_amount`).value
	let amount = Math.floor(Number(amount_str) * 100)

	client.mutate({
	    mutation: VARIANTS[variant].mutation,
	    variables: {
		user: context.userID,
		target,
		amount,
		description,
	    },
	}).then(response => {
	    let url = new URL(window.location.href);
	    let path = url.hash.split('/').slice(1);
	    let page = variant === 'donation' ? 'Donation' : 'Transaction';
	    let result = response.data[Object.keys(response.data)[0]];
	    history.push(`/${path[0]}/${page}?id=${result[Object.keys(result)[0]].id}`)
	}).catch(error => {
	    console.log(error);
	});
    }

    handleKeyPressAmount(event) {
	if (!/^\d+$/.test(event.key)) {
	    event.preventDefault();
	}
    }

    handleChangeAmount() {
	let value = document.getElementById('transfer_amount').value;

	// handle negatives 
	if (!isNaN(value) && Number(value) <= 0) {
	    value = '0';
	}

	// reformat anything that isn't a positive integer
	if (!/^\d+$/.test(value)) {
	    value = (value.replace(/[^\d]/g, '')/100);
	}

	// handle numbers that are out of range
	if (!isNaN(value) && Number(value) > MAX_AMOUNT) {
	    value = MAX_AMOUNT;
	}

	let enableTransfer = Number(value) > 0 &&
			   document.getElementById('transfer_description').value.length > 0;
	this.setState({ enableTransfer, amount: parseFloat(value).toFixed(2)});
    }

    handleChangeDescription() {
	let enableTransfer = !isNaN(document.getElementById('transfer_amount').value) && 
			   Number(document.getElementById('transfer_amount').value) > 0 &&
			   document.getElementById('transfer_description').value.length > 0;
	this.setState({ enableTransfer });
    }

    render() {
	let { classes, context, target, variant } = this.props;
	let { enableTransfer, amount } = this.state;

	let description = document.getElementById(`transfer_description`) ?
			  document.getElementById(`transfer_description`).value :
			  '';
	let amount_str = document.getElementById(`transfer_amount`) ?
			 document.getElementById(`transfer_amount`).value :
			 '0.0';
	let amount_final = Math.floor(Number(amount_str) * 100)

	return (
	    <Query
	      fetchPolicy="no-cache"
	      query={VARIANTS[variant].query}
	      variables={{ id: context.userID, target }}
	    >
	      {({ loading, error, data, refetch }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return (
  		      <Grid container direction="column" justify="center" alignItems="center" >
			<Grid container className={classes.content}>
			  <Grid item xs={4}>
			    <Typography variant="body2" className={classes.label}>
			      Recipient
			    </Typography>
			  </Grid>
			  <Grid item xs={8}>
			    <Typography variant="body2" className={classes.name}>
			      {data.target.name}
			    </Typography>
			    <Typography variant="body2" className={classes.username}>
			      @{data.target.username}
			    </Typography>
			  </Grid>
			  <Grid item xs={4}>
			    <Typography variant="body2" className={classes.label}>
			      Amount
			    </Typography>
			  </Grid>
			  <Grid item xs={8}>
			    <TextField
				id="transfer_amount"
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
			      Description
			    </Typography>
			  </Grid>
			  <Grid item xs={8}>
			    <TextField
				id="transfer_description"
				required
				defaultValue=""
 				className={classes.textField}
				margin="normal"
				variant="outlined"
				fullWidth
				multiline
				placeholder="Words"
				onChange={() => this.handleChangeDescription()}
			    />
			  </Grid>
			  <Grid item xs={12} className={classes.buttonWrapper}>
			    <Confirmation
			      disabled={!enableTransfer}
			      onClick={() => this.handleTransfer()}
			      message={`Do you really want to ${variant === DonationVal ? 'donate' : 'pay'} ${amount_final ? amount_final / 100 : 0 } to ${data.target.username}?`}
			    >
			      <Button
				  disabled={!enableTransfer}
				  className={classes.actionTransfer}
			      >
				{variant === 'donation' ? 'Donate' : 'Pay'}
			      </Button>
			    </Confirmation>
			  </Grid>
			</Grid>
		      </Grid>
		  );
	      }}
	    </Query>
	);
    };
};

TransferCreate.propTypes = {
    classes: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired,
    target: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
};

export const DonationVal = 'donation';
export const TransactionVal = 'transaction';

export default withRouter(withApollo(withStyles(styles)(TransferCreate)));
