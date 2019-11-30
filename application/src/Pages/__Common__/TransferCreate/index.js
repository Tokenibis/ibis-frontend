import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withRouter } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';

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
    recipient: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
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
    dialogInner: {
	padding: theme.spacing(4),
    },
    message: {
	display: 'flex',
	justifyContent: 'space-between',
	paddingBottom: theme.spacing(4),
    },
    action: {
	textAlign: 'center',
    },
    dialogButton: {
	paddingLeft: theme.spacing(6),
	paddingRight: theme.spacing(6),
	marginLeft: theme.spacing(2),
	marginRight: theme.spacing(2),
	color: theme.palette.secondary.main,
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
    },
});

const MAX_AMOUNT = 1000;

const VARIANTS = {
    donation: {
	query: gql`
	    query DonationForm($id: ID! $target: ID!) {
		user: person(id: $id) {
		    id
		    balance
		}
		target: nonprofit(id: $target) {
		    id
		    name
		    username
		}
	    }
	`,
	mutation: gql`
	    mutation DonationCreate($user: ID! $target: ID! $amount: Int! $description: String!) {
		createDonation(user: $user target: $target amount: $amount description: $description) {
		    donation {
			id
		    }
		}
	    }
	`,
    },
    transaction: {
	query: gql`
	    query TransactionForm($id: ID! $target: ID!) {
		user: person(id: $id) {
		    id
		    balance
		}
		target: person(id: $target) {
		    id
		    name
		    username
		}
	    }
	`,
	mutation: gql`
	    mutation TransactionCreate($user: ID! $target: ID! $amount: Int! $description: String!) {
		createTransaction(user: $user target: $target amount: $amount description: $description) {
		    transaction {
			id
		    }
		}
	    }
	`,
    },
};

class TransferCreate extends Component {

    state = {
	amount: '0.00',
	enableDonate: false,
	openedConfirmation: false,
    };

    handlePay(mutation) {
	// do input validation here
	this.setState({ enableDonate: false, openedConfirmation: true });
    }

    handleYes(mutation) {
	let { context, target, history, variant } = this.props;

	let description = document.getElementById(`transfer_description`).value
	let amount_str = document.getElementById(`transfer_amount`).value
	let amount = Math.floor(Number(amount_str) * 100)

	mutation({ variables: {
	    user: context.userID,
	    target,
	    amount,
	    description,
	}}).then(response => {
	    let url = new URL(window.location.href);
	    let path = url.hash.split('/').slice(1);
	    let page = variant === 'donation' ? 'Donation' : 'Transaction';
	    let result = response.data[Object.keys(response.data)[0]];
	    history.push(`/${path[0]}/${page}?id=${result[Object.keys(result)[0]].id}`)
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	});
    }

    handleClose() {
	this.setState({ openedConfirmation: false, enableDonate: true });
    }

    handleKeyPressAmount(event) {
	if (!/^\d+$/.test(event.key)) {
	    event.preventDefault();
	}
    }

    handleChangeAmount() {
	let value = document.getElementById('transfer_amount').value;

	// handle numbers that are out of range
	if (!isNaN(value)) {
	    if (Number(value) <= 0) {
		value = '0';
	    } else if (Number(value) > MAX_AMOUNT) {
		value = MAX_AMOUNT;
	    }
	}
	    
	// reformat anything else that isn't a positive integer
	if (!/^\d+$/.test(value)) {
	    value = (value.replace(/[^\d]/g, '')/100);
	}

	let enableDonate = Number(value) > 0 &&
			   document.getElementById('transfer_description').value.length > 0;
	this.setState({ enableDonate, amount: parseFloat(value).toFixed(2)});
    }

    handleChangeDescription() {
	let enableDonate = !isNaN(document.getElementById('transfer_amount').value) && 
			   Number(document.getElementById('transfer_amount').value) > 0 &&
			   document.getElementById('transfer_description').value.length > 0;
	this.setState({ enableDonate });
    }

    render() {
	let { classes, context, target, variant } = this.props;
	let { enableDonate, openedConfirmation, amount } = this.state;

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
		      <div>
			<Dialog
			    open={openedConfirmation}
			    onClose={(e) => this.handleClose()}
			>
			  <div className={classes.dialogInner}>
			    <div className={classes.message}>
			      <Typography variant="body2">
				Do you really want to pay&nbsp;
			      </Typography>
			      <Typography variant="body2">
				{`$${amount_final ? amount_final / 100 : 0 }`}&nbsp;
			      </Typography>
			      <Typography variant="body2">
				{`to ${data.target.name}`}&nbsp;
			      </Typography>
			      <Typography variant="body2" color="secondary">
				{`@${data.target.username}`}
			      </Typography>
			      <Typography variant="body2">
				?
			      </Typography>
			    </div>
			    <div className={classes.action}>
			      <Mutation mutation={VARIANTS[variant].mutation}>
				{mutation => (
				    <Button
				      className={classes.dialogButton}
				      onClick={() => this.handleYes(mutation)}
				    >
				      Yes
				    </Button>
				)}
			      </Mutation>
			      <Button
				className={classes.dialogButton}
				onClick={() => this.handleClose()}
			      >
				No
			      </Button>
			    </div>
			  </div>
			</Dialog>
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
			      <Button
				disabled={!enableDonate}
				onClick={() => this.handlePay()}
				className={classes.actionTransfer}
			      >
				{variant === 'donation' ? 'Donate' : 'Pay'}
			      </Button>
			    </Grid>
			  </Grid>
			</Grid>
		      </div>
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

export default withRouter(withStyles(styles)(TransferCreate));
