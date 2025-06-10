import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin, onIrCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const fazerLogin = async () => {
    if (!email || !senha) {
      setMensagem('Por favor, preencha todos os campos.');
      setTipoMensagem('erro');
      return;
    }

    setCarregando(true);
    setMensagem('');

    try {
      const resposta = await fetch('http://localhost:5000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem('Login realizado com sucesso!');
        setTipoMensagem('sucesso');
        
        // Salvar token no localStorage
        localStorage.setItem('token', dados.token);
        
        // Chamar função de login do componente pai
        setTimeout(() => {
          onLogin(dados.usuario);
        }, 1000);
      } else {
        setMensagem(dados.erro || 'Erro ao fazer login');
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
      fazerLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">CorteFácil</h1>
          <p className="login-subtitle">Faça seu login para continuar</p>
        </div>
        
        <div className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              placeholder="Digite sua senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
              disabled={carregando}
            />
          </div>
          
          <button 
            onClick={fazerLogin} 
            className={`btn btn-primary login-button ${carregando ? 'loading' : ''}`}
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
          
          {mensagem && (
            <div className={`mensagem mensagem-${tipoMensagem}`}>
              {mensagem}
            </div>
          )}
        </div>
        
        <div className="login-footer">
          <div className="login-links">
            <button 
              type="button" 
              className="link-secundario"
              onClick={onIrCadastro}
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
