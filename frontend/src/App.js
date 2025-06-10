import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [dadosUsuario, setDadosUsuario] = useState(null);

  const handleLogin = (dados) => {
    setDadosUsuario(dados);
    setUsuarioLogado(true);
  };

  const handleLogout = () => {
    setDadosUsuario(null);
    setUsuarioLogado(false);
  };

  return (
    <div className="App">
      {usuarioLogado ? (
        <Dashboard 
          usuario={dadosUsuario} 
          onLogout={handleLogout} 
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
