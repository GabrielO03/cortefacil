import React, { useState } from 'react';
import './Cadastro.css';

function Cadastro({ onCadastro, onVoltarLogin }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'cliente'
  });
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setMensagem('Todos os campos são obrigatórios.');
      setTipoMensagem('erro');
      return false;
    }

    if (formData.nome.length < 2) {
      setMensagem('O nome deve ter pelo menos 2 caracteres.');
      setTipoMensagem('erro');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMensagem('Por favor, insira um e-mail válido.');
      setTipoMensagem('erro');
      return false;
    }

    if (formData.senha.length < 6) {
      setMensagem('A senha deve ter pelo menos 6 caracteres.');
      setTipoMensagem('erro');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      setTipoMensagem('erro');
      return false;
    }

    return true;
  };

  const fazerCadastro = async () => {
    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);
    setMensagem('');

    try {
      const resposta = await fetch('http://localhost:5000/api/usuarios/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          tipo: formData.tipo
        })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem('Cadastro realizado com sucesso! Redirecionando para o login...');
        setTipoMensagem('sucesso');
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          onVoltarLogin();
        }, 2000);
      } else {
        setMensagem(dados.erro || 'Erro ao realizar cadastro');
        setTipoMensagem('erro');
      }
    } catch (err) {
      setMensagem('Erro na conexão com o servidor. Tente novamente.');
      setTipoMensagem('erro');
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fazerCadastro();
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <div className="cadastro-header">
          <h1 className="cadastro-title">CorteFácil</h1>
          <p className="cadastro-subtitle">Crie sua conta para começar</p>
        </div>
        
        <div className="cadastro-form">
          <div className="input-group">
            <label htmlFor="nome" className="input-label">Nome Completo</label>
            <input
              id="nome"
              type="text"
              name="nome"
              placeholder="Digite seu nome completo"
              value={formData.nome}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="input"
              disabled={carregando}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="email" className="input-label">E-mail</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="input"
              disabled={carregando}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="senha" className="input-label">Senha</label>
            <input
              id="senha"
              type="password"
              name="senha"
              placeholder="Digite sua senha (mín. 6 caracteres)"
              value={formData.senha}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="input"
              disabled={carregando}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="confirmarSenha" className="input-label">Confirmar Senha</label>
            <input
              id="confirmarSenha"
              type="password"
              name="confirmarSenha"
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="input"
              disabled={carregando}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="tipo" className="input-label">Tipo de Usuário</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="input"
              disabled={carregando}
            >
              <option value="cliente">Cliente</option>
              <option value="barbeiro">Barbeiro</option>
            </select>
          </div>
          
          <button 
            onClick={fazerCadastro} 
            className={`btn btn-primary cadastro-button ${carregando ? 'loading' : ''}`}
            disabled={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Criar Conta'}
          </button>
          
          {mensagem && (
            <div className={`mensagem mensagem-${tipoMensagem}`}>
              {mensagem}
            </div>
          )}
        </div>
        
        <div className="cadastro-footer">
          <p>Já tem uma conta? 
            <button 
              onClick={onVoltarLogin} 
              className="link-button"
              disabled={carregando}
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;