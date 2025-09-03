const express = require('express')
const app = express()
const port = 3000
import {connection} from './config/database';
import { uploadReceipt } from './config/multer';
import cors from "cors";
import userRoutes from "./routes/userRoutes";

import expenseRoutes from "./routes/expenseRoutes";
import categoryRoutes from "./routes/categoryRoutes";
const dotenv = require('dotenv');

dotenv.config();
app.use(express.json());
app.use(cors());
// ✅ Optional: parse URL-encoded forms (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/expenses", expenseRoutes);


app.use("/categories", categoryRoutes);




app.post('/upload', uploadReceipt.single('receipt'), (req, res) => {
  res.send('File uploaded successfully');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

connection();  

