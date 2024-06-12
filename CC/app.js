// keperluan aplikasi web server
const express = require('express');
const app = express();

// keperluan environment variable
require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

// keperluan upload file ke GCS
const multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket('kulitku-bucket');
const tempGCS = multer({ // middleware multer
    storage: multer.memoryStorage(), 
});

const crypto = require('crypto');

// keperluan route
const userRouter = require('./src/users/users.router.js');
const kulitRouter = require('./src/kulit/kulit.route.js');
// const predictRouter = require('./src/predict/predict.route.js');

app.use('/', userRouter);
app.use('/', kulitRouter);
// app.use('/', predictRouter);

app.use(express.json());
app.use(bodyParser.json());


// fitur upload ke GCS dan penyimpanan ke database
app.post('/upload', tempGCS.single('file'), (req, res) => {
    try {

        // log penerimaan file
        console.log('File yang diterima:', req.file);

        // memeriksa apakah file ada
        if (!req.file) {
            return res.status(400).json({ message: 'Tidak ada file yang diunggah' });
        }
        
        // mendapatkan file dari request
        const file = req.file;

        // menyimpan gambar ke GCS
        const gcsFileName = 'upload/' + file.originalname;
        const gcsFile = bucket.file(gcsFileName);

        // variabel penampung link object setelah upload GCS
        let publicUrl;

        // membuat stream untuk penulisan file ke GCS
        console.log('Membuat stream untuk upload ke GCS...');
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

        stream.on('finish', async () => {
            console.log('File di-upload ke GCS:', gcsFileName);

            // Link URL gambar yang di-upload
            publicUrl = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
            console.log(publicUrl);
            res.status(200).json({ message: 'File berhasil di-upload ke GCS' });
        });

        console.log('Stream menyelesaikan proses...');
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