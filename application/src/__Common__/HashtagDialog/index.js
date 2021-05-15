import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import DonationIcon from '@material-ui/icons/MonetizationOn';
import PostIcon from '@material-ui/icons/Forum';
import NewsIcon from '@material-ui/icons/ListAlt';
import EventIcon from '@material-ui/icons/Event';
import ActivityIcon from '@material-ui/icons/Casino';
import RewardIcon from '@material-ui/icons/EmojiEvents';
import GoIcon from '@material-ui/icons/ExitToApp';

import SimpleEdgeMutation, { LikeVal } from '../SimpleEdgeMutation';
import CustomDivider from '../CustomDivider';
import CustomDate from '../CustomDate';
import Link from '../CustomLink';
import { IbisConsumer } from '../../Context';
import QueryHelper from '../QueryHelper';
import ListView from '../ListView';
import Truncated from '../Truncated';

const styles = theme => ({
    avatar: {
	backgroundColor: 'white',
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    label: {
	paddingLeft: theme.spacing(1),
    },
    title: {
	color: theme.palette.primary.main,
	fontWeight: 'bold',
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
    go: {
	color: theme.palette.secondary.main,
    },
    dialogPaper: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	width: '70%',
    },
    dialogInner: {
	textAlign: 'center',
	padding: theme.spacing(1),
    },
    clickable: {
	cursor: 'pointer',
    },
    headingWrapper: {
	width: '90%',
	marginLeft: 'auto',
	marginRight: 'auto',
    },
    heading: {
	fontSize: '18px',
	paddingLeft: theme.spacing(1),
	paddingTop: theme.spacing(1),
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing(2),
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	textDecoration: 'none',
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
    },
});

const DEFAULT_COUNT = 25;

const query = loader('../../Static/graphql/app/EntryList.gql')

class HashtagDialog extends Component {

    state = {
	opened: false,
    };
    
    makeImage = (node) => {
	let { classes, onClick } = this.props;

	return (
    	    <Avatar
		component={Link}
		to={`/_/${node.user.userType}?id=${node.user.id}`}
  		alt="Ibis"
    		src={node.user.avatar}
    		className={classes.avatar}
	    />
	)
    }

    makeLabel = (node) => {
	let { classes } = this.props;

	return (
	    <div className={classes.label}>
  	      <Typography variant="body2" className={classes.title}>
		{node.entryType} by {node.user.name}
  	      </Typography>
  	      <Typography variant="body2" className={classes.subtitle}>
		@{node.user.username} - <CustomDate date={node.created} />
  	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	let { classes } = this.props;

	return (
	    <Typography variant="body2">
  	      <Truncated text={node.description} length={160}/>
	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes } = this.props;

	return (
	    <div className={classes.action}>
		<IbisConsumer>
		  {context => (
		      <SimpleEdgeMutation
			  variant={LikeVal}
			  user={context.userID}
			  target={node.id}
			  initial={node.hasLiked.edges.length === 1}
			  hide={context.userID === node.user.id}
		      />
		  )}
		</IbisConsumer>
		<Typography
		    component={Link}
		    to={`/${node.root.entryType}/${node.root.entryType}?id=${node.root.id}`}
		    variant="body2"
		    className={classes.info}
		>
		  Details
		</Typography>
	    </div>
	)
    }

    render() {
	let { classes, children, hashtag} = this.props;
	let { opened } = this.state;

	let make = (data) => (
	    <ListView
		expandedAll={true}
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		data={data}
	    />
	)
	let variables = {
	    first: DEFAULT_COUNT,
	    search: `#${hashtag}`,
	    root: true,
	}

	return (
	    <span>
	      <Dialog
		  PaperProps={{ className: classes.dialogPaper }}
		  open={opened}
		  onClose={() => {this.setState({ opened: false})}}
	      >
		<div className={classes.headingWrapper}>
		  <Typography variant="body2" className={classes.heading}>
		    {`Trending: #${hashtag}`}
		  </Typography>
		  <CustomDivider />
		</div>
		<QueryHelper
		    query={query}
		    variables={variables}
		    make={make}
	            scroll={'manual'}
		/>
	      </Dialog>
	      <span className={classes.clickable} onClick={() => {this.setState({ opened: true })}}>
		{children}
	      </span>
	    </span>
	);
    };
};

export default withStyles(styles)(HashtagDialog);
