const {Guid} = require('js-guid');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const configuration = require('./configuration/configuration.json');
const cityJson = require('./configuration/city.json');
const archiver = require('archiver')
const Stream = require('stream')

const app = express();
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//start app
const port = process.env.PORT || configuration.serverPort;

const cityData = (() => {
    const zhixia = ['北京', '天津', '上海', '重庆', '台湾', '香港', '澳门']
    const dataSet = cityJson.Location.CountryRegion
    return dataSet.map(m => {
        if (m.Name === '中国') {
            let children = m.State.map(n => {
                if (zhixia.indexOf(n.Name) !== -1) {
                    return {
                        key: m.Name + "-" + n.Name,
                        value: n.Name,
                        children: []
                    }
                } else {
                    return {
                        key: m.Name + "-" + n.Name,
                        value: n.Name,
                        children: n.City.map(k => ({
                            key: m.Name + "-" + n.Name + "-" + k.Name,
                            value: k.Name,
                            children: []
                        }))
                    }
                }
            })
            return {
                key: m.Name,
                value: m.Name,
                children: children
            }
        } else {
            if (!m.State) {
                return {
                    key: m.Name,
                    value: m.Name,
                    children: []
                }
            }
            if (Array.isArray(m.State)) {
                let children = m.State.map(n => ({
                    key: m.Name + "-" + n.Name,
                    value: n.Name,
                    children: Array.isArray(n.City) ? n.City.map(k => ({
                        key: m.Name + "-" + n.Name + "-" + k.Name,
                        value: k.Name,
                        children: []
                    })) : []
                }))
                return {
                    key: m.Name,
                    value: m.Name,
                    children: children
                }
            }
            return {
                key: m.Name,
                value: m.Name,
                children: Array.isArray(m.State.City) ? m.State.City.map(n => ({
                    key: m.Name + "-" + n.Name,
                    value: n.Name,
                    children: []
                })) : []
            }
        }
    })
})()

app.set('port', port);

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);

app.use(express.static(path.join(__dirname, "public")))
app.use("/resource", express.static(configuration.resourceDir))

// app.use(async (req, res, next) => {
//     const reqPath = req.path;
//     if (reqPath === "/" || reqPath.startsWith("/page") || reqPath.startsWith("/login")) {
//         return res.redirect('/');
//     }
//     next()
// })

app.get('/download-picture', async (req, res) => {
    var archive = archiver('zip');

    archive.on('error', function(err) {
        res.status(500).send({error: err.message});
    });

    //on stream closed we can end the request
    archive.on('end', function() {
        console.log('Archive wrote %d bytes', archive.pointer());
    });

    //set the archive name
    res.attachment('图片.zip');

    //this is the streaming magic
    archive.pipe(res);

    var directories = [configuration.registerWorkDir + '/picture']

    for(var i in directories) {
        archive.directory(directories[i], directories[i].replace(__dirname + '/picture', ''));
    }

    archive.finalize();
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

app.get('/config/cityData', async (req, res) => {
    try {
        res.send(cityData);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "public/index.html"))
})
