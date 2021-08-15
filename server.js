
const {Guid} = require('js-guid');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const configuration = require('./configuration/configuration.json');

const app = express();
const router = express.Router();
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
//start app
const port = process.env.PORT || configuration.serverPort;

app.set('port', port);

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);

app.use(express.static(path.join(__dirname, "public")))
app.use("/resource", express.static(configuration.resourceDir))

app.use(async (req, res, next) => {
    const reqPath = req.path;
    if (reqPath === "/" || reqPath.startsWith("/page") || reqPath.startsWith("/login")) {
        return res.redirect('/');
    }
    next()
})

app.post('/upload-picture', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retri
            let avatar = req.files.file;
            //Use the mv() method to place the file in upload directory
            let fileName = avatar.name
            if (fileName.split(".").length > 1) {
                fileName = Guid.newGuid().toString() + "." + fileName.split(".").slice(-1)[0]
            } else {
                fileName = Guid.newGuid().toString()
            }
            avatar.mv(configuration.resourceDir + fileName);
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: fileName,
                    mimetype: avatar.mimetype,
                    size: avatar.size,
                    path: path.resolve('./', configuration.resourceDir + fileName)
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/config/load', async (req, res) => {
    try {
        res.send(configuration);
    } catch (err) {
        res.status(500).send(err);
    }
});
