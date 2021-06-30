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
 * Google ChatBot
 * Creates a card with the InOrbit alert information on Google Chat
 * https://developers.google.com/chat/concepts/bots
 */

/**
 * Severity colors used to better describe the incident severity
 * At InOrbit we have 4 severity levels for incidents, this colors match
 * the colors used in InOrbit https://www.inorbit.ai/docs#incident-management
 */
const severityColors = {
  'SEV 0': '#700893',
  'SEV 1': '#A335C8',
  'SEV 2': '#DA80F9',
  'SEV 3': '#F1CAFF'
};

/**
 * Creates and styles the google chat message card
 * Returns the card with detail of the alert received in params
 * https://developers.google.com/chat/reference/message-formats/cards
 */
const createGoogleChatCards = ({ severity, message, status, name, date, label, id }) => [
  {
    "header": {
      "title": `${status} alert from InOrbit</b>`,
      "subtitle": `Robot name: ${name}`
    },
    "sections": [
      {
        "widgets": [
          {
            "keyValue": {
              "topLabel": `Severity`,
              "content": `<b><font color=\"${severityColors[severity]}\">${severity}</b>`
            }
          },
          {
            "keyValue": {
              "topLabel": "Trigger label",
              "content": label || '--'
            }
          },
          {
            "keyValue": {
              "topLabel": "Generated on",
              "content": date || '--'
            }
          },
          {
            "keyValue": {
              "topLabel": "Message",
              "content": message || '--',
              "contentMultiline": true
            }
          },
          {
            "keyValue": {
              "topLabel": "Robot id",
              "content": id || '--'
            }
          }
        ]
      }
    ]
  }
];

module.exports = { createGoogleChatCards };
