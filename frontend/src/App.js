import React, { useState } from 'react';
import Login from './Login';
import Cadastro from './Cadastro';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [telaAtual, setTelaAtual] = useState('login'); // 'login' ou 'cadastro'

  const handleLogin = (dadosUsuario) => {
    setUsuarioLogado(true);
    setDadosUsuario(dadosUsuario);
  };

  const handleLogout = () => {
    setUsuarioLogado(false);
    setDadosUsuario(null);
    setTelaAtual('login');
  };

  const irParaCadastro = () => {
    setTelaAtual('cadastro');
  };

  const irParaLogin = () => {
    setTelaAtual('login');
  };

  const renderizarTela = () => {
    if (usuarioLogado) {
      return <Dashboard usuario={dadosUsuario} onLogout={handleLogout} />;
    }
    
    if (telaAtual === 'cadastro') {
      return <Cadastro onVoltarLogin={irParaLogin} />;
    }
    
    return <Login onLogin={handleLogin} onIrCadastro={irParaCadastro} />;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CorteFácil</h1>
        <p>Sistema de Agendamento de Barbearia</p>
      </header>
      
      <main className="App-main">
        {renderizarTela()}
      </main>
      
      <footer className="App-footer">
        <p>&copy; 2024 CorteFácil. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
