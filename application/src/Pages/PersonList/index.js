import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';

import CustomMarkdown from '../../__Common__/CustomMarkdown';
import Link from '../../__Common__/CustomLink';
import QueryHelper from '../../__Common__/QueryHelper';
import ListView from '../../__Common__/ListView';
import Filter from '../../__Common__/Filter';
import SimpleEdgeMutation, { FollowVal } from '../../__Common__/SimpleEdgeMutation';
import Truncated from '../../__Common__/Truncated';

const config = require('../../__config__.json');

const styles = theme => ({
    avatar: {
	backgroundColor: 'white',
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
    followStatWrapper: {
	paddingTop: theme.spacing(1),
	paddingLeft: theme.spacing(5),
	display: 'flex',
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
	paddingLeft: theme.spacing(1),
    },
    body: {
	color: theme.palette.tertiary.main,
	paddingLeft: theme.spacing(6),
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	textDecoration: 'none',
    },
    buttonWrapper: {
	width: '100%',
	textAlign: 'center',
	paddingTop: theme.spacing(2),
    },
    newButton: {
	width: '90%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	marginBottom: theme.spacing(1),
    },
    dialogInner: {
	padding: theme.spacing(2),
	textAlign: 'center',
	display: 'flex',
	marginRight: 'auto',
	marginLeft: 'auto',
    },
    paperProps: {
	width: '70%',
	margin: theme.spacing(1),
    },
})

const DEFAULT_COUNT = 25;
const DEFAULT_FILTER = 'All';

const query = loader('../../Static/graphql/app/PersonList.gql')

class Invite extends Component {
    state = {
	dialog: false,
	copied: false,
	sharing: false,
    }

    invite = (link) => {
	if (navigator.share) {
	    this.setState({ sharing: true });
	    navigator.share({
		title: 'Token Ibis Link',
		text: 'Albuquerque\'s least profitable pyramid scheme:',
		url: link,
	    }).then(() => {
		alert('Success!')
		this.setState({ sharing: false });
	    }).catch((error) => {
		alert('Darn, something went wrong')
		this.setState({ sharing: false });
	    });
	} else {
	    this.setState({ dialog: true });
	}
    };

    render() {
	let { classes, context } = this.props;
	let { dialog, copied, sharing } = this.state;

	let link = `${config.ibis.app}/?referral=${context.userID}`;

	return (
	    <div>
	      <Dialog
		  open={dialog}
		  onClose={() => this.setState({ dialog: false, copied: false })}
		  PaperProps={{ className: classes.paperProps}}
	      >
		<div className={classes.dialogInner}>
		  <CustomMarkdown noLink source={
		  copied ? 'Copied to clipboard' : `Referal link: ${link}`
		  } />
		  <IconButton
		      color="secondary"
		      onClick={() => {
			  navigator.clipboard.writeText(link);
			  this.setState({ copied: true });
		      }}
		  >
		    <CopyIcon/>
		  </IconButton>
		</div>
	      </Dialog>
	      <div className={classes.buttonWrapper}>
		<Button
		    className={classes.newButton}
		    onClick={() => this.invite(link)}
		    disabled={sharing}
		>
		  Invite New User
		</Button>
	      </div>
	    </div>
	);
    }

}

class PersonList extends Component {

    state = {
	dialog: false,
    }

    makeImage = (node) => {
	let { classes  } = this.props;
	return (
    	    <Avatar
		component={Link}
		to={`/Person/Person?id=${node.id}`}
  		alt="Ibis"
    		src={node.avatar}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.title}>
  		{`${node.name}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.subtitle}>
  		{`@${node.username}`}
  	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	return (
  	    <Typography variant="body2">
  	      <Truncated text={node.description}/>
  	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, context } = this.props;
	return (
	    <div className={classes.action}>
	      <SimpleEdgeMutation
		  variant={FollowVal}
		  user={context.userID}
		  target={node.id}
		  initial={node.isFollowing.edges.length === 1}
		  hide={context.userID === node.id}
	      />
	      <Typography
		  component={Link}
		  to={`/Person/Person?id=${node.id}`}
		  variant="body2"
		  className={classes.info}
	      >
		{`Go to page${context.userType === 'Bot' ? ' | Donate' : ''}`}
	      </Typography>
	    </div>
	);
    };

    render() {
	let { classes, context, minimal, filterValue, count } = this.props;

	let infiniteScroll, make, variables;

	if (minimal) {
	    // hide icons/pictures and scroll button; intended for small partial-page lists
	    infiniteScroll = false;
	    make = (data) => (
		<ListView
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
		    data={data}
		/>
	    )
	} else {
	    // show everything; intended for full-page lists
	    infiniteScroll = true;
	    make = (data) => (
		<ListView
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
		    makeBody={this.makeBody}
		    makeActions={this.makeActions}
		    data={data}
		/>
	    )
	}

	// set default values if needed
	filterValue = filterValue ? filterValue : DEFAULT_FILTER;
	count = count ? count: DEFAULT_COUNT

	// the filterValue option determines the content of the data that gets fetched
	switch (filterValue.split(':')[0]) {
	    case 'All':
		variables = {
		    orderBy: '-score',
		    first: count,
		}
		break;
	    case 'Following':
		variables = {
		    followedBy: context.userID,
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case 'Followers':
		variables = {
		    followerOf: context.userID,
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_Following':
		variables = {
		    followedBy: filterValue.split(':')[1],
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_Followers':
		variables = {
		    followerOf: filterValue.split(':')[1],
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_LikeFor':
		variables = {
		    likeFor: filterValue.split(':')[1],
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_RsvpFor':
		variables = {
		    rsvpFor: filterValue.split(':')[1],
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_Search':
		variables = {
		    search: filterValue.split(':')[1],
		    orderBy: "firstname,lastname",
		    first: count,
		}
		break;
	    default:
		console.error('Unsupported filter option')
	}

	variables.self = context.userID

	return (
	    <div>
	      <Invite classes={classes} context={context}/>
	      <QueryHelper
		  query={query}
		  variables={variables}
		  make={make}
		  scroll={infiniteScroll ? 'infinite' : null}
	      />
	    </div>
	);
    };
};


PersonList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function PersonFilter(props) {
    return (
	<Filter
	    options={['All', 'Following', 'Followers']}
	    defaultVal={DEFAULT_FILTER}
	{...props}
	/>
    );
}

export { PersonFilter };
export default withStyles(styles)(PersonList);
