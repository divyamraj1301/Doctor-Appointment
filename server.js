const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//env conf
dotenv.config();

//DB Conn.
connectDB();

//REST obj
const app = express()

//Middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors());
app.use(cookieParser());

//Routes
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/doctor', require('./routes/doctorRoutes'));

const port = process.env.PORT || 8080;

//Port
app.listen(port, () => {
    console.log(`Server in ${process.env.NODE_MODE} mode, port = ${process.env.PORT}`)
})