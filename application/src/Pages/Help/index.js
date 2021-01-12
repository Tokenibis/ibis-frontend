import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';

import CustomMarkdown from '../../__Common__/CustomMarkdown';
import UserAgreement from '../../__Common__/UserAgreement'

let introduction = `
__Welcome to the Token Ibis help page. For basic usage, we recommend
walking through the interactive Tutorial.__
`

let message = `

In addition to the basic functionality, here is some more guidance on
"advanced" features of the app.

## Adding Ibis to your Home Screen

Token Ibis is what's called a _Progress Web App_ (PWA), a rapidly
growing type of technology that you can visit from anywhere (like a
normal website) but download to your phone (like a mobile app). Here's
how to download it:

* __Android + Chrome__
    1. Main Menu (triple dots)
    2. Add to Home Screen

* __Android + Samsung Internet__
    1. Main Menu (hamburger menu) 
    2. Add page to
    3. Home screen

* __iOS + Safari__
    1. Do something

For iPhone users, you _must_ download with Safari, even if you use
another browser like Chrome. Don't worry, you won't really how you
downloaded it after it's done. If you use some other type of device,
please let us know.

## Formatting Posts and Comments

Ibis uses _Markdown language_ to format all content much like reddit.
For those of you that are unfamiliar, Markdown language lets you enter
in plain-text characters into your content into nicely formatted text
with headers, italics, images, lists, hyperlinks, etc. just like this
page. For instance, typing \\*\\*I am bold\\*\\* will turn into **I am
bold**. For more tips, checkout this [Markdown
Cheatsheet](https://www.markdownguide.org/cheat-sheet/).

In addition to the standard Markdown standard, Token Ibis also allows
you to embedd videos from standard video players including YouTube,
Facebook, SoundCloud, Streamable, Vidme, Vimeo, Wistia, Twitch,
DailyMotion, and Vidyard. Simply link the _video_ URL using Markdown
_image_ syntax.

## More Info

And if you have any lingering issues, questions, or commends, please
reach out! You can reach us at
[info@tokenibis.org](mailto:info@tokenibis.org) or learn more about
our mission at [tokenibis.org](https://tokenibis.org).
`

const styles = theme => ({
    inner: {
	width: '90%',
	paddingBottom: theme.spacing(2),
    },
    agreement: {
	color: theme.palette.tertiary.main,
	width: '90%',
	textAlign: 'center',
	paddingBottom: theme.spacing(4),
    },
    buttonWrapper: {
	width: '100%',
	textAlign: 'center',
    },
    tutorialButton: {
	width: '90%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	marginBottom: theme.spacing(1),
    },
});

const mutation = loader('../../Static/graphql/app/TutorialUpdate.gql')

class Help extends Component {
    
    state = {
	tutorialLoading: false,
    }

    handleTutorial() {
	let { context, client } = this.props;
	client.mutate({
	    mutation,
	    variables: {
		id: context.userID,
		tutorial: true,
	    },
	}).then(response => {
	    window.location.replace('/')
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	});
	this.setState({ tutorialLoading: true });
    }

    render() {
	let { classes } = this.props;
	let { tutorialLoading } = this.state;

	return (
	    <Grid container direction="column" justify="center" alignItems="center" >
	      <div className={classes.inner}>
		<CustomMarkdown safe source={introduction} />
	      </div>
	      <div className={classes.buttonWrapper}>
		{tutorialLoading ? (
		    <CircularProgress />
		):(
		    <Button
			className={classes.tutorialButton}
			onClick={() => this.handleTutorial()}
			>
		      Start Tutorial
		    </Button>
		)}
	      </div>
	      <div className={classes.inner}>
		<CustomMarkdown safe source={message} />
	      </div>
	      <Typography variant="body2" className={classes.agreement}>
		<UserAgreement using/>
	      </Typography>
	    </Grid>
	);
    };
};

export default withApollo(withStyles(styles)(Help));
