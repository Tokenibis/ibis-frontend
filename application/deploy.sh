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

if [ ! $DIR/src/__config__.json ]; then
    echo 'ERROR: src/__config__.json already exists. Aborting'
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
	cp $DIR/config_prod.json $DIR/src/__config__.json
    fi
elif [ $1  == '--development' ] || [ $1 == '-d' ]; then
    cp $DIR/config_dev.json $DIR/src/__config__.json
else
    echo 'ERROR: unrecognized arguments'
    exit 1
fi

echo -n [\"$( git diff HEAD | sha256sum | head -c 40 )\"] | tee $DIR/public/__hash__.json $DIR/src/__hash__.json > /dev/null

yarn build && \
    tar -czf build.tgz build/ && \
    scp build.tgz $2:/tmp/build.tgz && \
    ssh $2 "tar -xf /tmp/build.tgz -C /tmp/ && rm /srv/app/build -rf && mv /tmp/build /srv/app/build" && \
    echo "Pushed"
