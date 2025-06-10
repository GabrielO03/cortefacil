const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Cadastro
exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({ nome, email, senha: senhaCriptografada, tipo });
    await novoUsuario.save();

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor. Tente novamente.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações
    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: usuario._id, tipo: usuario.tipo, nome: usuario.nome }, 
      process.env.JWT_SECRET || 'segredo_temporario', 
      { expiresIn: '24h' }
    );

    res.json({ 
      mensagem: 'Login realizado com sucesso!', 
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor. Tente novamente.' });
  }
};

// Agendamento
exports.agendar = async (req, res) => {
  try {
    const { clienteId, barbeiroId, horario, servico } = req.body;

    // Validações
    if (!clienteId || !barbeiroId || !horario) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios para o agendamento.' });
    }

    // Verificar se o horário é futuro
    const dataAgendamento = new Date(horario);
    if (dataAgendamento <= new Date()) {
      return res.status(400).json({ erro: 'O horário deve ser no futuro.' });
    }

    // Verificar disponibilidade
    const disponibilidade = await verificarDisponibilidade(barbeiroId, horario);
    if (!disponibilidade) {
      return res.status(400).json({ erro: 'Este horário não está disponível.' });
    }

    // Criar agendamento
    const novoAgendamento = new Agendamento({ 
      clienteId, 
      barbeiroId, 
      horario, 
      servico: servico || 'Corte de cabelo',
      status: 'agendado'
    });
    await novoAgendamento.save();

    // Enviar notificação
    await enviarNotificacao(clienteId, 'Agendamento confirmado com sucesso!');

    res.status(201).json({ 
      mensagem: 'Agendamento realizado com sucesso!',
      agendamento: {
        id: novoAgendamento._id,
        horario: novoAgendamento.horario,
        servico: novoAgendamento.servico,
        status: novoAgendamento.status
      }
    });
  } catch (erro) {
    console.error('Erro no agendamento:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor. Tente novamente.' });
  }
};

// Função para verificar disponibilidade
async function verificarDisponibilidade(barbeiroId, horario) {
  try {
    // Verificar se já existe agendamento no mesmo horário
    const agendamentoExistente = await Agendamento.findOne({
      barbeiroId,
      horario,
      status: { $in: ['agendado', 'confirmado'] }
    });
    
    return !agendamentoExistente;
  } catch (erro) {
    console.error('Erro ao verificar disponibilidade:', erro);
    return false;
  }
}

// Função para enviar notificação
async function enviarNotificacao(clienteId, mensagem) {
  try {
    // Implementar lógica de envio de notificação
    // Por enquanto, apenas log
    console.log(`Notificação para cliente ${clienteId}: ${mensagem}`);
    return true;
  } catch (erro) {
    console.error('Erro ao enviar notificação:', erro);
    return false;
  }
}
