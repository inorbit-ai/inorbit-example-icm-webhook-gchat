/**
 * Copyright 2021 InOrbit
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * Index
 * Contains the endpoints that receive the InOrbit notification
 */
const express = require('express');
const { createGoogleChatCards, sendMessage } = require('../bots/googleChat');

const indexRouter = express.Router();

/**
 * Value and setter for X-InOrbot-Key for this account.
 * It must be set before the service can receive and authenticate
 * InOrbit Incident Management Webhook calls.
 */
let inorbitIcmKey;
function setInorbitIcmKey(newKey) {
  inorbitIcmKey = newKey;
}

/**
 * GET request
 * Renders project description
 */
indexRouter.get('/', function(req = {}, res) {
  res.render('index.html')
});

/**
 * POST request that will receive the alert message to be passed to the chatbot
 *
 * Receives the incident details in the request body, parses it and then sends a
 * message to Google Chat as a formatted card.
 *
 * The most relevant fields received are the following:
 * - entity (id and name): most normally the robot associated with this incident
 * - message: a textual incident message and a more detailed description
 * - status: 'new' or 'resolved'
 * - severity: Indicates the severity of the message (SEV 0, SEV 1, SEV 2, SEV 3)
 * - ts: The timestamp (in epoch) when the incident notification was triggered
 * - actions: array of inOrbit actions (https://www.inorbit.ai/docs#configure-actions)
 *
 * See https://www.inorbit.ai/docs#incident-mgmt-webhook-apis for more details
 */
indexRouter.post('/', function(req = {}, res, next) {

  // Get incident details from InOrbit webhook message
  const { entity = {}, severity, details = {}, message, status = "", ts, actions } = req.body;
  const date = new Date(ts).toUTCString();

  // Check InOrbit authorization header to confirm message authenticity
  const inorbitKey = req.get('x-inorbit-key');
  if (!inorbitKey || inorbitKey != inorbitIcmKey) {
    next('Invalid or missing X-InOrbit-Key header');
    return;
  }

  // Format the incident notification for pretty display in Google Chat
  const cards = createGoogleChatCards({
    label: details.incidentLabel,
    name: entity.name,
    id: entity.id,
    severity,
    date,
    message,
    status: status.toUpperCase(),
    actions
  });

  // Submit the message to Google Chat
  sendMessage(cards)
    .then(() => res.sendStatus(200))
    .catch(error => next(error));
});

module.exports = { indexRouter, setInorbitIcmKey };
