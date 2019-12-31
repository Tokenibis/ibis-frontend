import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import axios from "axios";

import Link from '../../../__Common__/CustomLink';
import CustomMarkdown from '../CustomMarkdown';
import PersonDialogList, { LikeVal as DialogLikeVal} from '../PersonDialogList';
import SimpleEdgeMutation, { LikeVal } from '../SimpleEdgeMutation';
import CommentTree from '../CommentTree';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(4),
	width: '90%',
    },
    categoryIcon: {
	color: theme.palette.tertiary.main,
	fontSize: 20,
	marginBottom: -4,
    },
    progress: {
	margin: theme.spacing(-0.5),
    },
    avatarContainer: {
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
    },
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
	position: 'absolute',
	width: 60,
	height: 60,
    },
    userlink: {
	textDecoration: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    created: {
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing(1),
    },
    toIcon: {
	paddingRight: theme.spacing(1),
	paddingLeft: theme.spacing(1),
	position: 'relative',
	transform: 'translateY(25%)',
    }, 
    gift: {
	paddingBottom: theme.spacing(1),
	color: theme.palette.tertiary.main,
	fontWeight: 'bold',
    },
    commentCount: {
	color: theme.palette.tertiary.main,
	fontSize: 14,
    },
    commentCountIcon: {
	fontSize: 20,
	marginBottom: -7,
	paddingRight: theme.spacing(0.5),
	color: theme.palette.tertiary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    reply: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	paddingRight: theme.spacing(1),
    },
});

class Transfer extends Component {

    state = {
	item: '',
	price: 0,
    }

    onSubmit() {
	console.log('submitted')
    }

    createPage(node) {
	let { classes, context, variant, id } = this.props;
	let { item, price } = this.state;

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <Grid container className={classes.content}>
		<Grid item xs={3}>
		  <div className={classes.avatarContainer}>
    		    <Avatar
			component={Link}
			prefix={1}
			to={`Person?id=${node.user.person.id}`}
  			alt="Ibis"
    			src={node.user.avatar}
    			className={classes.avatar}
		    />
		  </div>
		</Grid>
		<Grid item xs={7}>
		  <div style={{display: 'flex'}}>
		    <Typography variant="body2">
		      <Link
			  to={`Person?id=${node.user.person.id}`}
			  prefix={1}
		      >
			<span className={classes.userlink}>{`${node.user.name}`}</span>
		      </Link>
		      <span>{<ToIcon className={classes.toIcon}/>}</span>
		      <Link
			  to={`${variant === 'donation' ? 'Nonprofit' : 'Person'}?id=${node.target.id}`}
			  prefix={1}
		      >
			<span className={classes.userlink}>{`${node.target.name}`}</span>
		      </Link>
		    </Typography>
		  </div>
		</Grid>
		<Grid item xs={2}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.created}>
  		    {new Date(node.created).toDateString()}
		  </Typography>
		</Grid>
		<Grid item xs={2}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.gift}>
		    {`$${(node.amount/100).toFixed(2)}`}
		    {item && ` (${Math.round(node.amount/price*10)/10} ${item})`}
		  </Typography>
		</Grid>
		<Grid item xs={2}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <CustomMarkdown source={node.description} />
		</Grid>
		<Grid item xs={2}></Grid>
		<Grid item xs={12} className={classes.divider}>
		  <div className={classes.action}>
		    {context.userID === node.user.person.id ? (
			<PersonDialogList
			variant={DialogLikeVal}
			count={node.likeCount}
			node={node.id}
			/>
		    ):(
			<SimpleEdgeMutation
			variant={LikeVal}
			user={context.userID}
			target={node.id}
			initial={node.hasLiked.edges.length === 1}
			/>
		    )}
		  </div>
		</Grid>
		<Grid item xs={12}>
		  <CommentTree
		      showReplyRoot
		      parent={id}
		      context={context}
		      onSubmitParent={() => this.onSubmit()}
		  />
		</Grid>
	      </Grid>
	   </Grid>
	);
    }

    componentDidMount() {
	axios('/ibis/price/', {
	    withCredentials: true,
	}).then(response => {
	    this.setState({ item: response.data.item, price: response.data.price });
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	})
    };

    render() {
	let { classes, context, variant, id } = this.props

	let query;

	if (variant === 'donation') {
	    query = loader('../../../Static/graphql/operations/Donation.gql')
	} else {
	    query = loader('../../../Static/graphql/operations/Transaction.gql')
	}

	return (
	    <Query
		fetchPolicy="no-cache"
		query={query} 
		variables={{ id, self: context.userID }}
	    >
	    {({ loading, error, data }) => {
		if (loading) return <LinearProgress className={classes.progress} />;
		if (error) return `Error! ${error.message}`;
		return this.createPage(data[Object.keys(data)[0]]);
	    }}
	    </Query>
	);
    };
};

Transfer.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
};

export const DonationVal = 'donation';
export const TransactionVal = 'transaction';

export default withStyles(styles)(Transfer);
