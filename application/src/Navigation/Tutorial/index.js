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
import IconButton from '@material-ui/core/IconButton';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
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
});

const query = gql`query Tutorial($id: ID!) {
    notifier(id: $id) {
	id
	tutorial
	user {
	    id
	    firstName
	}
    }
    allOrganizations(first: 1 orderBy: "-score") {
	edges {
  	    node {
		id
	    }
	}
    }
}`

const mutation = gql`mutation TutorialUpdate($id: ID! $tutorial: String!) {
    updateNotifier(id: $id tutorial: $tutorial) {
	notifier {
	    id
	}
    }
}`

class Tutorial extends Component {

    state = {
	open: true,
	tours: null,
	tutorial: false,
	step: 1,
	tour: 0,
    }

    componentDidMount() {

	let { client, context } = this.props;

	client.query({
	    query: query,
	    variables: { id: context.userID },
	    fetchPolicy:"no-cache",
	}).then(results => {

	    let organization = results.data.allOrganizations.edges[0].node.id;
	    let name = results.data.notifier.user.firstName;

	    let startSteps = [
		{
		    content: <CustomMarkdown source={`
## Welcome to Token Ibis, ${name}!

blah blah blah; we give out free money for people to donate

This a tutorial

---

_If you need to bring up this tutorial again, just click __info__ in
the __main menu__ in the upper left._
		    `} />,
		    action: () => { window.location.href = '/#/'; },
		},
		{
		    selector: '#tutorial-balance',
		    content: <CustomMarkdown source={`
Here is your balance. As long as you're active every week, we'll add money to your account for free.
		    `} />,
		},
		{
		    selector: '#tutorial-navigation',
		    content: <CustomMarkdown source={`
Here's all the stuff you can do. Let's head to "organizations" first.
`} />,
		    action: () => { window.location.href = '/#/'; },
		},
	    ]

	    let organizationSteps = [
		{
		    content: <CustomMarkdown source={`
## Nonprofit Organizations

Here are all the wonderful nonprofits we server.
`} />,
		    action: () => { window.location.href = '/#/Organization/OrganizationList'; },
		},
		{
		    selector: '#tutorial-item-0',
		    content: <CustomMarkdown source={`
Click on one to find out more.
`} />,
		    action: () => { window.location.href = '/#/Organization/OrganizationList'; },
		},
		{
		    content: <CustomMarkdown source={`
This is the profile page; learn more about what they do.
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
Here is where you donate; just add amount and words.
`} />,
		    action: () => { window.location.href = `/#/Organization/DonationCreate?target=${organization}`; },
		},
		{
		    selector: '#tutorial-arrow-next',
		    content: <CustomMarkdown source={`
Once you do, your donation will get added to others. Let's go see some donations here
`} />,
		    action: () => { window.location.href = `/#/Organization/DonationCreate?target=${organization}`; },
		},
	    ]

	    let personSteps = [
		{
		    content: <CustomMarkdown source={`
## Other Users

Here are all of our super cool users
`} />,
		    action: () => { window.location.href = '/#/Person/PersonList'; },
		},
		{
		    selector: '#tutorial-invite',
		    content: <CustomMarkdown source={`
You can invite more people and you both get more money.
`} />,
		},
		{
		    selector: '#tutorial-tab-1',
		    content: <CustomMarkdown source={`
Seeing all the donations is also pretty cool
`} />,
		    action: () => { window.location.href = '/#/Donation/DonationList'; },
		},
		{
		    selector: '#tutorial-filter',
		    content: <CustomMarkdown source={`
Looking for something specific? Can always filter
`} />,
		},
		{
		    selector: '#tutorial-arrow',
		    content: <CustomMarkdown source={`
Onto the last major section of the app.
`} />,
		    action: () => { window.location.href = '/#/Donation/DonationList'; },
		},
	    ]

	    let botSteps = [
		{
		    content: <CustomMarkdown source={`
## Token Ibis Bots

Bots are the way to earn even more money to make an impact
`} />,
		    action: () => { window.location.href = '/#/Bot/BotList'; },
		},
		{
		    selector: '#tutorial-tab-1',
		    content: <CustomMarkdown source={`
Check out all of the activities
`} />,
		    action: () => { window.location.href = '/#/Activity/ActivityList'; },
		},
		{
		    selector: '#tutorial-tab-2',
		    content: <CustomMarkdown source={`
Users get rewarded
`} />,
		    action: () => { window.location.href = '/#/Reward/RewardList'; },
		},
		{
		    selector: '#tutorial-menu',
		    content: <CustomMarkdown source={`
Finally, if that's not enough, you can deposit your own money too.
`} />,
		    action: () => { window.location.href = '/#/Reward/RewardList'; },
		},
	    ]

	    let endSteps = [
		{
		    content: <CustomMarkdown source={`
## Deposits

We accept anything paypal allows. And (probably) will match some of it too.
`} />,
		    action: () => { window.location.href = '/#/_/Deposit'; },
		},
		{
		    content: <CustomMarkdown source={`
## The End

That's it, have fun changing the world, blah bla blah.
`} />,
		    action: () => { window.location.href = '/#/'; },
		},
	    ]

	    let tours = [
		startSteps,
		organizationSteps,
		personSteps,
		botSteps,
		endSteps,
	    ]

	    for (let i = 0; i < tours.length; i++) {
		tours[i].unshift({});
		tours[i].push({});
	    }

	    this.setState({
		tutorial: results.data.notifier.tutorial,
		tours,
	    });
	})
    }

    render() {
	let { classes, context, toggleMenu } = this.props;
	let { open, tutorial, tours, tour, step } = this.state;

	if (context.userType !== 'Person' || !tours || !tutorial) {
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

	//TODO: set isOpen to open
	//  implement workflow to signal that tutorial has been taken
	
	return (
	    <Tour
		className={classes.helper}
		accentColor="#3b3b3b"
		showNumber={false}
		showNavigationNumber={false}
		disableDotsNavigation={true}
		steps={tours[tour]}
		startAt={1}
		goToStep={step}
		maskClassName="reactour-mask"
		disableInteraction={true}
		prevStep={prevStep}
		nextStep={nextStep}
		rounded={10}
		prevButton={
		    <ArrowLeftIcon className={classes.arrow}/>
		}
		nextButton={
		    <ArrowRightIcon className={classes.arrow}/>
		}
		closeWithMask={false}
		onRequestClose={() => this.setState({ open: false })}
		isOpen={false}
	    />
	);
    }
}

export default withApollo(withStyles(styles)(Tutorial));
