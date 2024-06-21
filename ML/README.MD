# KulitKu App Project - Machine Learning Team
<div align=justify>

Machine Learning team is responsible for creating the model and integrating the ML model with the Cloud Computing team.

**Authors :**
| Name                              | Student ID  | Universitas   |
| ----------------------------------|-------------|---------------|
| Muhammad Sutan Siregar     | M008D4KY2762 | Universitas Gadjah Mada |
| Muhammad Reza Ubaidillah                   | M269D4KY2834 | Universitas Mulawarman  |
| Charles                   | M004D4KY3046 | Institut Teknologi Sepuluh Nopember  |

<br>

**Kulitku Machine Learning**
This repository contains all the model and dataset that we used in order to create our model. The dataset consist of 14 different skin label that will be used in the training of the model.
We use MobileNetV3 for the transfer learning model by adding new layer on top of it. The result is the a model with validation accuracy more than 91% which is quite good.

For the deployment code, we use flask for the web framework. The flow is for the backend service to send a google cloud bucket link of an images that want to be predicted.
After that our python code will use the model that we loaded using tensorflow js and then it will predict the disease based on the image.

For the all the code and stuff could be checked on the folder of this repository!

![alt](ML/architecture.jpg

<br>

