import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import CustomMarkdown from '../__Common__/CustomMarkdown';

let message = `

## Welcome

Welcome to the official Ibis app! As we enter the first stage of
testing, the name of the game is to generate as much activity as
possible. By putting in a little bit of money, sending it around, and
engaging with the community, you are helping us build a stronger case
to empower the students of Albuquerque and eventually change the world
(maybe). To learn more about our mission or to donate, visit
https://tokenibis.org.

## Reporting Bugs

This code is in _Beta Testing_, which means that we're still working
out some kinks. If you find one yourself, the most helpful thing you
can do is to email us at __info@tokenibis.org__ to let us know. If
you're the first one to find it, we might even send a few extra ibis
dollars your way. 

All Token Ibis software is 100% free and open source. If you're a
developer yourself and see some areas for improvement, we also welcome
issue reports and pull request at https://github.com/Tokenibis.

## Using the App

Ibis is your one-stop shop to donate, engage with our listed
partnering nonprofits, and send money to people who might be
interested. Here is a general list of general features we currently
support:

* Donate to nonprofits
* Send money to people
* Browse news and events from local nonprofits
* Post or comment with your thoughts
* Follow people and nonprofits
* Like, bookmark, and RSVP on other activity
* View in-app notifications (upper right corner of the home screen)
* Set privacy on donations and transactions

In the coming months, we'll be adding these features and likely many
more:

* Custom profile pictures and/or handles (feel free to email us to
  have this changed right now if you care enough)
* Email notifications
* In-app deposits using Paypal/Credit cards
* QR code scanning for various operations
* Post/comment preview

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
`

const styles = theme => ({
    inner: {
	width: '90%',
	paddingBottom: theme.spacing(4),
    },
});

function Info({ classes }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center" >
	  <div className={classes.inner}>
	    <CustomMarkdown safe source={message} />
	  </div>
	</Grid>
    );
};

export default withStyles(styles)(Info);
