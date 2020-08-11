import React from 'react';
import Filter from '../../__Common__/Filter';

import TransferList, { RewardVal } from '../../__Common__/TransferList';

function RewardList(props) {
    return (
	<TransferList variant={RewardVal} {...props} />
    );
};

function RewardFilter(props) {
    return <Filter options={['All', 'Following', 'Mine', 'Bookmarked']} {...props} />;
}

export { RewardFilter };
export default RewardList;
