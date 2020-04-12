import React from 'react';
import Filter from '../../__Common__/Filter';

import TransferList, { DonationVal } from '../../__Common__/TransferList';

function DonationList(props) {
    return (
	<TransferList variant={DonationVal} {...props} />
    );
};

function DonationFilter(props) {
    return <Filter options={['All', 'Following', 'Mine']} {...props} />;
}

export { DonationFilter };
export default DonationList;
