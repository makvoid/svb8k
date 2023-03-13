# Parser

This script parses the SEC EDGAR API for 8-K reports related to SVB and saves them into a MongoDB database for later processing. 

## Requirements
* NodeJS 14+
* MongoDB Database

## Installation
```shell
# Install dependencies
yarn

# Edit the environment variables as needed
vim systemd/edgar-parser.service

# Install the systemd files
cp systemd/edgar-parser.* /usr/lib/systemd/system
systemctl daemon-reload

# Start the timer if desired
systemctl enable edgar-parser.timer
systemctl start edgar-parser.timer
```

## Getting started

If you started the timer above, the script will automatically run at the frequency defined in the service file. By default, this is every 5 minutes. Otherwise, you could run it manually but just be sure to pass all the environment variables that are expected.

Once you have some records in your `ingress` collection in MongoDB, we can use the backend portion of the project to manage these records and sync them to Algolia for public consumption.

## Running manually
```shell
MONGO_URI=mongodb://... MONGO_DB=dbname node src/parser.js
```