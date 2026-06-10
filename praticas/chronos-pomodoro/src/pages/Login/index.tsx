import React, { useState, useContext, type FormEvent } from 'react';
import { AuthContext } from '../../contexts/AuthContext/AuthContext';
import styles from './styles.module.css';

type ViewMode = 'login' | 'register' | 'reset';

export default function Login() {
  const { login, register, forgotPassword, resetPassword } = useContext(AuthContext);

  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [feedback, setFeedback] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null);

  const [loginEmail, setLoginEmail] = useState(localStorage.getItem('savedEmail') || '');
  const [loginPassword, setLoginPassword] = useState(localStorage.getItem('savedPassword') || '');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [tokenRequested, setTokenRequested] = useState(false);
  const [isRequestingToken, setIsRequestingToken] = useState(false);

  function clearFeedback() { setFeedback(null); }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    clearFeedback();

    if (!loginEmail.trim() || !loginPassword) {
      setFeedback({ text: 'Preencha e-mail e senha.', type: 'error' });
      return;
    }

    setIsLoading(true);

    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    const isSaved =
      savedEmail === loginEmail.trim().toLowerCase() &&
      savedPassword === loginPassword;

    if (!isSaved) {
      setPendingCredentials({ email: loginEmail.trim().toLowerCase(), password: loginPassword });
    }

    const result = await login(loginEmail.trim().toLowerCase(), loginPassword);
    setIsLoading(false);

    if (!result.ok) {
      setFeedback({ text: result.message ?? 'Erro ao fazer login.', type: 'error' });
      setPendingCredentials(null);
      return;
    }

    if (!isSaved) {
      setShowSaveModal(true);
    }
  }

  function handleSaveYes() {
    if (pendingCredentials) {
      localStorage.setItem('savedEmail', pendingCredentials.email);
      localStorage.setItem('savedPassword', pendingCredentials.password);
    }
    setShowSaveModal(false);
    setPendingCredentials(null);
  }

  function handleSaveNo() {
    setShowSaveModal(false);
    setPendingCredentials(null);
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    clearFeedback();

    if (regName.trim().length < 2) {
      setFeedback({ text: 'Nome deve ter pelo menos 2 caracteres.', type: 'error' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setFeedback({ text: 'E-mail inválido.', type: 'error' });
      return;
    }
    if (regPassword.length < 6) {
      setFeedback({ text: 'Senha deve ter pelo menos 6 caracteres.', type: 'error' });
      return;
    }
    if (regPassword !== regConfirm) {
      setFeedback({ text: 'As senhas não coincidem.', type: 'error' });
      return;
    }

    setIsLoading(true);
    const result = await register(regName.trim(), regEmail.trim().toLowerCase(), regPassword);
    setIsLoading(false);

    if (!result.ok) {
      setFeedback({ text: result.message ?? 'Erro ao criar conta.', type: 'error' });
    } else {
      setFeedback({ text: 'Conta criada! Faça login.', type: 'success' });
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegConfirm('');
      setTimeout(() => { clearFeedback(); setViewMode('login'); }, 2000);
    }
  }

  async function handleRequestToken(e: FormEvent) {
    e.preventDefault();
    clearFeedback();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setFeedback({ text: 'Digite um e-mail válido.', type: 'error' });
      return;
    }

    setIsRequestingToken(true);
    const result = await forgotPassword(resetEmail.trim().toLowerCase());
    setIsRequestingToken(false);

    if (!result.ok) {
      setFeedback({ text: result.message ?? 'Erro ao gerar token.', type: 'error' });
      return;
    }

    if (result.devToken) setResetToken(result.devToken);
    setTokenRequested(true);
    setFeedback({ text: 'Token gerado! Cole abaixo e defina a nova senha.', type: 'success' });
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    clearFeedback();

    if (!resetToken.trim()) {
      setFeedback({ text: 'Informe o token.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ text: 'Nova senha deve ter pelo menos 6 caracteres.', type: 'error' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFeedback({ text: 'As senhas não coincidem.', type: 'error' });
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(resetToken.trim(), newPassword);
    setIsLoading(false);

    if (!result.ok) {
      setFeedback({ text: result.message ?? 'Erro ao redefinir senha.', type: 'error' });
    } else {
      setFeedback({ text: 'Senha redefinida! Faça login.', type: 'success' });
      setTimeout(() => {
        clearFeedback();
        setViewMode('login');
        setResetEmail(''); setResetToken(''); setNewPassword('');
        setConfirmNewPassword(''); setTokenRequested(false);
      }, 2000);
    }
  }

  // ─── MODAL SALVAR LOGIN ───────────────────────────────────────────────────
  if (showSaveModal) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Salvar login?</div>
          <p style={{ color: '#d0b3f7', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Deseja salvar suas credenciais neste dispositivo para facilitar o próximo acesso?
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className={styles.button} style={{ flex: 1 }} onClick={handleSaveYes}>
              Sim, salvar
            </button>
            <button
              className={styles.button}
              style={{ flex: 1, background: '#3c235a', color: '#f3d9fa' }}
              onClick={handleSaveNo}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── REGISTER ────────────────────────────────────────────────────────────
  if (viewMode === 'register') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Criar conta</div>
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor='regName'>Nome</label>
              <input id='regName' type='text' value={regName} onChange={e => setRegName(e.target.value)} placeholder='Seu nome' required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor='regEmail'>E-mail</label>
              <input id='regEmail' type='email' value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder='seu@email.com' required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor='regPassword'>Senha</label>
              <input id='regPassword' type='password' value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder='Mínimo 6 caracteres' required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor='regConfirm'>Confirmar senha</label>
              <input id='regConfirm' type='password' value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder='Repita a senha' required />
            </div>
            <button type='submit' className={styles.button} disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar conta'}
            </button>
          </form>
          {feedback && <div className={`${styles.feedback} ${styles[feedback.type]}`}>{feedback.text}</div>}
          <div className={styles.actions}>
            <button type='button' className={styles.linkButton} onClick={() => { clearFeedback(); setViewMode('login'); }}>
              Já tenho conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESET PASSWORD ──────────────────────────────────────────────────────
  if (viewMode === 'reset') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Redefinir senha</div>

          {!tokenRequested ? (
            <>
              <p className={styles.description}>Informe seu e-mail para gerar um token de redefinição.</p>
              <form onSubmit={handleRequestToken} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor='resetEmail'>E-mail</label>
                  <input id='resetEmail' type='email' value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder='seu@email.com' required />
                </div>
                <button type='submit' className={styles.button} disabled={isRequestingToken}>
                  {isRequestingToken ? 'Gerando token...' : 'Gerar token'}
                </button>
                <button
                  type='button'
                  className={styles.linkButton}
                  onClick={() => alert('Entre em contato com o suporte: suporte@iesb.edu.br')}
                >
                  Esqueci meu e-mail
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleResetPassword} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor='resetToken'>Token recebido</label>
                <input id='resetToken' type='text' value={resetToken} onChange={e => setResetToken(e.target.value)} placeholder='Cole o token aqui' required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor='newPassword'>Nova senha</label>
                <input id='newPassword' type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder='Mínimo 6 caracteres' required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor='confirmNewPassword'>Confirmar nova senha</label>
                <input id='confirmNewPassword' type='password' value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder='Repita a senha' required />
              </div>
              <button type='submit' className={styles.button} disabled={isLoading}>
                {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
              </button>
            </form>
          )}

          {feedback && <div className={`${styles.feedback} ${styles[feedback.type]}`}>{feedback.text}</div>}
          <div className={styles.actions}>
            <button type='button' className={styles.linkButton} onClick={() => { clearFeedback(); setViewMode('login'); setTokenRequested(false); }}>
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Pomodoro IESB</div>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor='email'>E-mail</label>
            <input id='email' type='email' value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder='seu@email.com' required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='password'>Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder='Sua senha'
                required
              />
              <button type='button' className={styles.togglePasswordBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Ocultar' : 'Revelar'}
              </button>
            </div>
          </div>
          <button type='submit' className={styles.button} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {feedback && <div className={`${styles.feedback} ${styles[feedback.type]}`}>{feedback.text}</div>}

        <div className={styles.actions}>
          <button type='button' className={styles.linkButton} onClick={() => { clearFeedback(); setViewMode('reset'); }}>
            Esqueci minha senha
          </button>
          <button type='button' className={styles.linkButton} onClick={() => { clearFeedback(); setViewMode('register'); }}>
            Criar uma conta
          </button>
        </div>
      </div>
    </div>
  );
}