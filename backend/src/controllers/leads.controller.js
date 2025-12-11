const Lead = require('../models/Lead');
// pode até remover essa linha se não for mais usar e-mail
// const { enviarEmail } = require('../utils/email');

exports.criar = async (req, res) => {
  const { nome, email, telefone, mensagem } = req.body;

  // validação básica dos obrigatórios
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
  }

  try {
    const lead = await Lead.create({ nome, email, telefone, mensagem });

    // se quiser voltar com o envio de e-mail depois, faz assim:
    /*
    const to = process.env.OWNER_EMAIL;
    if (to) {
      enviarEmail({
        to,
        subject: `Novo lead – ${nome}`,
        html: `<h2>Novo lead do site</h2>
               <p><strong>Nome:</strong> ${nome}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Telefone:</strong> ${telefone || '-'}</p>
               <p><strong>Mensagem:</strong> ${mensagem}</p>`
      }).catch(err => {
        console.error('Falha ao enviar e-mail do lead:', err);
      });
    }
    */

    // SE CHEGOU AQUI, É SUCESSO → responde 201
    return res.status(201).json({ ok: true, leadId: lead._id });
  } catch (err) {
    console.error('Erro ao criar lead:', err);
    // erro real mesmo (banco etc.)
    return res.status(500).json({ erro: 'Erro ao salvar seu contato.' });
  }
};
