const express = require('express');
const cors = require('cors');
const config = require('better-config');
const bodyParser = require('body-parser');
const ngrok = require('ngrok');
const router = require('./routes');

config.set('../config.json');
const app = express();

app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

const port = config.get('application.port');
const host = config.get('application.host');

const init = async () => {
    app.listen(port, host, () => {
        console.log(`Example app listening on port http://${host}:${port}`);
    });
    
    await ngrok.connect(port, (err, url) => {
        if (err) {
            console.error('Error while connecting Ngrok',err);
            return new Error('Ngrok Failed');
        }
    });
}

init();