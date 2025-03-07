const express  = require('express');
const app = express();
const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://localhost:27017/Hivbnb';

main()
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.log('Error connecting to MongoDB: ', err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {        
    console.log('Server is running on port 3000');
});