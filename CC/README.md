# KulitKu App Project - Cloud Computing Teams
<div align=justify>

Cloud Computing team is responsible for creating and providing several API codes and Integration Models according to the needs of the Mobile Development team.

**Authors :**
| Name                              | Student ID  | Universitas   |
| ----------------------------------|-------------|---------------|
| Arfi Raushani Fikra     | C004D4KY0721 | Institut Teknologi Sepuluh Nopember |
| Rafi Aliefian Putra Ramadhani                   | C004D4KY1225 | Institut Teknologi Sepuluh Nopember  |

<br>

**Requirements & Tools :**

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)


**Endpoints :**
- /login  = login user
- /register = register user
- /home = get several data for home page (fact, list history, article)
- /history/:user_yang_scan = get all scanned history data based on ID
- /artikel = get all artikel data
- /artikel/:id_artikel = get detailed article specific data by id
- /upload = [POST] upload image -> store to gcs bucket -> predict data -> get data

**Service in GCP :**
- Cloud Run = Deployment
  - Service for [Backend Services](https://github.com/rafifiaan/KulitKu-App/tree/main/CC/backend-services) = Using Node.js and Express.js
  - Service for [ML Services - Deploy Model API](https://github.com/rafifiaan/KulitKu-App/tree/main/CC/ml-services) = Using Flask
- Cloud Storage = Store Image
- Cloud SQL = Database 

<br> 

**How To deploy in Cloud Run :**
> This steps was the general step of deploying in Cloud Run. For this project, Im individually prefer using Dockerfile for deploying.
1. Create Project
2. Clone your code to cloud shell (make sure already tested in local and have no error)
3. Deploy in terminal using command :
    ```
    gcloud run deploy
    ```
4. After run command above, will be prompted several number of region and you have to choose. In this project im using 'asia-southeast2' number 9
5. Then, will prompted some question and just type 'Y'
6. If there's no error, new service will appear in your cloud run page

<br>

**Fun Fact!**
> This app allows you to use your device's camera to take pictures of skins. Select a picture of the skins you want to know about, and upload it to the application. voila! then you will find out what skin disease are and various kinds of interesting information.