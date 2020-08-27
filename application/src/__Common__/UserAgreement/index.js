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

Opening an account on the Token Ibis application allows you to do the
following:

* Receive a weekly Universal Basic Philanthropy distribution (called
  philanthropy dollars).

* Give philanthropy dollars to organizations.

* Post on the Token Ibis forum

* Engage with other users and organizations

* Earn more philanthropy dollars by interacting with Bots

## Deposit Statement:

### Part I

You may not withdraw any money you receive or deposit into your
Token Ibis account. Only registered organizations may cash out
philanthropy dollars as standard USD to perform their tax-exempt
business operations. However, Token Ibis retains the right to
modify balances and issue USD refunds as necessary in response to
unforeseen administrative events.

### Part II

Token Ibis retains the right to implement and alter the
distribution algorithms in any way that promotes engagement,
security, and fairness.

## Token Ibis Organization Responsibilities

Token Ibis is responsible for handling and transferring your money
(converted to philanthropy) both safely and securely. Token Ibis
also is responsible for due diligence to ensure that
organizations are legitimate nonprofits committed to fulfilling
their tax-exempt purposes.

## User Responsibilities

You are responsible for maintaining control of any IDs, passwords, or
codes that you use to access your Token Ibis account. You may close
your Token Ibis account at any time without any cost to you. However,
if your account has any philanthropy dollars in it at the time of
closing, you may not convert this back to currency in compliance with
the currency conversion statement above.

## Privacy Policy

Token Ibis collects and uses personal data from users in order to
improve the user experience of the application and to study how the
application contributes to the Universal Basic Philanthropy theory
that it aims to support. In addition, we retain the right to share
user data with other organizations for research purposes. Any formal
studies that arises from such collaborations will be overseen by an
Institutional Review Board to ensure ethical behavior.
`;

function UserAgreement({ text, using }) {
    return (
	<Popup wide message={agreement}>
	  <span>By {using ? 'using this app' : 'signing on'}, you are agreeing to our <u>terms and conditions</u> and privacy policy</span>
	</Popup>
    )
}

export default UserAgreement;
