import React from 'react';
import PropTypes from 'prop-types';

import NavBar from '../NavBar'
import PersonList from '../../Pages/PersonList'
import TransactionList from '../../Pages/TransactionList'

const PersonVal = 0;
const TransactionVal = 1;

let options = {
    'People': <PersonList handleWindow={() => {console.error('Not Implemented')}} />,
    'Transactions': <TransactionList handleWindow={() => {console.error('Not Implemented')}} />,
};

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
