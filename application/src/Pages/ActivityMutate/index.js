import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from "react-apollo";
import { loader } from 'graphql.macro';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import { withRouter } from "react-router-dom";

import Confirmation from '../../__Common__/Confirmation';
import EntryTextField from '../../__Common__/EntryTextField';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(2),
	width: '90%',
    },
    actionActivity: {
	width: '100%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
    },
    actionCancel: {
	width: '100%',
	backgroundColor: theme.palette.secondary.main,
	color: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
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
    checkBox: {
	paddingTop: theme.spacing(2),
    },
    label: {
	paddingTop: theme.spacing(2),
	paddingRight: theme.spacing(2),
	paddingLeft: theme.spacing(2),
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    expected: {
	paddingLeft: theme.spacing(1),
	paddingRight: theme.spacing(1),
	paddingTop: theme.spacing(2),
	color: theme.palette.tertiary.main,
    },
    buttonWrapper: {
	paddingTop: theme.spacing(4),
	paddingRight: theme.spacing(1),
	paddingLeft: theme.spacing(1),
    },
    textField: {
	width: '100%',
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
    action: {
	textAlign: 'center',
    },
});

const query = loader('../../Static/graphql/app/Activity.gql')

const create_mutation = loader('../../Static/graphql/app/ActivityCreate.gql')

const update_mutation = loader('../../Static/graphql/app/ActivityUpdate.gql')

class ActivityCreate extends Component {

    state = {
	enableActivity: false,
	title: '',
	description: '',
	active: true,
	rewardMin: '0.00',
	rewardMax: '0.00',
	mention: {},
    };

    componentDidMount() {
	let { context, client, id } = this.props;

	if (id) {
	    client.query({
		query: query,
		variables: { id, self: context.userID },
		fetchPolicy: "no-cache",
	    }).then(results => {
		let d = new Date(results.data.activity.date);
		let date_str = ('0000' + d.getFullYear()).slice(-4) + '-' +
			       ('00' + (d.getMonth() + 1)).slice(-2) + '-' +
			       ('00' + d.getDate()).slice(-2) + 'T' +
			       ('00' + d.getHours()).slice(-2) + ':' +
			       ('00' + d.getMinutes()).slice(-2)
		this.setState({
		    title: results.data.activity.title,
		    description: results.data.activity.description,
		    active: results.data.activity.active,
		    rewardMin: parseFloat(results.data.activity.rewardMin/100).toFixed(2),
		    rewardMax: parseFloat((results.data.activity.rewardMin + results.data.activity.rewardRange)/100).toFixed(2),
		    enableActivity: true,
		});
	    }).catch(error => {
		console.log(error);
	    });
	}

    };

    handleMutate(mutation) {
	let { context, client, history, id } = this.props;
	let { active } = this.state;

	let variables = {
	    user: context.userID,
	    title: document.getElementById(`activity_title`).value,
	    description: document.getElementById(`activity_description`).value,
	    active: active,
	    rewardMin: document.getElementById(`reward_min`).value,
	    rewardRange: document.getElementById(`reward_max`).value - document.getElementById(`reward_min`).value,

	}

	if (id) {
	    variables.id = id
	}

	return client.mutate({
	    mutation: id ? update_mutation : create_mutation,
	    variables,
	}).then(response => {
	    let url = new URL(window.location.href);
	    let path = url.hash.split('/').slice(1);
	    let activity_id = response.data[Object.keys(response.data, 0)].activity.id
	    history.push(`/${path[0]}/Activity?id=${activity_id}`)
	}).catch(error => {
	    console.log(error);
	});
    };

    handleChange() {
	let title = document.getElementById('activity_title').value
	let description = document.getElementById('activity_description').value
	let rewardMin = document.getElementById('reward_min').value
	let rewardMax = document.getElementById('reward_max').value

	// handle negatives 
	if (!isNaN(rewardMin) && Number(rewardMin) <= 0) {
	    rewardMin = '0';
	}

	// reformat anything that isn't a positive integer
	if (!/^\d+$/.test(rewardMin)) {
	    rewardMin = (rewardMin.replace(/[^\d]/g, '')/100);
	}

	// handle negatives 
	if (!isNaN(rewardMax) && Number(rewardMax) <= 0) {
	    rewardMax = '0';
	}

	// reformat anything that isn't a positive integer
	if (!/^\d+$/.test(rewardMax)) {
	    rewardMax = (rewardMax.replace(/[^\d]/g, '')/100);
	}

	this.setState({
	    title,
	    description,
	    rewardMin: parseFloat(rewardMin).toFixed(2),
	    rewardMax: parseFloat(rewardMax).toFixed(2),
	    enableActivity: title && description && rewardMin <= rewardMax,
	});
    }

    handleKeyPressAmount(event) {
	if (!/^\d+$/.test(event.key)) {
	    event.preventDefault();
	}
    }

    render() {
	let { classes } = this.props;
	let {
	    enableActivity,
	    title,
	    description,
	    active,
	    rewardMin,
	    rewardMax,
	    mention,
	} = this.state;

	let reward_str
	let minVal = parseFloat(rewardMin);
	let maxVal = parseFloat(rewardMax);
	if (minVal === 0 && maxVal === 0) {
	    reward_str = 'None';
	} else if (minVal === maxVal) {
	    reward_str = `$${rewardMin}`;
	} else if (minVal < maxVal) {
	    reward_str = `$${rewardMin} to $${rewardMax}`;
	} else {
	    reward_str = 'Max reward must be greater than min reward';
	}

	return (
	    <div>
  	      <Grid container direction="column" justify="center" alignItems="center" >
		<Grid container className={classes.content}>
		  <Grid item xs={12}>
		    <TextField
			id="activity_title"
			autoFocus
			required
			defaultValue=""
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
		        label="Title"
		        value={title}
			onChange={() => this.handleChange()}
		    />
		  </Grid>
		  <Grid item xs={12}>
		    <EntryTextField
			id="activity_description"
			required
			defaultValue=""
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			multiline
			rows={5}
			label="Description"
		        value={description}
			onChange={() => this.handleChange()}
			addMention={(x) => {
			    this.setState({ mention: Object.assign({}, mention, x)});
			    this.handleChange();
			}}
		    />
		  </Grid>
		  <Grid item xs={6}>
		    <Typography variant="body2" className={classes.label}>
		      Active
		    </Typography>
		  </Grid>
		  <Grid item xs={6}>
		    <Checkbox
			className={classes.checkBox}
			color="secondary"
			checked={active}
			value="primary"
			onClick={() => this.setState({ active: !active })}
			inputProps={{ 'aria-label': 'primary checkbox' }}
		    />
		  </Grid>
		  <Grid item xs={6}>
		    <Typography variant="body2" className={classes.label}>
		      Expected Min Reward
		    </Typography>
		  </Grid>
		  <Grid item xs={6}>
		    <TextField
			id="reward_min"
			autoFocus
			required
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			value={rewardMin}
			onKeyPress={(e) => this.handleKeyPressAmount(e)}
			onChange={() => this.handleChange()}
			type="number"
			InputProps={{
			    startAdornment: <InputAdornment position="start">$</InputAdornment>,
			}}
		    />
		  </Grid>
		  <Grid item xs={6}>
		    <Typography variant="body2" className={classes.label}>
		      Expected Max Reward
		    </Typography>
		  </Grid>
		  <Grid item xs={6}>
		    <TextField
			id="reward_max"
			autoFocus
			required
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			value={rewardMax}
			onKeyPress={(e) => this.handleKeyPressAmount(e)}
			onChange={() => this.handleChange()}
			type="number"
			InputProps={{
			    startAdornment: <InputAdornment position="start">$</InputAdornment>,
			}}
		    />
		  </Grid>
		  <Grid item xs={6}>
		  </Grid>
		  <Grid item xs={6}>
		    <Typography variant="body2" className={classes.expected}>
		      {reward_str}
		    </Typography>
		  </Grid>
		  <Grid item xs={6} className={classes.buttonWrapper}>
		    <Confirmation
			disabled={!enableActivity}
			onClick={() => this.handleMutate()}
			message="Are you sure you want to __submit__ this activity?"
			preview={() => (document.getElementById('activity_description').value)}
			mention={mention}
		    >
		      <Button
			  disabled={!enableActivity}
			  className={classes.actionActivity}
		      >
			Save
		      </Button>
		    </Confirmation>
		  </Grid>
		  <Grid item xs={6} className={classes.buttonWrapper}>
		      <Button
			  onClick={() => window.history.back()}
			  className={classes.actionCancel}
		      >
			Cancel
		      </Button>
		  </Grid>
		</Grid>
	      </Grid>
	    </div>
	);
    };
};

ActivityCreate.propTypes = {
    classes: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export const DonationVal = 'donation';
export const RewardVal = 'reward';

export default withRouter(withApollo(withStyles(styles)(ActivityCreate)));
