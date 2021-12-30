import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import ShareIcon from '@material-ui/icons/ShareOutlined';

import CustomMarkdown from '../../__Common__/CustomMarkdown';

const styles = theme => ({
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
});

class Share extends Component {
    state = {
	dialog: false,
	copied: false,
	sharing: false,
    }

    share = () => {
	let { title, text, url } = this.props;

	if (navigator.share) {
	    this.setState({ sharing: true });
	    navigator.share({ title, text, url }).then(() => {
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
	let { classes, context, label, url } = this.props;
	let { dialog, copied, sharing } = this.state;

	return (
	    <div>
	      <Dialog
		  open={dialog}
		  onClose={() => this.setState({ dialog: false, copied: false })}
		  PaperProps={{ className: classes.paperProps}}
	      >
		<div className={classes.dialogInner}>
		  <CustomMarkdown noLink source={
		  copied ? 'Copied to clipboard' : `Link: ${url}`
		  } />
		  <IconButton
		      color="secondary"
		      onClick={() => {
			  navigator.clipboard.writeText(url);
			  this.setState({ copied: true });
		      }}
		  >
		    <CopyIcon/>
		  </IconButton>
		</div>
	      </Dialog>
	      {label ? (
		  <div className={classes.buttonWrapper}>
		    <Button
			className={classes.newButton}
			onClick={() => this.share()}
			disabled={sharing}
		      >
		      {label} 
		    </Button>
		  </div>
	      ):(
		  <IconButton
		      color="secondary"
		      onClick={() => this.share()}
		      disabled={sharing}
		      >
		    <ShareIcon />
		  </IconButton>
	      )}
	    </div>
	);
    }

}

export default withStyles(styles)(Share);
