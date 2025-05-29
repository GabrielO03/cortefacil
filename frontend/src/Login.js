import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const fazerLogin = async () => {
    try {
      const resposta = await fetch('http://localhost:5000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem(`✅ ${dados.mensagem}`);
        console.log('Token:', dados.token);
      } else {
        setMensagem(`❌ ${dados.erro}`);
      }
    } catch (err) {
      setMensagem('❌ Erro na conexão com o servidor');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Login - CorteFácil</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
      />
      <button onClick={fazerLogin} style={{ padding: '10px', width: '100%' }}>
        Entrar
      </button>
      {mensagem && <p style={{ marginTop: '20px' }}>{mensagem}</p>}
    </div>
  );
}

export default Login;
