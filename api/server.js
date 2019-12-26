const app = require('./app');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// DATABASE
// LOCAL DATABASE SETUP
// const DB = process.env.DATABASE_LOCAL;
// ATLAS SETUP
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`MongoDB Database Connected.`))
  .catch(err => console.log(`Database ERROR: ${err}`));

// SERVER
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, err => {
  if (err) console.log(`ERROR: ${err}`);
  console.log(`Server listeing at port ${PORT}.`);
});
