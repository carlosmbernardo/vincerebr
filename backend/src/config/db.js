const mongoose = require('mongoose');

exports.connect = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI não configurado');
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'vincere' });
  console.log('MongoDB conectado');
};