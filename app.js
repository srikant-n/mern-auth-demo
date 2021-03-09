require('dotenv').config()
const express  = require('express');
const cors = require(cors);

const port = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'development';

const app = express();
app.use(cors())

app.use(express.static(path.join(__dirname, 'client', 'build')));

const dbPath = env === "production" ? process.env.DB_PATH :  (env==="development" ? process.env.DB_PATH_DEV : process.env.DB_PATH_TEST);

mongoose.connect(dbPath, { useNewUrlParser: true })
  .then(() => console.log('DB: Connected'))
  .catch((err) => console.error(err));

app.listen(port,() => {console.log(`Litening on port: ${port}`)});