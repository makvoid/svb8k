# Public Facing API

This API is intended to handle all incoming public requests. By default, it'll serve the Angular User Interface but also contains an Express API to handle other functionality, such as saving a contact request.

## Requirements
* NodeJS 14+
* MongoDB Database

## Installation
```shell
# Install dependencies
yarn

# Edit the environment variables as needed
vim systemd/public-api.service

# Install the service file
cp systemd/public-api.service /usr/lib/systemd/system
systemctl daemon-reload

# Start the API
systemctl enable public-api
systemctl start public-api
```