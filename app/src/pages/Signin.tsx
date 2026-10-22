import { useState } from 'react';
import { authRepository } from '../modules/auth/auth.repository';
import '../styles/pages/auth.css';

export default function Signin() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  /* 
    todo : 概要や処理フローを後ほど記載
  */

  const signin = async () => {

      const { user, token } = await authRepository.signin(email, password);
      console.log(user, token)

  };

  return (
    <div className='auth-container'>
      <div className='auth-wrapper'>
        <h2 className='auth-title'>Notion</h2>
        <div className='auth-form-container'>
          <div className='auth-card'>
            <div className='auth-form'>
              <div>
                <label className='auth-label' htmlFor='email'>
                  メールアドレス
                </label>
                <div className='auth-input-container'>
                  <input
                    value={email}

                    // 入力された値が変更されることに実行される関数
                    onChange={(e) => setEmail(e.target.value)}
                    id='email'
                    name='email'
                    placeholder='メールアドレス'
                    required
                    type='email'
                    className='input-auth'
                  />
                </div>
              </div>
              <div>
                <label className='auth-label' htmlFor='password'>
                  パスワード
                </label>
                <div className='auth-input-container'>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id='password'
                    name='password'
                    placeholder='パスワード'
                    required
                    type='password'
                    className='input-auth'
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={signin}
                  disabled={ !email || !password }
                  className="home-button"
                  style={{ width: '100%' }}
                >
                  ログイン
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
