import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import { loader } from 'graphql.macro';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MessageIcon from '@material-ui/icons/ForumOutlined';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Dialog from '@material-ui/core/Dialog';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChannelIcon from '@material-ui/icons/Group';

import Link from '../../__Common__/CustomLink';
import QueryHelper from '../../__Common__/QueryHelper';
import ListView from '../../__Common__/ListView';
import CustomDate from '../../__Common__/CustomDate';
import CustomDivider from '../../__Common__/CustomDivider';
import Truncated from '../../__Common__/Truncated';
import Popup from '../../__Common__/Popup';
import Filter from '../../__Common__/Filter';
import { UserList } from '../../__Common__/UserDialogList';

const config = require('../../__config__.json');

const styles = theme => ({
    root: {
	textAlign: 'center'
    },
    dialogPaper: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	width: '70%',
    },
    avatar: {
	backgroundColor: 'white',
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    topWrapper: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '90%',
	paddingTop: theme.spacing(),
	paddingBottom: theme.spacing(),
    },
    headingWrapper: {
	display: 'flex',
	justify: 'center',
	alignItems: 'center',
    },
    heading: {
	fontSize: '18px',
	color: theme.palette.tertiary.main,
    },
    create: {
	textAlign: 'center',
	cursor: 'pointer',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    titleWrapper: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
    body: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingLeft: theme.spacing(6),
    },
    sender: {
	fontWeight: 'bold',
	paddingBottom: theme.spacing(2),
	color: theme.palette.tertiary.main,
    },
    conversation: {
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	paddingBottom: theme.spacing(2),
	paddingLeft: theme.spacing(1),
    },
    message: {
	color: theme.palette.tertiary.main,
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	paddingBottom: theme.spacing(2),
	width: '100%',
    },
    icon: {
	color: theme.palette.secondary.main,
	marginTop: theme.spacing(-2),
    },
    buttonWrapper: {
	alignItems: 'center',
	width: '90%',
	textAlign: 'center',
	paddingBottom: theme.spacing(2),
	marginRight: 'auto',
	marginLeft: 'auto',
    },
    inputRoot: {
	color: theme.palette.secondary.main,
    },
    inputInput: {
	padding: theme.spacing(1, 1, 1, 5),
    },
    search: {
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: fade(theme.palette.common.white, 0.15),
	'&:hover': {
	    backgroundColor: fade(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
    },
    searchIcon: {
	width: theme.spacing(7),
	color: theme.palette.secondary.main,
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
    },
    tabSelected: {
	color: theme.palette.tertiary.main,
	opacity: 1,
    },
    tabUnselected: {
	color: theme.palette.secondary.main,
	opacity: 1,
    },
})

const queryDirect = loader('../../Static/graphql/app/MessageDirectInbox.gql')

const queryChannel = loader('../../Static/graphql/app/MessageChannelInbox.gql')

const StyledTabs = withStyles((theme) => ({
    indicator: {
	display: 'flex',
	justifyContent: 'center',
	backgroundColor: 'transparent',
	'& > span': {
	    width: '50%',
	    backgroundColor: theme.palette.tertiary.main,
	},
    },
}))((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

class MessageInbox extends Component {

    state = {
	search: false,
	filterValue: '',
	tab: 0,
    }

    makeImageDirect = (node) => {
	let { classes  } = this.props;
	return (
    	    <Avatar
		component={Link}
		to={node.userType === 'Organization' ? (
		    `/Organization/Organization?id=${node.id}`
		):(
		    node.userType === 'Person' ? (
			`/Person/Person?id=${node.id}`
		    ):(
			`/Bot/Bot?id=${node.id}`
		    )
			
		)}
  		alt="Ibis"
    		src={node.avatar}
    		className={classes.avatar}
	    />
	)
    };

    makeImageChannel = (node) => {
	let { classes  } = this.props;
	return (
	    <ChannelIcon />
	);
    }

    makeLabelDirect = (node) => {
	let { classes } = this.props;
	return (
	    <Link to={`/_/MessageDirectList?id=${node.id}`}>
	      <div className={classes.titleWrapper}>
  		<Typography variant="body2" className={classes.title}>
  		  {`${node.name}`}
  		</Typography>
  		<Typography variant="body2" className={classes.subtitle}>
		  <CustomDate date={node.messages.edges[0].node.created} />
  		</Typography>
	      </div>
	    </Link>
	);
    }

    makeLabelChannel = (node) => {
	let { classes } = this.props;
	return (
	    <Link to={`/_/MessageChannelList?id=${node.id}`}>
	      <div className={classes.titleWrapper}>
  		<Typography variant="body2" className={classes.title}>
  		  {`${node.name}`}
  		</Typography>
		{node.messages.edges.length > 0 && (
  		    <Typography variant="body2" className={classes.subtitle}>
		      <CustomDate date={node.messages.edges[0].node.created} />
  		    </Typography>
		)}
	      </div>
	    </Link>
	);
    }

    makeBodyDirect = (node) => {
	let { classes, context } = this.props;
	return (
	    <Link to={`/_/MessageDirectList?id=${node.id}`}>
	      <div className={classes.body}>
		<Typography variant="body2" className={classes.message}>
  		  {node.messages.edges[0].node.user.id === context.userID && (
		      <span className={classes.sender}>
			You:&nbsp;
  		      </span>
		  )}
  		  {node.messages.edges[0].node.description}
  		</Typography>
		<IconButton className={classes.icon}>
		  <MessageIcon />
		</IconButton>
	      </div>
	    </Link>
	);
    }

    makeBodyChannel = (node) => {
	let { classes, context } = this.props;
	return (
	    <Link to={`/_/MessageChannelList?id=${node.id}`}>
	      <div className={classes.body}>
		{node.messages.edges.length > 0 ? (
		    <Typography variant="body2" className={classes.message}>
  		      {node.messages.edges[0].node.user.id === context.userID ? (
			  <span className={classes.sender}>
			    You:&nbsp;
  			  </span>
		      ):(
			  <span className={classes.sender}>
			    {node.messages.edges[0].node.user.name}:&nbsp;
  			  </span>
		      )}
  		      {node.messages.edges[0].node.description}
  		    </Typography>
		):(
		    <Typography variant="body2" className={classes.message}>
		      No messages yet.
		    </Typography>
		)}
		<IconButton className={classes.icon}>
		  <MessageIcon />
		</IconButton>
	      </div>
	    </Link>
	);
    }

    onSearch = (event) => {
	event.stopPropagation();
	event.preventDefault();
	this.setState({ filterValue: `_Search:${document.getElementById('search_input').value}` })
    }

    onSearchClick = (node) => {
	let { history } = this.props;
	history.push(`/_/MessageDirectList?id=${node.id}`)
    }

    render() {
	let { classes, context, minimal, count } = this.props;
	let { search, filterValue, tab } = this.state;

	let variables = {
	    user: context.userID,
	    orderBy: '-messaged_last',
	}

	let makeDirect = (data) => (
	    <ListView
		makeImage={this.makeImageDirect}
		makeLabel={this.makeLabelDirect}
		makeBody={this.makeBodyDirect}
		data={data}
		expandedAll
	    />
	)

	let makeChannel = (data) => (
	    <ListView
		makeImage={this.makeImageChannel}
		makeLabel={this.makeLabelChannel}
		makeBody={this.makeBodyChannel}
		data={data}
		expandedAll
	    />
	)

	return (
	    <div className={classes.root}>
  	      <Grid container direction="column" justify="center" alignItems="center" >

		<div className={classes.topWrapper}>
		  <div className={classes.headingWrapper}>
		    <div className={classes.demo2}>
		      <StyledTabs value={tab} onChange={(e, i) => {this.setState({ tab: i })}}>
			<Tab
			    disableRipple
			    className={tab === 0 ? classes.tabSelected : classes.tabUnselected}
			    label="Direct"
			/>
			<Tab
			    disableRipple
			    className={tab === 1 ? classes.tabSelected : classes.tabUnselected}
			    label="Channels"
			/>
		      </StyledTabs>
		      <Typography className={classes.padding} />
		    </div>

		  </div>
		  {tab !== 0 ? '' : search ? (
		      <div className={classes.search}>
			<div className={classes.searchIcon}>
			  <SearchIcon />
			</div>
			<form onSubmit={this.onSearch}>
			  <InputBase
			      id="search_input"
			      name="search"
			      type="text"
			      autoFocus={true}
			      placeholder="Search…"
			      classes={{
				  root: classes.inputRoot,
				  input: classes.inputInput,
			      }}
			      inputProps={{ 'aria-label': 'Search' }}
			  />
			</form>
		      </div>
		  ):(
		      <Typography
			  variant="body2"
			  className={classes.create}
			  onClick={() => this.setState({ search: true })}
			  >
			Lookup User
		      </Typography>
		  )}
		</div>
		<div style={{width: '90%'}}>
		  <CustomDivider />
		</div>
	      </Grid>
	      {tab === 0 ? (
		  <QueryHelper
		      query={queryDirect}
		      variables={variables}
		      make={makeDirect}
		      scroll={'infinite'}
		      key={tab}
		  />
	      ):(
		  <QueryHelper
		      query={queryChannel}
		      variables={variables}
		      make={makeChannel}
		      scroll={'infinite'}
		      key={tab}
		  />
	      )}
	      {filterValue && (
		  <Dialog
		      PaperProps={{ className: classes.dialogPaper }}
		      open={true}
		      onClose={() => {
			  document.getElementById('search_input').value = '';
			  this.setState({ filterValue: '' });
		      }}
		      >
		    <UserList
			context={context}
			filterValue={filterValue}
			onClick={this.onSearchClick}
		    />
		  </Dialog>
	      )}
	    </div>
	);
    };
};

export default withRouter(withStyles(styles)(MessageInbox));
