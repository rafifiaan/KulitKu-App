const port = process.env.PORT || 3000;
const express = require('express');
const app = express();

require('dotenv').config();
const bodyParser = require('body-parser');

const userRouter = require('./src/users/users.router.js');

app.use(express.json());
app.use(bodyParser.json());

app.use('/', userRouter);

app.get('/' , (req , res)=>{
    res.send('hello server :)');
});
 
app.listen(port , ()=> {
    console.log('> Server is up and running on port : ' + port);
})