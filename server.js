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
const addressJson = require('./configuration/pca.json');
const archiver = require('archiver')
const Stream = require('stream')
const Canvas = require('canvas')
const moment = require('moment')
Canvas.registerFont(path.resolve(__dirname, "public/font/SourceHanSerifSC-Heavy.otf"), {family: "SourceHanSerifSC-Heavy"})
Canvas.registerFont(path.resolve(__dirname, "public/font/zihun143.ttf"), {family: "zihun143"})

const app = express();
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//start app
const port = process.env.PORT || configuration.serverPort;

const addressData = (() => {
    const data = addressJson
    const result = []
    for (let key in data) {
        let unit = {}
        unit.name = key

        if(Array.isArray(data[key])){
            unit.subList = data[key].map(m=>({name:m}))
        }else{
            let subList = []
            for (let subKey in data[key]) {
                subList.push({name: subKey, subList:data[key][subKey].map(m=>({name:m}))})
            }
            unit.subList = subList
        }
        result.push(unit)
    }
    return result
})()

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

app.get('/download-picture', async (req, res) => {
    var archive = archiver('zip');

    archive.on('error', function (err) {
        res.status(500).send({error: err.message});
    });

    //on stream closed we can end the request
    archive.on('end', function () {
        console.log('Archive wrote %d bytes', archive.pointer());
    });

    //set the archive name
    res.attachment('图片.zip');

    //this is the streaming magic
    archive.pipe(res);

    var directories = [configuration.registerWorkDir + '/picture']

    for (var i in directories) {
        archive.directory(directories[i], directories[i].replace(configuration.registerWorkDir + '/picture', ''), m => {

            return m
        });
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

app.get('/config/addressData', async (req, res) => {
    try {
        res.send(addressData);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/loginHeader/:title', async (req, res) => {
    const title = req.params.title
    const tmpCanvas = Canvas.createCanvas(1080, 66)
    const tmpCtx = tmpCanvas.getContext('2d')
    tmpCtx.font = 'bold 66px "SourceHanSerifSC-Heavy"'
    const measureText = tmpCtx.measureText(title)

    const canvas = Canvas.createCanvas(measureText.width, 66)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#4e4c4c'
    ctx.font = 'bold 66px "SourceHanSerifSC-Heavy"'
    ctx.fillText(title, 0, 58)
    const buffer = canvas.toBuffer('image/png')
    res.contentType("image/png")
    res.send(buffer)

    res.end()
})

app.get("/activeTitle/:title", async (req, res) => {
    const title = req.params.title
    const tmpCanvas = Canvas.createCanvas(1080, 66)
    const tmpCtx = tmpCanvas.getContext('2d')
    tmpCtx.font = 'italic bold 66px "zihun143"'
    tmpCtx.transform(1, 0, -0.2, 1, 0, 0)
    const measureText = tmpCtx.measureText(title + "/人气榜")

    const canvas = Canvas.createCanvas(measureText.width + 10, 66)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f6aa10'
    ctx.font = 'italic bold 66px "zihun143"'
    ctx.transform(1, 0, -0.2, 1, 0, 0)
    ctx.fillText(title + "/人气榜", 10, 58)
    const buffer = canvas.toBuffer('image/png')
    res.contentType("image/png")
    res.send(buffer)

    res.end()
})

app.get("/activeText/:text", async (req, res) => {
    const text = req.params.text
    const tmpCanvas = Canvas.createCanvas(1080, 66)
    const tmpCtx = tmpCanvas.getContext('2d')
    tmpCtx.font = 'italic bold 66px "zihun143"'
    tmpCtx.transform(1, 0, -0.2, 1, 0, 0)
    const measureText = tmpCtx.measureText(text)

    const canvas = Canvas.createCanvas(measureText.width, 66)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.font = 'italic bold 66px "zihun143"'
    ctx.fillText(text, 0, 58)
    const buffer = canvas.toBuffer('image/png')
    res.contentType("image/png")
    res.send(buffer)

    res.end()
})

app.get('/titleImg/:title', async (req, res) => {
    const title = req.params.title
    const tmpCanvas = Canvas.createCanvas(1080, 66)
    const tmpCtx = tmpCanvas.getContext('2d')
    tmpCtx.font = 'bold 66px "SourceHanSerifSC-Heavy"'
    const measureText = tmpCtx.measureText(title)

    const canvas = Canvas.createCanvas(measureText.width, 66)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 66px "SourceHanSerifSC-Heavy"'
    ctx.fillText(title, 0, 58)
    const buffer = canvas.toBuffer('image/png')
    res.contentType("image/png")
    res.send(buffer)

    res.end()
})

app.get('/timeImg/:beginTime/:endTime', async (req, res) => {

    const beginTime = moment(req.params.beginTime).format("YYYY-MM-DD HH:mm:ss")
    const endTime = moment(req.params.endTime).format("YYYY-MM-DD HH:mm:ss")
    const tmpCanvas = Canvas.createCanvas(1080, 24)
    const tmpCtx = tmpCanvas.getContext('2d')
    tmpCtx.font = 'bold 24px "SourceHanSerifSC-Heavy"'
    const measureText = tmpCtx.measureText(beginTime + " - " + endTime)

    const canvas = Canvas.createCanvas(measureText.width, 24)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px "SourceHanSerifSC-Heavy"'
    ctx.fillText(beginTime + " - " + endTime, 0, 22)
    const buffer = canvas.toBuffer('image/png')
    res.contentType("image/png")
    res.send(buffer)

    res.end()
})

app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "public/index.html"))
})
