# InOrbit Incident Management Webhook example for Google Chat integration

This is a simple example service to integrate InOrbit incident notifications to be relayed as Google Chat messages.

It consists of a very simple NodeJS based service that listens for Webhook requests from InOrbit, interprets them and relays them to Google Chat.

It is meant to be taken as a starting point and be tailored for the needs of InOrbit users, including formatting and integration with other systems.

For more information, please read https://www.inorbit.ai/docs#incident-mgmt-webhook-apis

# Using the sample

Below you will find the steps to build, run and configure the provided sample

## Building

The sample comes prepared to be run as a docker image. You can build the image with:

`docker build . -t incident-mgmt-gchat`

## Configuring

On the target Google Chat room, go to WebHook Settings and get the Google Chat Webhook URL.

This URL must be provided as the WEBHOOK_URL environment variable to the running container.

On InOrbit control, you go to Settings > Admin > Integrations and enable Webhook.
You must provide the HTTPS (recommended) or HTTP endpoint name where this service is being deployed.

## Running

A `start.sh` script is provided in this directory as a convenience example for running the container.
The service must be deployed on an address accessible from the Internet through an IP address or fully qualified
domain name in order to be reachable by the InOrbit Cloud to dispatch webhook requests.