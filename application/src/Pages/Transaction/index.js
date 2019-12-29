import React from 'react';

import Transfer, { TransactionVal } from '../__Common__/Transfer';

function Donation(props) {
    return (
	<Transfer variant={TransactionVal} {...props} />
    );
};

export default Donation;
