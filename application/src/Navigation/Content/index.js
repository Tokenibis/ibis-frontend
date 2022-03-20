/*

   Content is the main entry point for the App post-authentication. It
   defines and handles the routing/layout structure of the app. It
   dynamically loads the named module from src/Pages if it exists.

*/

import React from 'react';
import { Route, HashRouter as Router } from 'react-router-dom';

import TabBar from '../TabBar';
import { StandardVal, OrganizationVal, PersonVal, BotVal } from '../Cycler'
import MainBar from '../MainBar';
import Home from '../Home';
import { OrganizationFilter } from '../../Pages/OrganizationList';
import { NewsFilter } from '../../Pages/NewsList';
import { EventFilter } from '../../Pages/EventList';
import { PersonFilter } from '../../Pages/PersonList';
import { DonationFilter } from '../../Pages/DonationList';
import { PostFilter } from '../../Pages/PostList';
import { BotFilter } from '../../Pages/BotList';
import { ActivityFilter } from '../../Pages/ActivityList';
import { RewardFilter } from '../../Pages/RewardList';
import Tutorial from '../Tutorial';

import { IbisConsumer } from '../../Context';

const snakeToCamel = s => s[0].toUpperCase() + s.slice(1).replace(/(-\w)/g, k => k[1].toUpperCase())

const makeOrganizationFilter = (filterValue, i, onClose) => {
    return <OrganizationFilter value={filterValue} key={i} open={true} onClose={onClose} />
}

const makeNewsFilter = (filterValue, i, onClose) => {
    return <NewsFilter value={filterValue} key={i} open={true} onClose={onClose} />
}

const makeEventFilter = (filterValue, i, onClose) => {
    return <EventFilter value={filterValue} key={i} open={true} onClose={onClose} />
}

const makePersonFilter = (filterValue, i, onClose) => {
    return <PersonFilter value={filterValue} key={i} open={true} onClose={onClose} />
}

const makeDonationFilter = (filterValue, i, onClose) => {
    return <DonationFilter value={filterValue} key={i} open={true} onClose={onClose} />
}

const makePostFilter = (filterValue, i, onClose) => {
    return <PostFilter value={filterValue} key={i} open={true} onClose={onClose} />
}

const makeBotFilter = (filterValue, i, onClose) => {
    return <BotFilter value={filterValue} key={i} open={true} onClose={onClose} />
}

const makeActivityFilter = (filterValue, i, onClose) => {
    return <ActivityFilter value={filterValue} key={i} open={true} onClose={onClose} />
}

const makeRewardFilter = (filterValue, i, onClose) => {
    return <RewardFilter value={filterValue} key={i} open={true} onClose={onClose} />
}

/*
   Each "option" corresponds to a cycle; the items are laid out in the following schema:
   [ display name, filter component, level-1 route, level-2 route ]
*/

const navigation = {
    [null]: { cycle: StandardVal, value: null },
    organization: { cycle: OrganizationVal, value: 0 },
    news: { cycle: OrganizationVal, value: 1 },
    event: { cycle: OrganizationVal, value: 2 },
    person: { cycle: PersonVal, value: 0 },
    donation: { cycle: PersonVal, value: 1 },
    post: { cycle: PersonVal, value: 2 },
    bot: { cycle: BotVal, value: 0 },
    activity: { cycle: BotVal, value: 1 },
    reward: { cycle: BotVal, value: 2 },
}

const options = {
    [OrganizationVal]: [
	[ 'Orgs', makeOrganizationFilter, 'organization-list' ],
	[ 'News', makeNewsFilter, 'news-list' ],
	[ 'Events', makeEventFilter, 'event-list' ],
    ],
    [PersonVal]: [
	[ 'People', makePersonFilter, 'person-list' ],
	[ 'Donations', makeDonationFilter, 'donation-list' ],
	[ 'Posts', makePostFilter, 'post-list' ],
    ],
    [BotVal]: [
	[ 'Bots', makeBotFilter, 'bot-list' ],
	[ 'Activities', makeActivityFilter, 'activity-list' ],
	[ 'Rewards', makeRewardFilter, 'reward-list' ],
    ]
}

function HomeLoader()  {

    // compare local and remote hashes and reload the app if they differ
    try {
	const config = require('../../__config__.json');
	const local = require('../../__hash__.json');
	fetch(`${config.ibis.app}/__hash__.json`, { cache: 'no-store' }).then(response => {
	    return response.json();
	}).then(remote => {
	    if (local && remote && local[0] !== remote[0]) {
		alert('Token Ibis has updates! Please hold on for a literal second while we reload your page.');
		window.location.reload(true);
	    }
	})
    } catch(error) {
	console.log('Cannot compare local and remote hashes')
	console.log(error)
    }

    return (
	<div>
	  <IbisConsumer>
	    {context => (
		<MainBar context={context} cycle={StandardVal} />
	    )}
	  </IbisConsumer>
	  <IbisConsumer>
	    {context => (
		<Home context={context}/>
	    )}
	  </IbisConsumer>
	</div>
    );
};

function ContentLoader({ match, location }) {
    let name = match.params.page.toLowerCase()
    let module;
    try {
	module = require(`../../Pages/${snakeToCamel(name)}`);
    } catch(error) {
	console.log('Page not found; redirecting to home')  
	console.log(error)
	return HomeLoader()
    }
    let Page = module.default;
    let nav = (({cycle, value}) => (
	<div>
	  <IbisConsumer>
	    {context => (
		<MainBar context={context} cycle={cycle} position={cycle === StandardVal ? 'fixed' : 'static'}/>
	    )}
	  </IbisConsumer>
	  {cycle !== StandardVal && (<TabBar options={options[cycle]} value={value} />)}
	</div>
    ))(navigation[name.split('-')[0]] || navigation[null])

    let urlParams = location.search.slice(1).split('&').reduce((obj, x) =>
	Object.assign(obj, { [x.split('=')[0]]: x.split('=').slice(1).join('=') }), {});

    let page = (
	<IbisConsumer>
	  {context => (
	      <div style={{ margin: '0 auto', maxWidth: context.maxWindowWidth }}>
		<Page context={context} {...urlParams} key={Math.random()}/>
	      </div>
	  )}
	</IbisConsumer> 
    );

    return (
	<div >
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
	    <Route path="/:page" exact component={ContentLoader} />
	    <Route path="/:mode/:page" exact component={ContentLoader} />
	  </Router>
	  <IbisConsumer>
	    {context => (
		<Tutorial context={context}/>
	    )}
	  </IbisConsumer>
	</div>
    );
};

export default Content;
