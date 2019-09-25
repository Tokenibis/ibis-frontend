/*

   Content is the main entry point for the App post-authentication. It
   defines and handles the 2-level routing/layout structure of the
   app. The level-1 options, which defines the implementation of the
   navagational bars, is more or less fixed. At this level, Content
   also defines the default display pages for unspecified level 1
   routes.
   
   On level 2, Content dynamically loads the named module from
   src/Pages if it exists.

*/

import React from 'react';
import { Route, HashRouter as Router } from 'react-router-dom';

import TabBar from '../TabBar';
import { StandardVal, GiveVal, SendVal, ExploreVal } from '../Cycler'
import MainBar from '../MainBar';
import Home from '../Home';
import { NonprofitFilter } from '../../Pages/NonprofitList';
import { DonationFilter } from '../../Pages/DonationList';
import { PersonFilter } from '../../Pages/PersonList';
import { TransactionFilter } from '../../Pages/TransactionList';
import { NewsFilter } from '../../Pages/NewsList';
import { EventFilter } from '../../Pages/EventList';

import { IbisConsumer } from '../../Context';

const makeNonprofitFilter = (i, onClose) => {
    return <NonprofitFilter key={i} open={true} onClose={onClose} />
}

const makeDonationFilter = (i, onClose) => {
    return <DonationFilter key={i} open={true} onClose={onClose} />
}

const makePersonFilter = (i, onClose) => {
    return <PersonFilter key={i} open={true} onClose={onClose} />
}

const makeTransactionFilter = (i, onClose) => {
    return <TransactionFilter key={i} open={true} onClose={onClose} />
}

const makeNewsFilter = (i, onClose) => {
    return <NewsFilter key={i} open={true} onClose={onClose} />
}

const makeEventFilter = (i, onClose) => {
    return <EventFilter key={i} open={true} onClose={onClose} />
}

const giveOptions = [
    [ 'Nonprofits', makeNonprofitFilter, 'Nonprofit', 'NonprofitList' ],
    [ 'Donations', makeDonationFilter, 'Donation', 'DonationList' ],
]

const sendOptions = [
    [ 'People', makePersonFilter, 'Person', 'PersonList' ],
    [ 'Transaction', makeTransactionFilter, 'Transaction', 'TransactionList' ],
]

const exploreOptions = [
    [ 'News', makeNewsFilter, 'News', 'NewsList' ],
    [ 'Events', makeEventFilter, 'Event', 'EventList' ],
]

function HomeLoader()  {
   return ( 
       <div>
	 <MainBar cycle={StandardVal} hideHome />
	 <IbisConsumer>
	   {context => (
	       <Home context={context}/>
	   )}
	 </IbisConsumer> 
       </div>
   );
};

function ContentLoader({ match, location }) {

    let nav;
    let pageName = match.params.page;

    switch (match.params.mode) {
	case '_':
	    nav = (
		<div>
		  <MainBar cycle={StandardVal} />
		</div>
	    );
	    if (pageName === undefined) {
		return <HomeLoader />
	    }
	    break;
	case 'Nonprofit':
	    nav = (
		<div>
		  <MainBar cycle={GiveVal} />
		  <TabBar options={giveOptions} value={0} />
		</div>
	    );
	    pageName = pageName ? pageName : 'NonprofitList';
	    break;
	case 'Donation':
	    nav = (
		<div>
		  <MainBar cycle={GiveVal} />
		  <TabBar options={giveOptions} value={1} />
		</div>
	    );
	    pageName = pageName ? pageName : 'DonationList';
	    break;
	case 'Person':
	    nav = (
		<div>
		  <MainBar cycle={SendVal} />
		  <TabBar options={sendOptions} value={0} />
		</div>
	    );
	    pageName = pageName ? pageName : 'PersonList';
	    break;
	case 'Transaction':
	    nav = (
		<div>
		  <MainBar cycle={SendVal} />
		  <TabBar options={sendOptions} value={1} />
		</div>
	    );
	    pageName = pageName ? pageName : 'TransactionList';
	    break;
	case 'News':
	    nav = (
		<div>
		  <MainBar cycle={ExploreVal} />
		  <TabBar options={exploreOptions} value={0} />
		</div>
	    );
	    pageName = pageName ? pageName : 'NewsList';
	    break;
	case 'Event':
	    nav = (
		<div>
		  <MainBar cycle={ExploreVal} />
		  <TabBar options={exploreOptions} value={1} />
		</div>
	    );
	    pageName = pageName ? pageName : 'EventList';
	    break;
	default:
	    return "Error, Page not Found";
    };

    let Page = require(`../../Pages/${pageName}`).default;

    let urlParams = location.search.slice(1).split('&').reduce((obj, x) =>
	Object.assign(obj, { [x.split('=')[0]]: x.split('=').slice(1).join('=') }), {});

    let page = (
	  <IbisConsumer>
	    {context => (
		<div style={{ margin: '0 auto', maxWidth: context.maxWindowWidth }}>
		  <Page context={context} {...urlParams} />
		</div>
	    )}
	  </IbisConsumer> 
    );

    return (
	<div>
	  {nav}
	  {page}
	</div>
    )
}

function Content() {
    return (
	<div>
	  <Router>
	    <Route path="/" exact component={HomeLoader} />
	    <Route path="/:mode/:page?" exact component={ContentLoader} />
	  </Router>
	</div>
    );
};

export default Content;
