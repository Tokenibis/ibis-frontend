# Ibis Frontend PWA

This is the application frontend for the Token Ibis application. It is
implemented as a REACT single-page web app with the intention to be
converted into a PWA.

__This code is currently in BETA__

## Dependencies

Install the latest version of nodejs: https://nodejs.org/en/download/

## Setup

`$ git submodule init`

`$ git submodule update`

`$ npm install`

`$ npm audit fix`

## Run in Development Mode

`$ cd application`

`$ npm start`

## Build and Send to Remote Server

Make sure you have all values populated in config_prod.json or
config_dev.json, depending your deployment intent.

`$ ./application/deploy.sh [--development|--production] [remote_server]`
