import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';


const app = express();
const port = process.env.PORT || 6000;

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

