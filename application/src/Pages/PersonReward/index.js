import React from 'react';

import TransferCreate, { RewardVal } from '../../__Common__/TransferCreate';

function PersonReward(props) {
    return (
	<TransferCreate variant={RewardVal} {...props} />
    );
};

export default PersonReward;
