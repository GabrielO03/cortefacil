import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ usuario: usuarioProp, onLogout }) {
  const [usuario, setUsuario] = useState(usuarioProp);
  const [agendamentos, setAgendamentos] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    data: '',
    horario: '',
    servico: 'Corte de cabelo',
    observacoes: ''
  });
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [carregandoAgendamento, setCarregandoAgendamento] = useState(false);
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
    
    // Se mudou a data, buscar horários disponíveis
    if (name === 'data' && value) {
      buscarHorariosDisponiveis(value);
    }
  };

  const buscarHorariosDisponiveis = async (data) => {
    try {
      setCarregandoHorarios(true);
      const response = await fetch(`http://localhost:5000/api/usuarios/horarios-disponiveis?data=${data}`);
      const resultado = await response.json();
      
      if (response.ok) {
        setHorariosDisponiveis(resultado.horariosDisponiveis);
      } else {
        setMensagem(resultado.erro || 'Erro ao buscar horários disponíveis');
        setTipoMensagem('erro');
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor');
      setTipoMensagem('erro');
    } finally {
      setCarregandoHorarios(false);
    }
  };

  const carregarAgendamentos = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/agendamentos/${usuarioProp.id}`);
      const resultado = await response.json();
      
      if (response.ok) {
        setAgendamentos(resultado.agendamentos);
      } else {
        setMensagem(resultado.erro || 'Erro ao carregar agendamentos');
        setTipoMensagem('erro');
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor');
      setTipoMensagem('erro');
    }
  };

  const criarAgendamento = async () => {
    if (!novoAgendamento.data || !novoAgendamento.horario || !novoAgendamento.servico) {
      setMensagem('Por favor, preencha todos os campos obrigatórios.');
      setTipoMensagem('erro');
      return;
    }

    try {
      setCarregandoAgendamento(true);
      const response = await fetch('http://localhost:5000/api/usuarios/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteId: usuarioProp.id,
          data: novoAgendamento.data,
          horario: novoAgendamento.horario,
          servico: novoAgendamento.servico,
          observacoes: novoAgendamento.observacoes
        })
      });

      const resultado = await response.json();

      if (response.ok) {
        setMensagem(resultado.mensagem);
        setTipoMensagem('sucesso');
        setNovoAgendamento({
          data: '',
          horario: '',
          servico: 'Corte de cabelo',
          observacoes: ''
        });
        setHorariosDisponiveis([]);
        // Recarregar agendamentos
        carregarAgendamentos();
      } else {
        setMensagem(resultado.erro || 'Erro ao criar agendamento');
        setTipoMensagem('erro');
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor');
      setTipoMensagem('erro');
    } finally {
      setCarregandoAgendamento(false);
    }
  };

  const cancelarAgendamento = async (agendamentoId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/agendamentos/${agendamentoId}/cancelar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteId: usuarioProp.id
        })
      });

      const resultado = await response.json();

      if (response.ok) {
        setMensagem(resultado.mensagem);
        setTipoMensagem('sucesso');
        // Recarregar agendamentos
        carregarAgendamentos();
      } else {
        setMensagem(resultado.erro || 'Erro ao cancelar agendamento');
        setTipoMensagem('erro');
      }
    } catch (erro) {
      setMensagem('Erro ao conectar com o servidor');
      setTipoMensagem('erro');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  // Carregar agendamentos ao montar o componente
  React.useEffect(() => {
    if (usuarioProp && usuarioProp.id) {
      carregarAgendamentos();
    }
  }, [usuarioProp]);

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
                  disabled={!novoAgendamento.data || carregandoHorarios}
                >
                  <option value="">
                    {carregandoHorarios ? 'Carregando horários...' : 'Selecione um horário'}
                  </option>
                  {horariosDisponiveis.map(horario => (
                    <option key={horario} value={horario}>{horario}</option>
                  ))}
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
                  <option value="Corte de cabelo">Corte de cabelo - R$ 25,00</option>
                  <option value="Barba">Barba - R$ 15,00</option>
                  <option value="Corte + Barba">Corte + Barba - R$ 35,00</option>
                  <option value="Sobrancelha">Sobrancelha - R$ 10,00</option>
                  <option value="Bigode">Bigode - R$ 8,00</option>
                  <option value="Lavagem">Lavagem - R$ 12,00</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="observacoes" className="input-label">Observações (opcional)</label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={novoAgendamento.observacoes}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Alguma observação especial?"
                  rows="3"
                />
              </div>
            </div>
            
            <button 
              onClick={criarAgendamento}
              className="btn btn-primary"
              disabled={carregandoAgendamento}
            >
              {carregandoAgendamento ? 'Agendando...' : 'Agendar'}
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
                  <div className="agendamento-item" key={agendamento.id}>
                    <div className="agendamento-info">
                      <p><strong>Data:</strong> {new Date(agendamento.data).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Horário:</strong> {agendamento.horario}</p>
                      <p><strong>Serviço:</strong> {agendamento.servico}</p>
                      {agendamento.barbeiroNome && (
                        <p><strong>Barbeiro:</strong> {agendamento.barbeiroNome}</p>
                      )}
                      {agendamento.observacoes && (
                        <p><strong>Observações:</strong> {agendamento.observacoes}</p>
                      )}
                      <p><strong>Status:</strong> 
                        <span className={`status status-${agendamento.status}`}>
                          {agendamento.status === 'agendado' ? 'Agendado' : 
                           agendamento.status === 'confirmado' ? 'Confirmado' : 
                           agendamento.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                        </span>
                      </p>
                    </div>
                    {agendamento.status === 'agendado' && (
                      <button 
                        onClick={() => cancelarAgendamento(agendamento.id)}
                        className="btn btn-secondary btn-small"
                      >
                        Cancelar
                      </button>
                    )}
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