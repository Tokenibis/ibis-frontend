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
import { StandardVal, GiveVal, SendVal, EngageVal } from '../Cycler'
import MainBar from '../MainBar';
import Home from '../Home';
import { OrganizationFilter } from '../../Pages/OrganizationList';
import { DonationFilter } from '../../Pages/DonationList';
import { PersonFilter } from '../../Pages/PersonList';
import { TransactionFilter } from '../../Pages/TransactionList';
import { NewsFilter } from '../../Pages/NewsList';
import { EventFilter } from '../../Pages/EventList';
import { PostFilter } from '../../Pages/PostList';

import { IbisConsumer } from '../../Context';

const makeOrganizationFilter = (i, onClose) => {
    return <OrganizationFilter key={i} open={true} onClose={onClose} />
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

const makePostFilter = (i, onClose) => {
    return <PostFilter key={i} open={true} onClose={onClose} />
}

/*
   Each "option" corresponds to a cycle; the items are laid out in the following schema:
   [ display name, filter component, level-1 route, level-2 route ]
*/

const giveOptions = [
    [ 'Organizations', makeOrganizationFilter, 'Organization', 'OrganizationList' ],
    [ 'Donations', makeDonationFilter, 'Donation', 'DonationList' ],
]

const sendOptions = [
    [ 'People', makePersonFilter, 'Person', 'PersonList' ],
    [ 'Transaction', makeTransactionFilter, 'Transaction', 'TransactionList' ],
]

const engageOptions = [
    [ 'News', makeNewsFilter, 'News', 'NewsList' ],
    [ 'Events', makeEventFilter, 'Event', 'EventList' ],
    [ 'Posts', makePostFilter, 'Post', 'PostList' ],
]

function HomeLoader()  {
   return ( 
       <div>
	 <MainBar cycle={StandardVal} />
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
    let mode = match.params.mode;
    if (mode.slice(0, 2) === '__' && mode.slice(-2) === '__') {
	mode = '_';
    }

    switch (mode) {
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
	case 'Organization':
	    nav = (
		<div>
		  <MainBar cycle={GiveVal} />
		  <TabBar options={giveOptions} value={0} />
		</div>
	    );
	    pageName = pageName ? pageName : 'OrganizationList';
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
		  <MainBar cycle={EngageVal} />
		  <TabBar options={engageOptions} value={0} />
		</div>
	    );
	    pageName = pageName ? pageName : 'NewsList';
	    break;
	case 'Event':
	    nav = (
		<div>
		  <MainBar cycle={EngageVal} />
		  <TabBar options={engageOptions} value={1} />
		</div>
	    );
	    pageName = pageName ? pageName : 'EventList';
	    break;
	case 'Post':
	    nav = (
		<div>
		  <MainBar cycle={EngageVal} />
		  <TabBar options={engageOptions} value={2} />
		</div>
	    );
	    pageName = pageName ? pageName : 'PostList';
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
