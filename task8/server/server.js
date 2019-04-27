const path = require('path');
const express = require('express');

const app = express(),
      SITE_OPTIONS = {
        portnum: 8080
      };

app.use('/', express.static(
  path.resolve(__dirname, '../client'),
  SITE_OPTIONS
));

app.listen(SITE_OPTIONS.portnum);
console.log(`Running App on port ${SITE_OPTIONS.portnum}`);
