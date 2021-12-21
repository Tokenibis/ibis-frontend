import React from 'react';

import Filter from '../../__Common__/Filter';
import TransferList, { DonationVal, DefaultFilter } from '../../__Common__/TransferList';
import { IbisConsumer } from '../../Context';

function DonationList(props) {
    return (
	<TransferList variant={DonationVal} {...props} />
    );
};

function DonationFilter(props) {
    return (
	<IbisConsumer>
	  {context => (
	      <Filter
		  options={context.userType === 'person' ?
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

export { DonationFilter };
export default DonationList;
