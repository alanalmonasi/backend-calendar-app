const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dbConnection = async () => {
   try {
      await mongoose.connect(process.env.DB_URI);
      console.log('DB connected');
   } catch (error) {
      console.log(error);
      throw new Error('Error in DB');
   }
};

module.exports = {
   dbConnection,
};
