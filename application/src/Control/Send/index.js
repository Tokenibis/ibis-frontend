import React from 'react';
import PropTypes from 'prop-types';

import NavBar from '../NavBar';
import PersonFilter from '../../Pages/PersonList/filter';
import TransactionFilter from '../../Pages/TransactionList/filter';
import PersonList from '../../Pages/PersonList';
import TransactionList from '../../Pages/TransactionList';

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
