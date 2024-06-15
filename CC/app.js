// keperluan aplikasi web server
const express = require('express');
const app = express();

// Keperluan call ML-API menggunakan axios
const axios = require('axios');

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
const tempGCS = multer({ storage: multer.memoryStorage() }); // middleware multer

// keperluan konfigurasi koneksi database MySQL
const pool = require("./config/databases.js");

// keperluan pengisian data ke database
const crypto = require('crypto');
const moment = require('moment');

// keperluan route
const userRouter = require('./backend_api/users/users.route.js');
const kulitRouter = require('./backend_api/kulit/kulit.route.js');

app.use('/', userRouter);
app.use('/', kulitRouter);

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

        // stream on finish
        stream.on('finish', async () => {

            // pemanggilan ML API dan mendapatkan hasil data prediksi (menunggu konfirmasi tim ML)
            const apiUrl = process.env.API_PREDICT_HOST;
            const mlApiResponse = await axios.post(apiUrl, { filename: file.originalname });
            console.log('API Response:', mlApiResponse.data);
            const predictionResult = mlApiResponse.data.label; // predictionResult menyimpan nama penyakit hasil prediksi API ML

            console.log('File yang akan di-upload ke GCS:', gcsFileName);

            // mempersiapkan data yang akan diisikan ke database
            const id_scan = crypto.randomBytes(8).toString('hex');
            const waktu_scan = moment().format('HH:mm:ss');
            const tanggal_scan = moment().format('YYYY-MM-DD');
            const gambar_scan_url = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
            const id_penyakit_dugaan = mlApiResponse.data.data.id_penyakit;
            const persentase = parseFloat(mlApiResponse.data.confidence.toFixed(2));
            const user_yang_scan = 1; // on_prog

            // console.log(gambar_scan_url);

            const query = 'INSERT INTO scan_keluhan (id_scan, waktu_scan, tanggal_scan, gambar_scan, penyakit_dugaan, persentase, user_yang_scan) VALUES (?, ?, ?, ?, ?, ?, ?)';
            pool.query(query, [id_scan, waktu_scan, tanggal_scan, gambar_scan_url, id_penyakit_dugaan, persentase, user_yang_scan], (err, results) => {
                if (err) {
                    console.error('Error menyimpan data ke database:', err);
                    return res.status(500).json({ message: 'Kesalahan menyimpan data ke database' });
                }

                if (results.affectedRows > 0) {
                    console.log('Data berhasil disimpan ke database');
                }
            });

            const responseToClient = {
                data: {
                    nama_penyakit: predictionResult,
                    gambar: gambar_scan_url,
                    persentase: persentase,
                    definisi_penyakit: mlApiResponse.data.data.definisi_penyakit,
                    penyebab: mlApiResponse.data.data.penyebab_penyakit,
                    gejala_penyakit: mlApiResponse.data.data.gejala_penyakit,
                    sinyal_ke_dokter: mlApiResponse.data.data.sinyal_ke_dokter,
                },
            };
            res.status(200).json(responseToClient);

            console.log('File berhasil disimpan ke GCS');
            // res.status(200).json({ message: 'File berhasil di-upload ke GCS dan data scan disimpan ke database' });
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