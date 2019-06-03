import React from 'react';
import PropTypes from 'prop-types';

import NavBar from '../NavBar';
import NonprofitFilter from '../../Pages/NonprofitList/filter';
import DonationFilter from '../../Pages/DonationList/filter';
import NonprofitList from '../../Pages/NonprofitList';
import DonationList from '../../Pages/DonationList';

const NonprofitVal = 0;
const DonationVal = 1;

const makeNonprofitFilter = (onClose) => {
    return <NonprofitFilter open={true} onClose={onClose} />
}

const makeDonationFilter = (onClose) => {
    console.log('filter')
    return <DonationFilter open={true} onClose={onClose} />
}

const options = [
    [
	'Nonprofits',
	makeNonprofitFilter,
	<NonprofitList />,
    ],
    [
	'Donations',
	makeDonationFilter,
	<DonationList />,
    ],
]

function Give({ value, children }) {
    return (
	<NavBar value={value} options={options}>
	  {children}
	</NavBar>
    )
};

Give.propTypes = {
    value: PropTypes.number.isRequired,
};

export { NonprofitVal, DonationVal };
export default Give;
