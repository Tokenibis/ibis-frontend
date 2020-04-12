import React from 'react';

import TransferCreate, { DonationVal } from '../../__Common__/TransferCreate';

function DonationCreate(props) {
    return (
	<TransferCreate variant={DonationVal} {...props} />
    );
};

export default DonationCreate;
