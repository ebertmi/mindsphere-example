# MindSphere Example

This repository contains a simple MindSphere Example for monitoring assets within a tenant and ingesting time series data at the same time.

## Frontend

### Run

Start the local development server by running `npm start` in the frontend directory.

### Deploy

### Development

The frontend is based on the *create-react-app* starter template. It has an built-in development proxy that automatically redirects relative MindSphere API requests (e.g. `/api/iot/v3/timeseries`) to absolute requests (e.g. `https://gateway.eu1.mindsphere.io/api/iot/v3/timeseries`) and injects the correct authorization header.
Using this proxy allows to develop locally and having woring MindSphere requests. In addition, the proxy can be modified to return test data.

#### Setup

For the proxy to work, you need to set the following environment variables, by either using the `.env.development.local` file or manually.

|Key|Description|Example|
|---|---|---|
|MDSP_BEARER|Bearer token with all the scopes required for calling the MindSphere APIs|`BEARER ....`|
|MDSP_Tenant|Tenant that is used for development/testing|`mytenant`|
|MDSP_KEYMANANGER_USER|User for calling the technical token manager API for retrieving an token in the name of *MDSP_TENANT*||
|MDSP_KEYMANANGER_PASSWORD|Password for calling the technical token manager API for retrieving an token in the name of *MDSP_TENANT*||

## Backend

The backend is a simple express.js node server with the ability to run additional processes for ingesting data. Forking processes as shown here is not meant for production. Use a proper queue and service workers for production grade implementation.

### Run

Start the local server by running `npm start` in the backend directory.

### Deploy

### Development

ToDo