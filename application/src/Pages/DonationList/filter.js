import React from 'react';
import DonationIcon from '@material-ui/icons/AttachMoney';

import Filter from '../__Common__/Filter';

const options = ['Me', 'Following', 'Public'];

function DonationFilter(props) {
    return (
	<Filter
	    title="Filter Donations"
	    icon={<DonationIcon />}
	    options={options} {...props}
	/>
    );
}

export default DonationFilter;
