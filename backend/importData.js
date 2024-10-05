// backend/importData.js
const mongoose = require('mongoose');
const Data = require('./models/Data');
const data = require('./jsondata.json');

mongoose.connect('mongodb+srv://Shrijan:Latasahu1234@cluster0.a28tcf3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const importData = async () => {
  try {
    await Data.deleteMany({});
    await Data.insertMany(data);
    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
