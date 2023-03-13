# Backend (Server)

> **Note**: This Express API is designed to only be used internally. There is no security built-in, so records could be added and removed without authentication. There is also minimal error handling. Take care that it is *not* exposed publicly. 

This API handles communicating with the backend User Interface, the Mongo DB and Algolia. It is designed to only be used internally, not by the public. It provides a list of unparsed reports to look at and allows us to easily sync these records up to Algolia, or remove them from the DB if they are not related in the long run.

## Requirements
* NodeJS 14+
* Algolia Account
* MongoDB Database

## Installation
```shell
# Install dependencies
yarn

# Edit the environment configuration as needed
vim systemd/private-api.service 

# Install the systemd file 
cp systemd/private-api.service /usr/lib/systemd/system
systemctl daemon-reload

# Ensure the API starts on boot
systemctl enable private-api
systemctl start private-api
```
