import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query, withApollo } from "react-apollo";
import { loader } from 'graphql.macro';
import Dialog from '@material-ui/core/Dialog';
import CustomMarkdown from '../CustomMarkdown';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withRouter } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';

import Confirmation from '../Confirmation';
import EntryTextField from '../../__Common__/EntryTextField';

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
    title: {
	paddingTop: theme.spacing(2),
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
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
    balance: {
	paddingTop: theme.spacing(2),
	color: theme.palette.tertiary.main,
    },
    zeroBalance: {
	paddingTop: theme.spacing(2),
	color: 'red',
    },
    fine: {
	paddingTop: theme.spacing(2),
	fontSize: '12px',
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

const MAX_AMOUNT = 10000;

const VARIANTS = {
    donation: {
	query: loader('../../Static/graphql/app/DonationForm.gql'),
	mutation: loader('../../Static/graphql/app/DonationCreate.gql'),
    },
    reward: {
	query: loader('../../Static/graphql/app/RewardForm.gql'),
	mutation: loader('../../Static/graphql/app/RewardCreate.gql'),
    },
};

class TransferCreate extends Component {

    state = {
	amount: '0.00',
	enableTransfer: false,
	mention: [],
	destination: '',
	thanks: false,
    };

    handleTransfer(mutation) {
	let { context, client, target, history, variant } = this.props;

	let description = document.getElementById(`transfer_description`).value
	let amount_str = document.getElementById(`transfer_amount`).value
	let amount = Math.floor(Number(amount_str) * 100)

	return client.mutate({
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
	    let page = variant === 'donation' ? 'Donation' : 'Reward';
	    let result = response.data[Object.keys(response.data)[0]];
	    let destination = `/${path[0]}/${page}?id=${result[Object.keys(result)[0]].id}`

	    if (variant === 'donation') {
		this.setState({
		    thanks: true,
		    destination,
		})
	    } else {
		history.push(destination);
	    }
	}).catch(error => {
	    console.log(error);
	});
    }

    handleKeyPressAmount(event) {
	if (!/^\d+$/.test(event.key)) {
	    event.preventDefault();
	}
    }

    handleChangeAmount(balance) {
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
	let max = Math.min(balance, MAX_AMOUNT)
	if (!isNaN(value) && Number(value) > max / 100) {
	    value = max / 100;
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
	let { classes, context, target, variant, history } = this.props;
	let { enableTransfer, amount, mention, thanks, destination } = this.state;

	let amount_final = Math.floor(amount * 100)

	return (
	    <div>
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
			  {data.message && (
			      <Dialog
				  open={thanks}
				  onClose={() => {history.push(destination)}}
				  >
				<div className={classes.dialogInner}>
				  <CustomMarkdown source={data.message.edges[0].node.description}/>
				</div>
			      </Dialog>
			  )}
			  <Grid container className={classes.content}>
			    <Grid item xs={4}>
			      <Typography variant="body2" className={classes.label}>
				Recipient
			      </Typography>
			    </Grid>
			    <Grid item xs={8}>
			      <Typography variant="body2" className={classes.title}>
				{data.target.name}
			      </Typography>
			      <Typography variant="body2" className={classes.subtitle}>
				@{data.target.username}
			      </Typography>
			    </Grid>
			    <Grid item xs={4}>
			      <Typography variant="body2" className={classes.label}>
				Balance
			      </Typography>
			    </Grid>
			    <Grid item xs={8}>
			      {data.user.balance > 0.0 ? (
				  <Typography variant="body2" className={classes.balance}>
				    ${(data.user.balance/100).toFixed(2)}
				  </Typography>
			      ):(
				  <Typography variant="body2" className={classes.zeroBalance}>
				    $0.00 - No funds remaining
				  </Typography>
			      )}
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
			      onChange={() => this.handleChangeAmount(data.user.balance)}
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
			      <EntryTextField
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
			          addMention={(x) => this.setState({ mention: Object.assign({}, mention, x)})}
			      />
			    </Grid>
			    <Grid item xs={12} className={classes.buttonWrapper}>
			      <Confirmation
				  disabled={!enableTransfer}
				  onClick={() => this.handleTransfer()}
				  message={`Are you sure you want to ${variant === DonationVal ? 'donate' : 'reward'} __$${amount_final ? (amount_final / 100).toFixed(2) : 0.00 }__ to __@${data.target.username}__ (${data.target.name})?`}
				  preview={() => (document.getElementById('transfer_description').value)}
				  mention={mention}
			      >
				<Button
				    disabled={!enableTransfer}
				    className={classes.actionTransfer}
				>
				  {variant === 'donation' ? 'Donate' : 'Reward'}
				</Button>
			      </Confirmation>
			    </Grid>
			  </Grid>
			</Grid>
		    );
		}}
	      </Query>
	    </div>
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
export const RewardVal = 'reward';

export default withRouter(withApollo(withStyles(styles)(TransferCreate)));
