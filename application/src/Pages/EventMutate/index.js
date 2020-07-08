import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from "react-apollo";
import { loader } from 'graphql.macro';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withRouter } from "react-router-dom";

import Confirmation from '../../__Common__/Confirmation';
import EntryTextField from '../../__Common__/EntryTextField';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(2),
	width: '90%',
    },
    actionEvent: {
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
    label: {
	paddingTop: theme.spacing(2),
	fontWeight: 'bold',
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

const query = loader('../../Static/graphql/app/Event.gql')

const create_mutation = loader('../../Static/graphql/app/EventCreate.gql')

const update_mutation = loader('../../Static/graphql/app/EventUpdate.gql')

class EventCreate extends Component {

    state = {
	enableEvent: false,
	title: '',
	image: '',
	link: '',
	description: '',
	date: '',
	duration: '',
	address: '',
	mention: [],
    };

    componentDidMount() {
	let { context, client, id } = this.props;

	if (id) {
	    client.query({
		query: query,
		variables: { id, self: context.userID },
		fetchPolicy: "no-cache",
	    }).then(results => {
		let d = new Date(results.data.event.date);
		console.log(d)
		let date_str = ('0000' + d.getFullYear()).slice(-4) + '-' +
			       ('00' + (d.getMonth() + 1)).slice(-2) + '-' +
			       ('00' + d.getDate()).slice(-2) + 'T' +
			       ('00' + d.getHours()).slice(-2) + ':' +
			       ('00' + d.getMinutes()).slice(-2)
		console.log(date_str)
		this.setState({
		    title: results.data.event.title,
		    image: results.data.event.image,
		    link: results.data.event.link,
		    description: results.data.event.description,
		    date: date_str,
		    duration: results.data.event.duration,
		    address: results.data.event.address,
		});
	    }).catch(error => {
		console.log(error);
	    });
	}

    };

    handleMutate(mutation) {
	let { context, client, history, id } = this.props;

	let variables = {
	    user: context.userID,
	    title: document.getElementById(`event_title`).value,
	    image: document.getElementById(`event_image`).value,
	    link: document.getElementById(`event_link`).value,
	    description: document.getElementById(`event_description`).value,
	    date: document.getElementById(`event_date`).value,
	    duration: document.getElementById(`event_duration`).value,
	    address: document.getElementById(`event_address`).value,
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
	    let event_id = response.data[Object.keys(response.data, 0)].event.id
	    console.log('here!')
	    history.push(`/${path[0]}/Event?id=${event_id}`)
	}).catch(error => {
	    console.log(error);
	});
    };

    handleChange() {
	let title = document.getElementById('event_title').value
	let image = document.getElementById('event_image').value
	let link = document.getElementById('event_link').value
	let description = document.getElementById('event_description').value
	let date = document.getElementById('event_date').value
	let duration = document.getElementById('event_duration').value
	let address = document.getElementById('event_address').value

	this.setState({
	    title,
	    image,
	    link,
	    description,
	    date,
	    duration,
	    address,
	    enableEvent: title && image && description && date && duration,
	});
    }

    render() {
	let { classes } = this.props;
	let {
	    enableEvent,
	    title,
	    image,
	    link,
	    description,
	    date,
	    duration,
	    address,
	    mention,
	} = this.state;
	
	return (
	    <div>
  	      <Grid container direction="column" justify="center" alignItems="center" >
		<Grid container className={classes.content}>
		  <Grid item xs={12}>
		    <TextField
			id="event_title"
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
		    <TextField
			id="event_image"
			required
			defaultValue=""
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			label="Image"
		        value={image}
			onChange={() => this.handleChange()}
		    />
		  </Grid>
		  <Grid item xs={12}>
		    <EntryTextField
			id="event_description"
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
			addMention={(x) => this.setState({ mention: Object.assign({}, mention, x)})}
		    />
		  </Grid>
		  <Grid item xs={12}>
		    <TextField
			id="event_address"
			defaultValue=""
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			multiline
			rows={3}
			label="Address"
		        value={address}
			onChange={() => this.handleChange()}
		    />
		  </Grid>
		  <Grid item xs={12}>
		    <TextField
			id="event_link"
			defaultValue=""
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			label="Link"
		        value={link}
			onChange={() => this.handleChange()}
		    />
		  </Grid>
		  <Grid item xs={4}>
		    <Typography variant="body2" className={classes.label}>
		      Start Time *
		    </Typography>
		  </Grid>
		  <Grid item xs={8}>
		    <TextField
			id="event_date"
			type="datetime-local"
			value={date}
			className={classes.textField}
			onChange={() => this.handleChange()}
		    />
		  </Grid>
		  <Grid item xs={4}>
		    <Typography variant="body2" className={classes.label}>
		      Duration *
		    </Typography>
		  </Grid>
		  <Grid item xs={8}>
		    <TextField
			id="event_duration"
			type="number"
			value={duration}
			placeholder="minutes"
			className={classes.textField}
			InputProps={{ inputProps: { min: 0 } }}
			onChange={() => this.handleChange()}
		    />
		  </Grid>
		  <Grid item xs={6} className={classes.buttonWrapper}>
		    <Confirmation
			disabled={!enableEvent}
			onClick={() => this.handleMutate()}
			message="Are you sure you want to __submit__ this event?"
			preview={() => (document.getElementById('event_description').value)}
			mention={mention}
		    >
		      <Button
			  disabled={!enableEvent}
			  className={classes.actionEvent}
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

EventCreate.propTypes = {
    classes: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export const DonationVal = 'donation';
export const TransactionVal = 'transaction';

export default withRouter(withApollo(withStyles(styles)(EventCreate)));
