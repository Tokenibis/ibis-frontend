import React from 'react';

import TransferCreate, { RewardVal } from '../../__Common__/TransferCreate';

function RewardCreate(props) {
    return (
	<TransferCreate variant={RewardVal} {...props} />
    );
};

export default RewardCreate;
