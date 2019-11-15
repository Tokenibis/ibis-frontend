import React from 'react';

import TransferCreate, { TransactionVal } from '../__Common__/TransferCreate';

function TransactionCreate(props) {
    return (
	<TransferCreate variant={TransactionVal} {...props} />
    );
};

export default TransactionCreate;
