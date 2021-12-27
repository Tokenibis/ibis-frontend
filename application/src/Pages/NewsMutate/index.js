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

import Confirmation from '../../__Common__/Confirmation';
import EntryTextField from '../../__Common__/EntryTextField';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(2),
	width: '90%',
    },
    actionNews: {
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
	paddingTop: theme.spacing(2),
	paddingRight: theme.spacing(1),
	paddingLeft: theme.spacing(1),
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
    action: {
	textAlign: 'center',
    },
    fileLabel: {
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
});

const query = loader('../../Static/graphql/app/News.gql')

const create_mutation = loader('../../Static/graphql/app/NewsCreate.gql')

const update_mutation = loader('../../Static/graphql/app/NewsUpdate.gql')

class NewsCreate extends Component {

    state = {
	enableNews: false,
	title: '',
	link: '',
	description: '',
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
		this.setState({
		    title: results.data.news.title,
		    image: results.data.news.image,
		    link: results.data.news.link,
		    description: results.data.news.description,
		    enableNews: true,
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
	    title: document.getElementById(`news_title`).value,
	    link: document.getElementById(`news_link`).value,
	    description: document.getElementById(`news_description`).value,
	}

	if (document.getElementById(`news_image`).files) {
	    variables.image = document.getElementById(`news_image`).files[0];
	}

	if (id) {
	    variables.id = id
	}

	return client.mutate({
	    mutation: id ? update_mutation : create_mutation,
	    variables,
	}).then(response => {
	    let news_id = response.data[Object.keys(response.data, 0)].news.id
	    history.push(`/news?id=${news_id}`)
	}).catch(error => {
	    console.log(error);
	});
    };

    handleChange() {
	let { id } = this.props;

	let title = document.getElementById('news_title').value;
	let image = document.getElementById('news_image');
	let link = document.getElementById('news_link').value;
	let description = document.getElementById('news_description').value;

	if (image.files.length > 1) {
	    alert('You can only upload one featured image');
	    image.value = null;
	}

	this.setState({
	    title,
	    link,
	    description,
	    enableNews: title && (image.files.length === 1 || id) && description,
	});
    }

    render() {
	let { classes, id } = this.props;
	let { enableNews, title, link, description, mention } = this.state;

	return (
	    <div>
  	      <Grid container direction="column" justify="center" alignItems="center" >
		<Grid container className={classes.content}>
		  <Grid item xs={12}>
		    <TextField
			id="news_title"
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
		    <Typography variant="body2" className={classes.fileLabel}>
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
			  id="news_image"
			  multiple
			  type="file"
		          onChange={(e) => this.handleChange()}
		      />
		    </div>
		  </Grid>
		  <Grid item xs={12}>
		    <TextField
			id="news_link"
			defaultValue=""
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			label="Link (optional)"
		        value={link}
			onChange={() => this.handleChange()}
		    />
		  </Grid>
		  <Grid item xs={12}>
		    <EntryTextField
			id="news_description"
			required
			defaultValue=""
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			multiline
		        inputProps={{ rowsMin: 5 }}
			label="Content"
		        value={description}
			onChange={() => this.handleChange()}
			addMention={(x) => {
			    this.setState({ mention: Object.assign({}, mention, x)});
			    this.handleChange();
			}}
		    />
		  </Grid>
		  <Grid item xs={6} className={classes.buttonWrapper}>
		    <Confirmation
			disabled={!enableNews}
			onClick={() => this.handleMutate()}
			message="Are you sure you want to __submit__ this news?"
			preview={() => (document.getElementById('news_description').value)}
			mention={mention}
		    >
		      <Button
			  disabled={!enableNews}
			  className={classes.actionNews}
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

NewsCreate.propTypes = {
    classes: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export const DonationVal = 'donation';
export const RewardVal = 'reward';

export default withRouter(withApollo(withStyles(styles)(NewsCreate)));
