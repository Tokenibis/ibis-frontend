import React from 'react';
import Filter from '../../__Common__/Filter';

import TransferList, { RewardVal, DefaultFilter } from '../../__Common__/TransferList';
import { IbisConsumer } from '../../Context';

function RewardList(props) {
    return (
	<TransferList variant={RewardVal} {...props} />
    );
};

function RewardFilter(props) {
    return (
	<IbisConsumer>
	  {context => (
	      <Filter
		  options={context.userType === 'bot' ?
			   ['All', 'Following', 'Mine', 'Bookmarked'] :
			   ['All', 'Following', 'Bookmarked']
		  }
		  defaultVal={DefaultFilter}
	      {...props}
	      />
	  )}
	</IbisConsumer> 
    )
}

export { RewardFilter };
export default RewardList;
