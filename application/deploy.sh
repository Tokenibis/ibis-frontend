#!/bin/bash

# This bash script accepts a flag specifying deployment to a
# production or development server followed by the hostname:port (or
# alias) for the remote server. It has no way to actually know whether
# the remote serve actually IS a production or dev environment; the
# intent is just to add one extra layer of yes/no confirmation for
# production deployments when the developer is hastily reverse
# searching through the command history.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR

if [ $# -ne 2 ]; then
   echo 'ERROR: need exactly two arguments [--development|--production] [remote_server]'
   exit 1
fi

if [ ! $DIR/src/config.json ]; then
    echo 'ERROR: src/config.json already exists. Aborting'
    exit 1
fi

if [ $1 == '--production' ] || [ $1 == '-p' ]; then
    echo 'STOP! You are about deploy to production. Are you sure you want to continue? (y/N)'
    read response
    if [ $response != 'y' ]; then
       echo 'Aborting deployment'
       exit 0
    else
	if [ ! -f $DIR/config_prod.json ]; then
	    echo 'ERROR: missing config_prod.json file'
	    exit 1
	fi
	if [ ! -f $DIR/config_dev.json ]; then
	    echo 'ERROR: missing config_dev.json file'
	    exit 1
	fi
	cp $DIR/config_prod.json $DIR/src/config.json
    fi
elif [ $1  == '--development' ] || [ $1 == '-d' ]; then
    cp $DIR/config_dev.json $DIR/src/config.json
else
    echo 'ERROR: unrecognized arguments'
    exit 1
fi

yarn build && ssh $2 rm /srv/app/build -rf && scp -r build/ $2:/srv/app/build
