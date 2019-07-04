/*

   Render TabBar for the Send tabs

*/

import React from 'react';
import PropTypes from 'prop-types';

import TabBar from '../TabBar';
import PersonList, { PersonFilter } from '../../Pages/PersonList';
import TransactionList, { TransactionFilter } from '../../Pages/TransactionList';

const PersonVal = 0;
const TransactionVal = 1;

const makePersonFilter = (onClose) => {
    return <PersonFilter open={true} onClose={onClose} />
}

const makeTransactionFilter = (onClose) => {
    return <TransactionFilter open={true} onClose={onClose} />
}

const makePersonList = (filterValue) => {
    return <PersonList filterValue={filterValue} />
}

const makeTransactionList = (filterValue) => {
    return <TransactionList filterValue={filterValue} />
}

const options = [
    [
	'People',
	makePersonFilter,
	makePersonList
    ],
    [
	'Transactions',
	makeTransactionFilter,
	makeTransactionList,
    ],
]

function Send({ value, children }) {
    return (
	<TabBar value={value} options={options}>
	  {children}
	</TabBar>
    )
};

Send.propTypes = {
    value: PropTypes.number.isRequired,
};

export { PersonVal, TransactionVal };
export default Send;
