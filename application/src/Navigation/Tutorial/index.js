/*

   Tutorial system for navigating through the app. There's some weird
   off-by-one voodoo to accommodate our multi-tour use case when
   reactour disables the next/prev buttons at the beginning and end of
   the individual tour. Basically, we have to have a fake (hidden)
   step at the beginning and end which triggers the next/prev tour.

*/
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { withApollo } from 'react-apollo';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import Dialog from '@material-ui/core/Dialog';
import Tour from 'reactour'

import CustomMarkdown from '../../__Common__/CustomMarkdown';

import "./reactour.css";

const styles = theme => ({
    helper: {
	width: '60%',
    },
    arrow: {
	color: theme.palette.secondary.main,
	marginLeft: 0,
	marginRight: 0,
    },
    dialogInner: {
	padding: theme.spacing(2),
	textAlign: 'center',
    },
    closeWrapper: {
	width: '100%',
	textAlign: 'center',
    },
    paperProps: {
	width: '60%',
	margin: theme.spacing(1),
    },
    dialogButton: {
	margin: theme.spacing(1),
	color: theme.palette.secondary.main,
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	width: theme.spacing(10),
    },
    dialogClose: {
	margin: theme.spacing(1),
	color: theme.palette.secondary.main,
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	width: theme.spacing(20),
    },
    nav: {
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
    },
});

const query = loader('../../Static/graphql/app/Tutorial.gql')

const mutation = loader('../../Static/graphql/app/TutorialUpdate.gql')

class Tutorial extends Component {

    state = {
	open: false,
	tours: null,
	step: 1,
	tour: 0,
	dialog: '',
    }

    getPersonTour(results) {
	let { classes } = this.props;

	let organization = results.data.allOrganizations.edges[0].node.id;
	let name = results.data.notifier.user.firstName;

	let startSteps = [
	    {
		content: <CustomMarkdown source={`
## Welcome to Token Ibis, ${name}!

We give you free money to donate to any of our partner nonprofits,
plus fun opportunities to earn more and amplify your impact.

This tutorial will guide you through the app’s features.
		`} />,
		action: () => { window.location.href = '/#/'; },
	    },
	    {
		selector: '#tutorial-balance',
		content: <CustomMarkdown source={`
Here is your balance. Every week that you’re active, we’ll add more
money to your account for free so you can keep donating!
		`} />,
	    },
	    {
		selector: '#tutorial-navigation',
		content: <CustomMarkdown source={`
Now we’ll guide you through everything you can do on the app. Let’s
head to “Organizations” first.
		`} />,
		action: () => { window.location.href = '/#/'; },
	    },
	];

	let organizationSteps = [
	    {
		content: <CustomMarkdown source={`
## Nonprofit Organizations

Here are all the wonderful nonprofits that you can learn about and
donate to through Token Ibis.
		`} />,
		action: () => { window.location.href = '/#/Organization/OrganizationList'; },
	    },
	    {
		selector: '#tutorial-item-0',
		content: <CustomMarkdown source={`
Click on any organization to find out more about it.
		`} />,
		action: () => { window.location.href = '/#/Organization/OrganizationList'; },
	    },
	    {
		content: <CustomMarkdown source={`
This is the profile page that explains what they do.
		`} />,
		action: () => { window.location.href = `/#/Organization/Organization?id=${organization}`; },
	    },
	    {
		selector: '#tutorial-donate',
		content: <CustomMarkdown source={`
Maybe you like what you see, so you donate.
		`} />,
		action: () => { window.location.href = `/#/Organization/Organization?id=${organization}`; },
	    },
	    {
		content: <CustomMarkdown source={`
Here’s where you donate; just add an amount you want to give and a
short message to the organization.
		`} />,
		action: () => { window.location.href = `/#/Organization/DonationCreate?target=${organization}`; },
	    },
	    {
		selector: '#tutorial-arrow-next',
		content: <CustomMarkdown source={`
Once you do, your donation will be added to the others from members of
the community. Now let’s go to the “People” tab to see some of the
social aspects of the app.
		`} />,
		action: () => { window.location.href = `/#/Organization/DonationCreate?target=${organization}`; },
	    },
	];

	let personSteps = [
	    {
		content: <CustomMarkdown source={`
## Other Users

Here the most recently active users. They're pretty cool people.
		`} />,
		action: () => { window.location.href = '/#/Person/PersonList'; },
	    },
	    {
		selector: '#tutorial-invite',
		content: <CustomMarkdown source={`
You can invite friends to join the app and you’ll both receive extra money to donate.
		`} />,
	    },
	    {
		selector: '#tutorial-tab-1',
		content: <CustomMarkdown source={`
This tab shows the most recent donations by the community.
		`} />,
		action: () => { window.location.href = '/#/Donation/DonationList'; },
	    },
	    {
		selector: '#tutorial-filter',
		content: <CustomMarkdown source={`
Looking for something specific? You can always filter the results here.
		`} />,
	    },
	    {
		selector: '#tutorial-arrow',
		content: <CustomMarkdown source={`
Now onto the last major section of the app, “Bots”.
		`} />,
	    },
	];

	let botSteps = [
	    {
		content: <CustomMarkdown source={`
## Token Ibis Bots

Bots are the way to earn even more money and boost your impact.
		`} />,
		action: () => { window.location.href = '/#/Bot/BotList'; },
	    },
	    {
		selector: '#tutorial-tab-1',
		content: <CustomMarkdown source={`
Check out all of the activities you can participate in and the rewards that are possible to earn.
		`} />,
		action: () => { window.location.href = '/#/Activity/ActivityList'; },
	    },
	    {
		selector: '#tutorial-tab-2',
		content: <CustomMarkdown source={`
And here’s where you can see the rewards that have already been sent out by the Token Ibis Bots. 

		`} />,
		action: () => { window.location.href = '/#/Reward/RewardList'; },
	    },
	    {
		selector: '#tutorial-menu',
		content: <CustomMarkdown source={`
That’s it for the main parts of the platform. Finally, we’ll show you one more thing...
		`} />,
		action: () => { window.location.href = '/#/Reward/RewardList'; },
	    },
	]

	let endSteps = [
	    {
		content: <CustomMarkdown source={`
## Grants

If you want to contribute your money to this project, you can make an grant in our community right on the app. We promise to distribute 100% of grants to other users to donate to worthy nonprofits. In fact, you can see exactly where your money goes right on this page.
		`} />,
		action: () => { window.location.href = '/#/_/Grant'; },
	    },
	    {
		content: (
		    <div>
		      <CustomMarkdown source={`
That\'s everything! Now you’re free to go brighten people’s days and help change the world.

---

_If you ever need to get back to the tutorial, please visit:_

___Main Menu > Help > Start Tutorial.___
		      `}/>

		      <div className={classes.closeWrapper}>
			<Button
			  className={classes.dialogClose}
			  onClick={() => this.onExit()}
			>
			  Close
			</Button>
		      </div>
		    </div>
		),
		action: () => { window.location.href = '/#/'; },
	    },
	];

	return [
	    startSteps,
	    organizationSteps,
	    personSteps,
	    botSteps,
	    endSteps,
	];
    };

    getOrganizationTour(results) {
	let { classes, context } = this.props;

	let name = results.data.notifier.user.firstName;
	let organization = context.userID;

	let startSteps = [
	    {
		content: <CustomMarkdown source={`
## Welcome to Token Ibis, ${name}!

We're here to help you get connected with a community of diverse and
engaged grassroots donors. Our community loves when organizations stay
active, this tutorial will walk through all the ways you can engage.
		`} />,
		action: () => { window.location.href = '/#/'; },
	    },
	    {
		selector: '#tutorial-metrics',
		content: <CustomMarkdown source={`
The platform itself rewards tracts and rewards your activity. Since we
believe in transparency, you can always see how we calculate your
score here.
		`} />,
	    },
	    {
		selector: '#tutorial-navigation',
		content: <CustomMarkdown source={`
Okay. Let's check out what the users actually see when they head to
the "Organizations" tab.
		`} />,
		action: () => { window.location.href = '/#/'; },
	    },
	];

	let organizationSteps = [
	    {
		content: <CustomMarkdown source={`
## Organization List

This is where users discover new organizations. Responding to donations
and posting news/events with keep you higher on this list. Let's head
to your organization's profile page.
		`} />,
		action: () => { window.location.href = '/#/Organization/OrganizationList'; },
	    },
	    {
		content: <CustomMarkdown source={`
This is where users will learn about your work. On their version of
the app, there will be a large "Donate" button on this screen.
		`} />,
		action: () => { window.location.href = `/#/Organization/Organization?id=${organization}`; },
	    },
	    {
		selector: '#tutorial-menu',
		content: <CustomMarkdown source={`
You can easily update your name, description, pictures, and more by
going to __Menu > Settings__.
		`} />,
	    },
	    {
		selector: '#tutorial-tab-1',
		content: <CustomMarkdown source={`
Next, we'll head to the __News__ section of the app.
		`} />,
		action: () => { window.location.href = `/#/Organization/Organization?id=${organization}`; },
	    },
	];

	let newsEventSteps = [
	    {
		content: <CustomMarkdown source={`
## News

Here is where you can post news articles and blog posts. The entire
community will see the headline in an email when they get their weekly
UBP payout (Thursdays at midnight). Your followers will also get a
special on-app notification.
		`} />,
		action: () => { window.location.href = '/#/News/NewsList'; },
	    },
	    {
		selector: '#tutorial-new-news',
		content: <CustomMarkdown source={`
Click this button to post a new article.
		`} />,
	    },
	    {
		selector: '#tutorial-tab-2',
		content: <CustomMarkdown source={`
Events work basically the same way, but you'll have to add dates and
locations. Users will also be able to RSVP.
		`} />,
	    },
	    {
		selector: '#tutorial-menu',
		content: <CustomMarkdown source={`
Finally, let's take a look at the __Withdrawal__ page in the __Main Menu__.
		`} />,
		action: () => { window.location.href = '/#/News/NewsList'; },
	    },
	];

	let endSteps = [
	    {
		content: <CustomMarkdown source={`
## Withdrawals

At the end of every month, we total up all of your on-app donations
and send you a physical check through the mail. Your balance will
zero-out and you'll get notified about the "Withdrawal" here. Please
allow about one week for the check to arrive.
		`} />,
		action: () => { window.location.href = '/#/_/Withdrawal'; },
	    },
	    {
		content: (
		    <div>
		      <CustomMarkdown source={`
# The End

Well, that covers most of it! But remember: our platform is open to
_everyone_, so if you ever want to get even more out of Token Ibis,
then just invite more users from your network and organization. The
more people you help us onboard, the stronger our community will be,
and the more money can raise to fund this project. Thanks for helping
make social impact accessible to everyone!

---

_If you ever need to get back to the tutorial, please visit:_

___Main Menu > Help > Start Tutorial.___
		      `}/>

		      <div className={classes.closeWrapper}>
			<Button
			  className={classes.dialogClose}
			  onClick={() => this.onExit()}
			>
			  Close
			</Button>
		      </div>
		    </div>
		),
		action: () => { window.location.href = '/#/'; },
	    },
	]

	return [
	    startSteps,
	    organizationSteps,
	    newsEventSteps,
	    endSteps,
	]
	
    };

    componentDidMount() {

	let { classes, client, context } = this.props;

	if (!(context.userType === 'Person' || context.userType === 'Organization')) {
	    return;
	}

	client.query({
	    query: query,
	    variables: { id: context.userID },
	    fetchPolicy:"no-cache",
	}).then(results => {

	    let tours = context.userType === 'Person' ?
		       this.getPersonTour(results) :
		       this.getOrganizationTour(results);

	    for (let i = 0; i < tours.length; i++) {
		tours[i].unshift({});
		tours[i].push({});
	    }

	    this.setState({
		open: results.data.notifier.tutorial,
		tours,
	    });
	})
    };

    onExit() {
	let { context, client }  = this.props;
	client.mutate({
	    mutation,
	    variables: {
		id: context.userID,
		tutorial: false,
	    },
	}).then(response => {}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	});
	this.setState({ dialog: '', open: false });
    }

    render() {
	let { classes, context, toggleMenu } = this.props;
	let { open, tours, tour, step, dialog } = this.state;

	if (dialog) {
	    return (
		<Dialog open={!!dialog} PaperProps={{ className: classes.paperProps }}>
		  <div className={classes.dialogInner}>
		    {dialog === 'confirm' ? (
			<div>
			  <CustomMarkdown source={'Are you sure you want to exit the tutorial?'} />
			  <div>
			    <Button
				className={classes.dialogButton}
				onClick={() => this.setState({ dialog: 'exit' })}
			    >
			      Yes
			    </Button>
			    <Button
				className={classes.dialogButton}
				onClick={() => this.setState({ open: true, dialog: '' })}
			    >
			      No
			    </Button>
			  </div>
			</div>
		    ):(
			<div>
			  <CustomMarkdown source={`
Okay! If you ever need to get back to the tutorial, please visit: 

__Main Menu > Help > Start Tutorial__`}/>
			  <Button
			      className={classes.dialogClose}
			      onClick={() => this.onExit()}
			    >
			    Close
			  </Button>
			</div>
		    )}
		  </div>
		</Dialog>
	    );
	}

	if (!tours || !open) {
	    return null;
	}


	let prevStep = () => {
	    if (step > 1) {
		this.setState({ step: step - 1 });
	    } else if (tour > 0) {
		if (tours[tour][1].action) {
		    tours[tour - 1][1].action();
		}
		this.setState({ tour: tour - 1, step: 1 });
	    }
	};

	let nextStep = () => {
	    if (step + 2 < tours[tour].length) {
		this.setState({ step: step + 1 });
	    } else if (tour + 1 < tours.length) {
		this.setState({ tour: tour + 1, step: 1 });
	    }
	};

	return (
	    <Tour
		className={classes.helper}
		accentColor="#3b3b3b"
		showNumber={false}
		showNavigationNumber={false}
		disableDotsNavigation={true}
		steps={tours[tour]}
		startAt={step}
		goToStep={step}
		maskClassName="reactour-mask"
		disableInteraction={true}
		prevStep={prevStep}
		nextStep={nextStep}
		rounded={10}
		showCloseButton={!(tour === tours.length - 1 && step === tours[tour].length - 2)}
		prevButton={
		    <Typography className={classes.nav}>
		      Prev
		    </Typography>
		}
		nextButton={
		    <Typography className={classes.nav}>
		      Next
		    </Typography>
		}
		closeWithMask={false}
		onRequestClose={() => this.setState({ open: false, dialog: 'confirm' })}
		isOpen={open}
	    />
	);
    }
}

export default withApollo(withStyles(styles)(Tutorial));
