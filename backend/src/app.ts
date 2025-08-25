const express = require('express')
const app = express()
const port = 3000
import {connection} from './config/database';
import { uploadReceipt } from './config/multer';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/upload', uploadReceipt.single('receipt'), (req, res) => {
  res.send('File uploaded successfully');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

connection();  

