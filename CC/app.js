const port = process.env.PORT || 3000;
const express = require('express');
const app = express();

require('dotenv').config();
const bodyParser = require('body-parser');

const userRouter = require('./src/users/users.router.js');
const kulitRouter = require('./src/kulit/kulit.route.js');

app.use(express.json());
app.use(bodyParser.json());

app.use('/', userRouter);
app.use('/', kulitRouter);

// fitur scan


app.get('/' , (req , res)=>{
    res.send('halo server :)');
});
 
app.listen(port , ()=> {
    console.log('> Yeay! Server aktif dan berjalan pada port: ' + port);
})