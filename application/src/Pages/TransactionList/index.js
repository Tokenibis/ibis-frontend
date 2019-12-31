import React from 'react';
import Filter from '../__Common__/Filter';

import TransferList, { TransactionVal } from '../__Common__/TransferList';

function TransactionList(props) {
    return (
	<TransferList variant={TransactionVal} {...props} />
    );
};

function TransactionFilter(props) {
    return <Filter options={['All', 'Following', 'Mine']} {...props} />;
}

export { TransactionFilter };
export default TransactionList;
