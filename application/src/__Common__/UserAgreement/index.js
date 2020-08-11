import React from 'react';

import Popup from '../../__Common__/Popup';

let agreement = `# USER AGREEMENT

## Introduction

This user agreement is a contract between you and Token Ibis. By
creating an account with Token Ibis, you agree to follow the terms and
conditions stated in this user agreement. You also agree to comply
with the privacy policy stated below. We reserve the right to change
the policies for this agreement at any time.

# Services

Opening an account on the Token Ibis application allows you to do the following:

* Send Token Ibis to other users.

* Receive Token Ibis from other users.

* Give Token Ibis to vetted Organization organizations.

* Engage and interact with news and events that are posted in the application.

*  Post on the Token Ibis forum and interact with other posts.

## Currency Conversion Statement:

### Part I

Once you choose to convert currency to Token Ibis or receive it from
another source, you may not convert it back to currency. You may only
send Token Ibis to other users, receive Token Ibis from other users,
or give it to organizations organizations within the application. Only
vetted organization organizations may convert Token Ibis back that has
been given to them back into a currency in order to use it for their
business operations.

### Part II

If a user has been inactive in the application for a long period of
time, Token Ibis retains the right to redistribute a portion of the
user’s Token Ibis that is deemed appropriate for other uses within the
application. This also pertains to a user that has closed their
account. Token Ibis may redistribute said user’s Token Ibis for other
uses within the application.

## Token Ibis Organization Responsibilities

Token Ibis is responsible for handling and transferring your money
(converted to Token Ibis) both safely and securely. Token Ibis also is
responsible for thoroughly examining and approving each and every
organization organization that can receive donations within the Token
Ibis application to make sure that they are legitimate businesses with
legitimate causes and positive results.

## User Responsibilities

You are responsible for maintaining control of any IDs, passwords, or
codes that you use to access your Token Ibis account. You may close
your Token Ibis account at any time without any cost to you. However,
if your account has any Token Ibis in it at the time of closing, you
may not convert this back to currency in compliance with the currency
conversion statement above.

## Privacy Policy

Token Ibis collects and uses personal data from users in order to
improve the user experience of the application and to further research
how the application contributes to the Universal Basic Philanthropy
theory that it aims to support.

### Token Ibis may collect the following data for use:

* The user’s name and/or account name.

* The amount of Token Ibis in a user’s account.

* User activities within the application including:

    * The amount of Token Ibis that a user gives to different organizations.

    * The amount of pages that a user visits within the application and the duration of each visit.

    * Events including, but not limited to: sending Token Ibis to
      other users, receiving Token Ibis from other users, donations to
      organizations, and user interaction on the Token Ibis forums and
      other interactable pages.

Token Ibis promises to protect the personal data that it collects from
users and only use it for the purposes stated above. Token Ibis also
promises not to share personal data with any other entities unless it
specifically notifies the user and asks the user for permission.
However, Token Ibis may use your data to share aggregated observations
in a way that does not identify you.
`;

function UserAgreement({ text, using }) {
    return (
	<Popup wide message={agreement}>
	  <span>By {using ? 'using this app' : 'signing on'}, you are agreeing to our <u>terms and conditions</u> and privacy policy</span>
	</Popup>
    )
}

export default UserAgreement;
