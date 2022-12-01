const path = require('path');
const fs = require('fs');

const express = require('express');
const multer = require('multer');

const storageConfig = multer.diskStorage({
    destination: (req, file ,cb) => {
      cb(null, 'files');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

const upload = multer({storage: storageConfig});

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tasks', (req, res) => {
    res.send(fs.readFileSync(path.join(__dirname, 'task.json')));
});

app.post('/tasks', (req, res) => {
    fs.writeFileSync(path.join(__dirname, 'task.json'), JSON.stringify(req.body));
})

app.post('/upload', upload.any(), (req, res) => {});

app.delete('/delete', (req, res) => {
    if (typeof(req.body.name) === 'string') {
        fs.unlinkSync(path.join(__dirname, 'files', req.body.name));
    } else {
        for (const name of req.body.name) {
            fs.unlinkSync(path.join(__dirname, 'files', name));
        };
    };
});

app.get('/file', (req, res) => {
    res.download(path.join(__dirname, 'files', req.query.name));
});

app.listen(3000);