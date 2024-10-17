import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from './axiosInstance'; // Adjust the import path according to your project structure
import styles from './Login.module.css';
import logo from '../../assets/logoblue.png';
import openeye from '../../assets/openeye.png';
import closeeye from '../../assets/closeeye.png';
import bg1 from '../../assets/bg1.jpg'
 
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const emailPattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        navigate('/');
      }
    } catch (error) {
      setError('Identifiants incorrects. Veuillez réessayer.');
      console.error('Login failed', error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftcontainer}>
        <img src={logo} className={styles.logo} alt="Logo" />
      </div>
      <div className={styles.rightcontainer}>
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input_field}
              pattern={emailPattern}
              title="Entrez un email valide au format exemple@exemple.exemple"
              required
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor="password" className={styles.label}>Mot de passe:</label>
            <div className={styles.password_container}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.password_input}
                required
              />
              <button type="button" onClick={toggleShowPassword} className={styles.show_password_button}>
                {showPassword ? <img src={closeeye} alt="Cacher" className={styles.eye_icon} /> : <img src={openeye} alt="Voir" className={styles.eye_icon} />}
              </button>
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.form_group}>
            <input type="submit" value="Se connecter" className={styles.submit_button} />
          </div>
          <div className={styles.signup_link}>
            <p>Vous n'avez pas de compte ? <Link to="/s'inscrire" className={styles.ins}>Inscrivez-vous ici</Link></p>           
          </div>
        </form>       
      </div>     
    </div>
  );
}

export default Login;
