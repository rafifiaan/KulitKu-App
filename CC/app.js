const express = require('express');
const app = express();

const multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket('kulitku-bucket');

require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

const userRouter = require('./src/users/users.router.js');
const kulitRouter = require('./src/kulit/kulit.route.js');

app.use(express.json());
app.use(bodyParser.json());

app.use('/', userRouter);
app.use('/', kulitRouter);

// fitur scan

// middleware multer
const tempGCS = multer({
    storage: multer.memoryStorage(),
});

app.post('/upload', tempGCS.single('file'), (req, res) => {
    try {
        // mendapatkan file dari request
        const file = req.file;

        // menyimpan gambar ke GCS
        const gcsFileName = 'upload/' + file.originalname;
        const gcsFile = bucket.file(gcsFileName);

        // membuat stream untuk penulisan file ke GCS
        const stream = gcsFile.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
            resumable: false,
        });

        stream.on('error', (err) => {
            console.error('Error terjadi saat upload ke GCS:', err);
            res.status(500).json({ message: 'Kesalahan internal pada server' });
        });

        stream.on('finish', () => {
            console.log('File di-upload ke GCS:', gcsFileName);
            res.status(200).json({ message: 'File berhasil di-upload ke GCS' });
        });

        stream.end(file.buffer);

    } catch (error) {
        console.error('Terjadi kesalahan saat memproses request:', error);
        res.status(500).json({ message: 'Kesalahan internal pada server' });
    }
})

app.get('/' , (req , res)=>{
    res.send('halo server :)');
});
 
app.listen(port , ()=> {
    console.log('> Yeay! Server aktif dan berjalan pada port: ' + port);
})