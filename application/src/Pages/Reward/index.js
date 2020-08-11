import React from 'react';

import Transfer, { RewardVal } from '../../__Common__/Transfer';

function Donation(props) {
    return (
	<Transfer variant={RewardVal} {...props} />
    );
};

export default Donation;
