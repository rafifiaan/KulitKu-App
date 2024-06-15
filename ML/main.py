import os
import tensorflow as tf
from flask import Flask, request, jsonify
from keras.models import load_model
import numpy as np
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
from io import BytesIO
from flask_sqlalchemy import SQLAlchemy
from google.cloud import storage

app = Flask(__name__, static_url_path='', static_folder='static')

# Load your .h5 model
model = load_model('best_model.h5', compile=False)

# Connect to databse
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'kulitku-product-credentials.json'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:skin123@/dbkulit?unix_socket=/cloudsql/kulitku-product:asia-southeast2:kulitku-project'
storage_client = storage.Client()

db = SQLAlchemy(app)


class Penyakit(db.Model):
    id_penyakit = db.Column(db.Integer, primary_key=True)
    gambar_penyakit = db.Column(db.String(255), nullable=False)
    nama_penyakit = db.Column(db.String(50), nullable=False)
    definisi_penyakit = db.Column(db.Text)
    penyebab_penyakit = db.Column(db.Text)
    gejala_penyakit = db.Column(db.Text)
    sinyal_ke_dokter = db.Column(db.Text)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            image_bucket = storage_client.get_bucket('kulitku-bucket')
            filename = request.json['filename']
            img_blob = image_bucket.blob('upload/' + filename)
            img_path = BytesIO(img_blob.download_as_bytes())
        except Exception:
            respond = jsonify({'message': 'Error loading image file'})
            respond.status_code = 400
            return respond

        img = tf.keras.utils.load_img(img_path, target_size=(224, 224))
        x = tf.keras.utils.img_to_array(img)
        x = np.expand_dims(x, axis=0).astype(np.float32)
        x = preprocess_input(x)
        images = np.vstack([x])

        # Model predict
        pred_disease = model.predict(images)
        # Find the indexe prediction of the image
        predicted_label_index = np.argmax(pred_disease)

        # Check if the prediction is above a certain threshold
        threshold = 0.2
        if pred_disease[0][predicted_label_index] <= threshold:
            respond = jsonify({'message': 'Penyakit Tidak Terdeteksi'})
            respond.status_code = 400
            return respond

        # Prepare the response with prediction information
        penyakit_data = Penyakit.query.order_by(Penyakit.id_penyakit).offset(predicted_label_index).first()
        
        result = {
            "label": penyakit_data.nama_penyakit,
            "confidence": float(pred_disease[0][predicted_label_index]),
            "data": {
                    "id_penyakit": penyakit_data.id_penyakit,
                    "gambar_penyakit": penyakit_data.gambar_penyakit,
                    "nama_penyakit": penyakit_data.nama_penyakit,
                    "definisi_penyakit": penyakit_data.definisi_penyakit,
                    "penyebab_penyakit": penyakit_data.penyebab_penyakit,
                    "gejala_penyakit": penyakit_data.gejala_penyakit,
                    "sinyal_ke_dokter": penyakit_data.sinyal_ke_dokter
                }
        }

        respond = jsonify(result)
        respond.status_code = 200
        return respond

    return 'OK'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
