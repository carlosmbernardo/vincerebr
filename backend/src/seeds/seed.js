require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || 'vincere' });

  await Service.deleteMany({});
  await Service.insertMany([
    { titulo: 'Criação de Sites', descricao: 'Sites rápidos e responsivos', ordem: 1 },
    { titulo: 'Branding', descricao: 'Logo, paleta e identidade', ordem: 2 },
    { titulo: 'Tráfego Pago', descricao: 'Campanhas que convertem', ordem: 3 }
  ]);

  await Project.deleteMany({});
  await Project.insertMany([
    { titulo: 'Site MEI X', descricao: 'One-page otimizada', imagemUrl: '', link: '#', tags:['site'] },
    { titulo:'Landing Y', descricao:'Conversão alta', link:'#', tags:['landing'] }
  ]);

  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    { nome:'João', cargo:'MEI', empresa:'Vincere Cliente', mensagem:'Excelente entrega!' },
    { nome:'Ana', cargo:'Empreendedora', empresa:'Loja Ana', mensagem:'Recomendo demais!' }
  ]);

  console.log('Seed ok'); process.exit(0);
})();