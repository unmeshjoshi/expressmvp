var express = require('express');
var expmvp = require('expressmvp');

app = express();

expmvp.configure(app)

app.listen(3000);