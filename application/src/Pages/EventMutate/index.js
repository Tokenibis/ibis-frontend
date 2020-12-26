import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from "react-apollo";
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withRouter } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import Datetime from 'react-datetime';
import moment from 'moment';

import Confirmation from '../../__Common__/Confirmation';
import EntryTextField from '../../__Common__/EntryTextField';

import "react-datetime/css/react-datetime.css";

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
    label: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	paddingRight: theme.spacing(),
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    fileWrapper: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	overflow: 'hidden',
    },
    fine: {
	marginTop: theme.spacing(-2),
	paddingBottom: theme.spacing(2),
	paddingRight: theme.spacing(),
	fontSize: '12px',
	color: theme.palette.tertiary.main,
    },
    checkbox: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
    }
});

const query = loader('../../Static/graphql/app/Event.gql')

const create_mutation = loader('../../Static/graphql/app/EventCreate.gql')

const update_mutation = loader('../../Static/graphql/app/EventUpdate.gql')

class EventCreate extends Component {

    state = {
	enableEvent: false,
	title: '',
	link: '',
	description: '',
	date: moment.now(),
	duration: '',
	address: '',
	virtual: false,
	mention: {}
    };

    componentDidMount() {
	let { context, client, id } = this.props;

	if (id) {
	    client.query({
		query: query,
		variables: { id, self: context.userID },
		fetchPolicy: "no-cache",
	    }).then(results => {
		this.setState({
		    title: results.data.event.title,
		    link: results.data.event.link,
		    description: results.data.event.description,
		    date: moment(results.data.event.date).valueOf(),
		    duration: results.data.event.duration,
		    address: results.data.event.address,
		    virtual: results.data.event.virtual,
		    enableEvent: true,
		});
	    }).catch(error => {
		console.log(error);
	    });
	}

    };

    handleMutate(mutation) {
	let { context, client, history, id } = this.props;
	let { virtual, date } = this.state;

	let variables = {
	    user: context.userID,
	    title: document.getElementById(`event_title`).value,
	    link: document.getElementById(`event_link`).value,
	    description: document.getElementById(`event_description`).value,
	    date: moment(date).toISOString(),
	    duration: document.getElementById(`event_duration`).value,
	    address: document.getElementById(`event_address`).value,
	    virtual,
	}

	if (document.getElementById(`event_image`).files) {
	    variables.image = document.getElementById(`event_image`).files[0];
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
	    history.push(`/${path[0]}/Event?id=${event_id}`)
	}).catch(error => {
	    console.log(error);
	});
    };

    handleChange() {
	let { id } = this.props;
	let { date } = this.state;

	let title = document.getElementById('event_title').value;
	let image = document.getElementById('event_image');
	let link = document.getElementById('event_link').value;
	let description = document.getElementById('event_description').value;
	let duration = document.getElementById('event_duration').value;
	let address = document.getElementById('event_address').value;

	if (image.files.length > 1) {
	    alert('You can only upload one featured image');
	    image.value = null;
	}

	this.setState({
	    title,
	    link,
	    description,
	    duration,
	    address,
	    enableEvent: !!(title && (image.files.length === 1 || id) && description && date && duration),
	});
    }

    render() {
	let { classes, id } = this.props;
	let {
	    enableEvent,
	    title,
	    link,
	    description,
	    date,
	    duration,
	    address,
	    virtual,
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
		  <Grid item xs={4}>
		    <Typography variant="body2" className={classes.label}>
		      Image*
		    </Typography>
		    {id && (
			<Typography variant="body2" className={classes.fine}>
			  Ignore to keep old
			</Typography>
		    )}
		  </Grid>
		  <Grid item xs={8}>
		    <div className={classes.fileWrapper}>
		      <input
			  accept="image/*"
			  id="event_image"
			  multiple
			  type="file"
		          onChange={(e) => this.handleChange()}
		      />
		    </div>
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
		        inputProps={{ rowsMin: 5 }}
			label="Description"
		        value={description}
			onChange={() => this.handleChange()}
			addMention={(x) => {
			    this.setState({ mention: Object.assign({}, mention, x)});
			    this.handleChange();
			}}
		    />
		  </Grid>
		  <Grid item xs={4}>
		    <Typography variant="body2" className={classes.label}>
		      Virtual?*
		    </Typography>
		    <Typography variant="body2" className={classes.fine}>
		      i.e. check if this is an online-only event
		    </Typography>
		  </Grid>
		  <Grid item xs={8}>
		    <Checkbox
			className={classes.checkbox}
			color="secondary"
			checked={virtual}
			onClick={() => {this.setState({ virtual: !virtual })}}
			value="primary"
			inputProps={{ 'aria-label': 'primary checkbox' }}
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
		        inputProps={{ rowsMin: 5 }}
			label={`${virtual ? 'Join information (e.g. Zoom or Google Hangouts)' : 'Physical Address'}`}
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
			label="Link to original article"
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
		    <Datetime
		        value={date}
	                input={false}
			onChange={picked => {
			    this.setState({ date: picked });
			    this.handleChange();
			}}
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
export const RewardVal = 'reward';

export default withRouter(withApollo(withStyles(styles)(EventCreate)));
