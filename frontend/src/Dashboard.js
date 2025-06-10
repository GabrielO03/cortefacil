import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ usuario: usuarioProp, onLogout }) {
  const [usuario, setUsuario] = useState(usuarioProp);
  const [agendamentos, setAgendamentos] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    data: '',
    horario: '',
    servico: 'Corte de cabelo'
  });
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  useEffect(() => {
    // Usar dados do usuário passados como prop ou simular
    if (usuarioProp) {
      setUsuario(usuarioProp);
    } else {
      const dadosUsuario = {
        nome: 'João Silva',
        email: 'joao@email.com',
        tipo: 'cliente'
      };
      setUsuario(dadosUsuario);
    }

    // Simular agendamentos existentes
    const agendamentosSimulados = [
      {
        id: 1,
        data: '2024-01-15',
        horario: '14:00',
        servico: 'Corte de cabelo',
        barbeiro: 'Carlos Santos',
        status: 'confirmado'
      },
      {
        id: 2,
        data: '2024-01-20',
        horario: '16:30',
        servico: 'Corte + Barba',
        barbeiro: 'Pedro Lima',
        status: 'agendado'
      }
    ];
    setAgendamentos(agendamentosSimulados);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoAgendamento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const criarAgendamento = () => {
    if (!novoAgendamento.data || !novoAgendamento.horario) {
      setMensagem('Por favor, preencha todos os campos.');
      setTipoMensagem('erro');
      return;
    }

    const novoId = agendamentos.length + 1;
    const agendamento = {
      id: novoId,
      ...novoAgendamento,
      barbeiro: 'Carlos Santos',
      status: 'agendado'
    };

    setAgendamentos(prev => [...prev, agendamento]);
    setNovoAgendamento({ data: '', horario: '', servico: 'Corte de cabelo' });
    setMensagem('Agendamento criado com sucesso!');
    setTipoMensagem('sucesso');
  };

  const cancelarAgendamento = (id) => {
    setAgendamentos(prev => prev.filter(ag => ag.id !== id));
    setMensagem('Agendamento cancelado.');
    setTipoMensagem('sucesso');
  };

  const logout = () => {
    // Remover token do localStorage
    localStorage.removeItem('token');
    
    // Chamar função de logout do componente pai
    if (onLogout) {
      onLogout();
    } else {
      setUsuario(null);
      window.location.reload();
    }
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">CorteFácil</h1>
          <div className="user-info">
            <span>Olá, {usuario.nome}!</span>
            <button onClick={logout} className="btn btn-secondary logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Seção de Novo Agendamento */}
          <section className="card novo-agendamento">
            <h2 className="section-title">Novo Agendamento</h2>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="data" className="input-label">Data</label>
                <input
                  id="data"
                  type="date"
                  name="data"
                  value={novoAgendamento.data}
                  onChange={handleInputChange}
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="horario" className="input-label">Horário</label>
                <select
                  id="horario"
                  name="horario"
                  value={novoAgendamento.horario}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Selecione um horário</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="servico" className="input-label">Serviço</label>
                <select
                  id="servico"
                  name="servico"
                  value={novoAgendamento.servico}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="Corte de cabelo">Corte de cabelo</option>
                  <option value="Corte + Barba">Corte + Barba</option>
                  <option value="Apenas Barba">Apenas Barba</option>
                  <option value="Corte Infantil">Corte Infantil</option>
                </select>
              </div>
            </div>
            
            <button onClick={criarAgendamento} className="btn btn-primary">
              Agendar
            </button>
            
            {mensagem && (
              <div className={`mensagem mensagem-${tipoMensagem}`}>
                {mensagem}
              </div>
            )}
          </section>

          {/* Seção de Agendamentos */}
          <section className="card agendamentos-lista">
            <h2 className="section-title">Meus Agendamentos</h2>
            {agendamentos.length === 0 ? (
              <p className="empty-state">Você não possui agendamentos.</p>
            ) : (
              <div className="agendamentos-grid">
                {agendamentos.map(agendamento => (
                  <div key={agendamento.id} className="agendamento-card">
                    <div className="agendamento-header">
                      <h3 className="agendamento-servico">{agendamento.servico}</h3>
                      <span className={`status status-${agendamento.status}`}>
                        {agendamento.status === 'confirmado' ? 'Confirmado' : 'Agendado'}
                      </span>
                    </div>
                    <div className="agendamento-details">
                      <p><strong>Data:</strong> {new Date(agendamento.data).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Horário:</strong> {agendamento.horario}</p>
                      <p><strong>Barbeiro:</strong> {agendamento.barbeiro}</p>
                    </div>
                    <button 
                      onClick={() => cancelarAgendamento(agendamento.id)}
                      className="btn btn-secondary btn-small"
                    >
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2024 CorteFácil. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Dashboard;