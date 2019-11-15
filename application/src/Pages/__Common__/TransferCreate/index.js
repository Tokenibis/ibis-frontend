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
});

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
	    mutation CreateDonation($user: ID! $target: ID! $amount: Int! $description: String!) {
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
	    mutation CreateTransaction($user: ID! $target: ID! $amount: Int! $description: String!) {
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
	pressed: false,
    };

    render() {
	let { classes, context, target, history, variant } = this.props;
	let { pressed } = this.state;

	let validateAmount = (event) => {
	    console.log(event)
	}

	let submit = (mutation) => {
	    let description = document.getElementById(`transfer_description`).value
	    let amount_str = document.getElementById(`transfer_amount`).value
	    let amount = Math.floor(Number(amount_str) * 100)

	    this.setState({ pressed: true });

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
				defaultValue=""
 				className={classes.textField}
				margin="normal"
				variant="outlined"
				fullWidth
				placeholder="0"
				onChange={validateAmount}
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
			    />
			  </Grid>
			  <Grid item xs={12} className={classes.buttonWrapper}>
			    <Mutation mutation={VARIANTS[variant].mutation}>
			      {mutation => (
				  <Button
				    disabled={pressed}
				    onClick={() => submit(mutation)}
				    className={classes.actionTransfer}
				      >
				    {variant === 'donation' ? 'Donate' : 'Pay'}
				  </Button>
			      )}
			    </Mutation>
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

export default withRouter(withStyles(styles)(TransferCreate));
