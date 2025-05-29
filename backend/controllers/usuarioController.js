const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Cadastro
exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({ nome, email, senha: senhaCriptografada, tipo });
    await novoUsuario.save();

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario._id, tipo: usuario.tipo }, 'segredo', { expiresIn: '2h' });

    res.json({ mensagem: 'Login realizado com sucesso', token });
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
};

// Agendamento
exports.agendar = async (req, res) => {
  try {
    const { clienteId, barbeiroId, horario } = req.body;

    // Verificar disponibilidade
    const disponibilidade = await verificarDisponibilidade(barbeiroId, horario);
    if (!disponibilidade) return res.status(400).json({ erro: 'Horário indisponível' });

    // Criar agendamento
    const novoAgendamento = new Agendamento({ clienteId, barbeiroId, horario });
    await novoAgendamento.save();

    // Enviar notificação
    await enviarNotificacao(clienteId, 'Agendamento confirmado');

    res.status(201).json({ mensagem: 'Agendamento realizado com sucesso!' });
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
};

// Função para verificar disponibilidade
async function verificarDisponibilidade(barbeiroId, horario) {
  // Implementar lógica de verificação
  return true;
}

// Função para enviar notificação
async function enviarNotificacao(clienteId, mensagem) {
  // Implementar lógica de envio de notificação
}
