/*

   Render TabBar for the Give tabs

*/

import React from 'react';
import PropTypes from 'prop-types';

import TabBar from '../TabBar';
import NonprofitList, { NonprofitFilter } from '../../Pages/NonprofitList';
import DonationList, { DonationFilter }from '../../Pages/DonationList';

const NonprofitVal = 0;
const DonationVal = 1;

const makeNonprofitFilter = (onClose) => {
    return <NonprofitFilter open={true} onClose={onClose} />
}

const makeDonationFilter = (onClose) => {
    return <DonationFilter open={true} onClose={onClose} />
}

const makeNonprofitList = (filterValue) => {
    return <NonprofitList filterValue={filterValue} />
}

const makeDonationList = (filterValue) => {
    return <DonationList filterValue={filterValue} />
}

const options = [
    [
	'Nonprofits',
	makeNonprofitFilter,
	makeNonprofitList,
    ],
    [
	'Donations',
	makeDonationFilter,
	makeDonationList,
    ],
]

function Give({ value, children }) {
    return (
	<TabBar value={value} options={options}>
	  {children}
	</TabBar>
    )
};

Give.propTypes = {
    value: PropTypes.number.isRequired,
};

export { NonprofitVal, DonationVal };
export default Give;
