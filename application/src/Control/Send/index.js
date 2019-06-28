/*

   Render NavBar for the Send tabs

*/

import React from 'react';
import PropTypes from 'prop-types';

import NavBar from '../NavBar';
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

const options = [
    [
	'People',
	makePersonFilter,
	<PersonList />,
    ],
    [
	'Transactions',
	makeTransactionFilter,
	<TransactionList />,
    ],
]

function Send({ value, children }) {
    return (
	<NavBar value={value} options={options}>
	  {children}
	</NavBar>
    )
};

Send.propTypes = {
    value: PropTypes.number.isRequired,
};

export { PersonVal, TransactionVal };
export default Send;
