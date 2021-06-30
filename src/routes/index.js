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
var express = require('express');
const fetch = require('node-fetch');
var { createGoogleChatCards } = require('../bots/googleChat');

var router = express.Router();

/**
 * GET request
 * Renders project description
 */
router.get('/', function(req = {}, res) {
  res.render('index.html')
});

/**
 * POST request that will receive the alert message to be passed to the chatbot
 *
 * Receives the in the request the incident details, then it does some light parsing generates
 * a Google ChatBot card that will then be passed to the ChatBot via post to the WEBHOOK_URL
 */
router.post('/', function(req = {}, res) {
  const { entity = {}, severity, details = {}, message, status = "", ts} = req.body;
  var date = new Date(ts);
  const cards = createGoogleChatCards({
    label: details.incidentLabel,
    name: entity.name,
    id: entity.id,
    severity,
    date,
    message,
    status: status.toUpperCase()
  });
  // Environment variable that contains the url of the webhook
  fetch(process.env.WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ cards })
  });
});

module.exports = router;
