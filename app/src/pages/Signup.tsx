import { useAtom } from 'jotai';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { authRepository } from '../modules/auth/auth.repository';
import { currentUserAtom } from '../modules/auth/current-user.state';
import '../styles/pages/auth.css';

export default function Signup() {

  // 入力された値（name/email/password）を保存する状態と、
  // それを更新する関数（setName/setEmail/setPassword）を定義
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // アプリ全体で共有するログイン中のユーザー情報と更新関数
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  // アカウント作成の通信中かどうかを記録する状態と、その状態を更新する関数
  const [isSubmitting, setIsSubmitting] = useState(false);

  // エラーメッセージを画面に表示するためのステート（未定義の場合はコンポーネント内に追加）
  const [errorMessage, setErrorMessage] = useState('');

  // --------------------------------------------------------------------------------------

  /*
    アカウント作成処理(サインアップ)

    【目的】
    入力されたユーザー名、メールアドレス、パスワードを使ってアカウントを作成し、
    成功した場合はログイン状態を保存する。

    【処理フロー】
    1. 前回のエラーメッセージを消し、setIsSubmitting(true)で通信中にする。
    2. authRepository.signupに入力内容を渡し、アカウント作成の結果を待つ。
    3. 成功したらユーザー情報とトークンを保存する。
    4. 失敗したら、エラー内容を画面に表示する。
    5. 最後にsetIsSubmitting(false)で通信中の状態を解除する。
  */

  const signup = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const { user, token } = await authRepository.signup(
        name,
        email,
        password,
      );
      // console.log(user, token)
      setCurrentUser(user);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error(error);

      // 型安全にエラーオブジェクトからバックエンドのメッセージを取得する
      const err = error as Record<string, unknown>;
      const response = err.response as { data?: { message?: string } } | undefined;
      
      // バックエンドからのメッセージがあればそれを表示、なければ一般的な登録失敗メッセージにする
      // （※ error.message によるステータスコードの文字列はあえて拾わないようにしています）
      const message = response?.data?.message || 'ユーザー登録に失敗しました';
      
      setErrorMessage(message);
      // alert('ユーザー登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------------------


  if (currentUser) return <Navigate to="/" replace />;

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <h2 className="auth-title">Notion(アカウント登録)</h2>
        <div className="auth-form-container">
          <div className="auth-card">
            <div className="auth-form">

              {/* エラーメッセージが存在する場合に画面に赤字で表示する */}
              {errorMessage && (
                <div style={{ color: 'red', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="auth-label" htmlFor="username">
                  ユーザー名
                </label>
                <div className="auth-input-container">
                  <input
                    value={name}

                    // 入力された値が変更されることに実行される関数
                    onChange={(e) => setName(e.target.value)}
                    id="username"
                    name="username"
                    placeholder="ユーザー名"
                    required
                    type="text"
                    className="input-auth"
                  />
                </div>
              </div>

              <div>
                <label className="auth-label" htmlFor="email">
                  メールアドレス
                </label>
                <div className="auth-input-container">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    placeholder="メールアドレス"
                    required
                    type="email"
                    className="input-auth"
                  />
                </div>
              </div>

              <div>
                <label className="auth-label" htmlFor="password">
                  パスワード
                </label>
                <div className="auth-input-container">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    placeholder="パスワード"
                    required
                    type="password"
                    className="input-auth"
                  />
                </div>
              </div>

              <div>
                <button
                  // 必須項目が未入力、またはアカウント作成中の場合は登録ボタンを無効にする
                  disabled={ !name || !email || !password || isSubmitting}
                  onClick={signup}
                  className="home-button"
                  style={{ width: '100%' }}
                >
                  登録
                </button>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>アカウントをお持ちの方は </span>
            <Link to="/signin" style={{ color: '#2eaadc', textDecoration: 'none', fontSize: '14px' }}>
              こちら
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
