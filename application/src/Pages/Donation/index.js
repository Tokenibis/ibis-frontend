import React from 'react';

import Transfer, { DonationVal } from '../__Common__/Transfer';

function Donation(props) {
    return (
	<Transfer variant={DonationVal} {...props} />
    );
};

export default Donation;
