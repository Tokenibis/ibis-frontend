import React from 'react';
import PropTypes from 'prop-types';

import NavBar from '../NavBar';
import NonprofitList from '../../Pages/NonprofitList';
import DonationList from '../../Pages/DonationList';

const NonprofitVal = 0;
const DonationVal = 1;

let options = {
    'Nonprofits': <NonprofitList handleWindow={() => {console.error('Not Implemented')}} />,
    'Donations': <DonationList handleWindow={() => {console.error('Not Implemented')}} />,
};

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
