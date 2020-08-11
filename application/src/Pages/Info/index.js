import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import CustomMarkdown from '../../__Common__/CustomMarkdown';
import UserAgreement from '../../__Common__/UserAgreement'

let message = `

## Welcome

Welcome to the official Ibis app! As we enter the first stage of
testing, the name of the game is to generate as much activity as
possible. By putting in a little bit of money, sending it around,
and engaging with the community, you are helping us build a
stronger case to empower the students of Albuquerque and
eventually change the world (maybe). To learn more about our
mission or to donate, visit https://tokenibis.org. Even better,
if you want to show your support, follow us on social media on
[facebook](https://www.facebook.com/tokenibis/),
[instagram](https://www.instagram.com/tokenibis/), or
[twitter](https://twitter.com/tokenibis).

## Beta Testing

This code is in _Beta Testing_, which means that we're still working
out some kinks. If you find one yourself, the most helpful thing you
can do is to email us at __info@tokenibis.org__ to let us know. If
you're the first one to find it, we might even send a few extra ibis
dollars your way. 

All Token Ibis software is 100% free and open source. If you're a
developer yourself and see some areas for improvement, we also welcome
issue reports and pull request at https://github.com/Tokenibis.

__IMPORTANT!__ At this stage, although we will honor all
completed donations made on the app, we may have to make changes
that could affect your balance and reward history. This
could be extreme as deleting the entire database of rewards.
If so, we will send out notifications via the email connected to
your account so you can complete your donations in a timely
manner. All unspent funds afterwards will be lost to you and
recycled back for a future user base.

## Using the App

Ibis is your one-stop shop to donate, engage with our listed
partnering organizations, and send money to people who might be
interested. Here is a general list of general features we currently
support:

* Donate to organizations
* Send money to people
* Browse news and events from local organizations
* Post or comment with your thoughts
* Follow people and organizations
* Like, bookmark, and RSVP on other activity
* View in-app notifications (upper right corner of the home screen)
* Set privacy on donations and rewards

In the coming months, we'll be adding these features and likely many
more:

* Custom profile pictures and/or handles (feel free to email us to
  have this changed right now if you care enough)
* Email notifications
* In-app deposits using Paypal/Credit cards
* QR code scanning for various operations

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

## Troubleshooting

Since Ibis is in Beta mode, we do expect that things will break
at some point. In general here are some standard procedures we 
recommend trying first:

1. Refresh the page.

2. Log out and then back in.

3. Try in the mobile browser (instead of home-screen app).

4. Clear the cache and cookies for your mobile browser.

5. Download new updates for your mobile browser.

6. Try in a desktop browser.

And if all fails, the last step, of course, is to email us at
__info@tokenibis.org__.

---
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
});

function Info({ classes }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center" >
	  <div className={classes.inner}>
	    <CustomMarkdown safe source={message} />
	  </div>
	  <Typography variant="body2" className={classes.agreement}>
	    <UserAgreement using/>
	  </Typography>
	</Grid>
    );
};

export default withStyles(styles)(Info);
