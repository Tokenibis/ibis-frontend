import React from 'react';

import TransferCreate, { DonationVal } from '../../__Common__/TransferCreate';

function OrganizationDonate(props) {
    return (
	<TransferCreate variant={DonationVal} {...props} />
    );
};

export default OrganizationDonate;
