/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const serveStatic = require("serve-static")
const path = require('path');
const app = express();
app.use(serveStatic(path.join(__dirname, 'dist')));
const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`vuedo-proto on port ${port} Listening!`);
});