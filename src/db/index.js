const mongoose = require('mongoose');

let uri =
  'mongodb+srv://jaimeq:qHSjKPPiF9fbrnao@2call.ndwm5.mongodb.net/2call-crm?retryWrites=true';


const mongoConnect = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error('error connecting to MongoDB:', error.message);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

module.exports = mongoConnect;
