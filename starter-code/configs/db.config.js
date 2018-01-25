const mongoose = require('mongoose');
const DB_NAME = 'lab-express-linkedin-clone';
const MONGO_URI = `mongodb://localhost/${DB_NAME}`;

//mongoose.Promise = Promise;
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to ${DB_NAME} databse.`);
    })
    .catch((error) => {
        console.log(`Database connection error: ${error}`);
    })
