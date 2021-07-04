import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { loader } from 'graphql.macro';
import { Query, withApollo } from "react-apollo";
import QueryHelper from '../../__Common__/QueryHelper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import MessageIcon from '@material-ui/icons/Send';

import CustomDate from '../CustomDate';
import CustomMarkdown from '../CustomMarkdown';
import Confirmation from '../Confirmation';

const styles = theme => ({
    body: {
	paddingTop: theme.spacing(4),
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),
	paddingBottom: theme.spacing(14),
    }, 
    message: {
	color: theme.palette.primary.main,
    },
    content: {
	marginTop: theme.spacing(-2),
    },
    date: {
	display: 'flex',
	justifyContent: 'space-between',
	color: theme.palette.tertiary.main,
	fontSize: '12px',
	textAlign: 'right',
    },
    incoming: {
	padding: theme.spacing(2),
	borderRadius: theme.spacing(2),
	background: '#ffcfcf',
	width: '75%',
	marginBottom: theme.spacing(2),
    },
    outgoing: {
	padding: theme.spacing(2),
	borderRadius: theme.spacing(2),
	background: theme.palette.light.main,
	width: '75%',
	marginRight: '0px',
	marginLeft: 'auto',
	marginBottom: theme.spacing(2),
    },
    name: {
	marginRight: 'auto',
	marginLeft: 'auto',
	fontWeight: 'bold',
	paddingLeft: theme.spacing(),
	paddingTop: theme.spacing(),
	color: theme.palette.tertiary.main,
    },
    appBar: {
	top: 'auto',
	bottom: 0,
	backgroundColor: 'white',
    },
    sendIcon: {
	color: theme.palette.secondary.main,
    },
    textField: {
	padding: theme.spacing(1),
    },
})

const POLL = 4000;

const queryDirectName = loader('../../Static/graphql/app/MessageDirectName.gql');
const queryChannelName = loader('../../Static/graphql/app/MessageChannelName.gql');

class MessageBar extends Component {

    state = { 
	enableSend: false,
	oldHeight: null,
    }

    send = () => {
	let { context, client, id, refresh, variant } = this.props;

	let mutation = variant === 'direct' ?
		       loader('../../Static/graphql/app/MessageDirectCreate.gql') :
		       loader('../../Static/graphql/app/MessageChannelCreate.gql');

	client.mutate({
	    mutation,
	    variables: {
		user: context.userID,
		target: id,
		description: document.getElementById('message_text').value,
	    },
	}).then(response => {
	    document.getElementById('message_text').value = '';
	    this.setState({ enableSend: false });
	    refresh();
	}).catch(error => {
	    alert('Uh-oh, something went wrong');
	})
    }

    render() {
	let { classes, context, id, variant } = this.props;
	let { enableSend } = this.state;

	return (
	    <AppBar position="fixed" className={classes.appBar}>
	      <Toolbar>
		<div style={{
		    width: context.maxWindowWidth * 0.9,
		    justifyContent: 'center',
		    alignItems: 'center',
		    marginRight: 'auto',
		    marginLeft: 'auto',
		}}>
		  <Query
		      fetchPolicy="no-cache"
		      query={variant === 'direct' ? queryDirectName : queryChannelName}
		      variables={{ id: id }}
		  >
		    {({ loading, error, data, refetch }) => {
			if (loading) return '';
			if (error) return 'Error: user not found';
			return (
			    <Typography variant="body2" className={classes.name}>
			      {`To: ${variant === 'direct' ? data.user.name : data.channel.name}`}
			    </Typography>
			)
		    }}
		  </Query>
		  <div style={{
		    display: 'flex',
		  }}>
		    <TextField 
			id="message_text"
			variant="outlined"
			multiline
			autoFocus
			fullWidth
			onChange={() => {this.setState({ enableSend: !!document.getElementById('message_text').value})}}
			onFocus={(e) => {if (e.type === 'focus') window.scrollTo(0, document.body.scrollHeight)}}
			className={classes.textField}
		    />
		    <Confirmation
		      disabled={!enableSend}
		      onClick={this.send}
		      message="Are you sure you want to __send__ this message?"
		      preview={() => (document.getElementById('message_text').value)}
		    >
		      <IconButton
			  className={classes.sendIcon}
		      >
			<MessageIcon/>
		      </IconButton>
		    </Confirmation>
		  </div>
		</div>
	      </Toolbar>
	    </AppBar>
	);
    };
}

class MessageList extends Component {

    constructor() {
	super();
	this.state = {
	    refreshTrigger: Math.random(),
	    oldHeight: window.innerHeight,
	};
    }

    make = (data) => {
	let { classes, context, variant } = this.props;

	return (
	    <div className={classes.content}>
	      {data.slice(0).reverse().map((item, i) => (
		  <div className={
		  item.node.user.id === context.userID ?
		  classes.outgoing: classes.incoming
		  }>
		    <CustomMarkdown safe source={
		    variant === 'channel' && item.node.user.id !== context.userID ?
		    `__${item.node.user.firstName}:__ ${item.node.description}`:
		    item.node.description
		    } messageProps={classes.message}/>
		    <Typography variant="body2" className={classes.date}>
		      <span>{variant === 'direct' || item.node.user.id === context.userID ? '' : `@${item.node.user.username}`}</span>
		      <CustomDate date={item.node.created} />
		    </Typography>
		  </div>
	      ))}
	    </div>
	);
    };

    refresh = () => {
	this.setState({ refreshTrigger: Math.random() })
    }
    
    render() {
	let { classes, context, id, client, variant } = this.props;
	let { refreshTrigger, oldHeight } = this.state;

	let query, variables;
	if (variant === 'direct') {
	    query = loader('../../Static/graphql/app/MessageDirectList.gql');
	    variables = {
		withUser: id,
		first: 25,
	    }
	} else {
	    query = loader('../../Static/graphql/app/MessageChannelList.gql');
	    variables = {
		withChannel: id,
		first: 25,
	    }
	}

	// handles first resize when autofocus brings up keyboard on mobile
	window.addEventListener('resize', (x, y) => {
	    if (window.innerHeight < oldHeight) {
		window.scrollTo(0, document.body.scrollHeight);
		this.setState({ oldHeight: window.innerHeight })
	    }
	})

	return (
	    <div className={classes.body}>
	      <QueryHelper
		  query={query}
		  variables={variables}
		  make={this.make}
	          scroll={'manual'}
		  reverseScroll
		  refreshTrigger={refreshTrigger}
		  pollTime={POLL}
		  emptyMessage="Go ahead and say hi!"
	      />
	      <MessageBar
		  classes={classes}
		  context={context}
		  id={id}
		  client={client}
		  refresh={this.refresh}
		  variant={variant}
	      />
	    </div>
	)
    }
};

export const DirectVal = 'direct';
export const ChannelVal = 'channel';
export default withApollo(withStyles(styles)(MessageList));
