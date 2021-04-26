const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('./dist'));
app.use(bodyParser.json());

app.post('/clicks', (req, res) => {
    console.log(req.body);
    res.send();
});

app.listen(port, () => console.log(`Listening at port ${port}!`));