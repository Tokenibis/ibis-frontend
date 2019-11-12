import React from 'react';
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

import Link from '../../__Common__/CustomLink';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(2),
	width: '90%',
    },
    actionDonate: {
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

const QUERY = gql`
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
`;

const MUTATION = gql`
    mutation CreateDonation($user: ID! $target: ID! $amount: Int! $description: String!) {
	createDonation(user: $user target: $target description: $description) {
	    donation
	}
    }
`;

function DonationCreate({ classes, context, target }) {

    let validateAmount = (event) => {
	console.log(event)
    }

    let submit = (mutation) => {
	let amount = document.getElementById(`donation_amount`).value
	let description = document.getElementById(`donation_description`).value

	mutation({ variables: {
	    user: context.userID,
	    target,
	    amount,
	    description
	}}).then(response => {
	    // goto donation page
	    console.log('donate')
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	});
    }


    return (
	<Query fetchPolicy="no-cache" query={QUERY} variables={{ id: context.userID, target }}>
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
			  id="donation_amount"
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
			  id="donation_description"
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
		      <Mutation mutation={MUTATION}>
			{mutation => (
			    <Button
				component={Link}
				prefix={1}
				onClick={() => submit(mutation)}
				className={classes.actionDonate}
				>
			      Donate
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

export default withStyles(styles)(DonationCreate);
