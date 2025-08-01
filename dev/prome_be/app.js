const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const diagRoutes = require('./src/routes/diagRoutes');
const hospitalRoutes = require('./src/routes/hospitalRoutes');
const etcRoutes = require('./src/routes/etcRoutes');
const mapRoutes = require('./src/routes/mapRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({ message: "서버 작동 중" });
});

app.use('/auth', authRoutes);
app.use('/diagnose', diagRoutes)
app.use('/chat', chatRoutes)
app.use('/hospital', hospitalRoutes)
app.use('/map', mapRoutes);
app.use('/', etcRoutes);


app.use(errorHandler);

module.exports = app;
