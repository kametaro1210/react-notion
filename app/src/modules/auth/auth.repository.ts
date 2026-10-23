import api from '../../lib/api';
import { User } from '../users/user.entity';


export const authRepository = {

    /*
    新規アカウント登録処理

    【目的】
    受け取ったユーザーの登録情報をサーバーに送信し、
    サーバーから受け取ったユーザー情報と認証トークンを呼び出し元に返す役割を持つ。

    【処理フロー】
    1. async関数は処理結果をPromiseとして返し、awaitでサーバーの応答を待つ。
    2. name・email・passwordをAPIに送信し、登録結果をresult.dataで受け取る。
    3. result.dataからuserとtokenを分割代入で取り出す。
    4. userをUserクラスのインスタンスにし、userとtokenをオブジェクトで返す。
    */

    async signup(
        name: string,
        email: string,
        password: string,
    ): Promise<{ user: User; token: string }> {
        const result = await api.post('/auth/signup', {
            name,
            email,
            password,
        });
        const { user, token } = result.data;
        return { user: new User(user), token };
    },

// --------------------------------------------------------------------------

    /*
    サインイン(ログイン)処理

    【目的】
    受け取ったメールアドレスとパスワードをサーバーに送信し、
    サーバーから受け取ったユーザー情報と認証トークンを呼び出し元に返す役割を持つ。

    【処理フロー】
    1. async関数は処理結果をPromiseとして返し、awaitでサーバーの応答を待つ。
    2. email・passwordをAPIに送信し、サインイン結果をresult.dataで受け取る。
    3. result.dataからuserとtokenを分割代入で取り出す。
    4. userをUserクラスのインスタンスにし、userとtokenをオブジェクトで返す。
    */

    async signin(
        email: string,
        password: string,
    ): Promise<{ user: User; token: string }> {
        const result = await api.post('/auth/signin', { email, password });
        const { user, token } = result.data;
        return { user: new User(user), token };
    },

// --------------------------------------------------------------------------

    /*
    ログイン中のユーザー情報を取得する処理

    【目的】
    サーバーに現在のログイン状態を確認し、
    ログイン中のユーザー情報を呼び出し元に返す役割を持つ。

    【処理フロー】
    1. /auth/meにリクエストを送り、サーバーからの応答を待つ。
    2. result.dataにユーザー情報がない場合は、ユーザーがいないことを示すundefinedを返す。
    3. ユーザー情報がある場合は、Userクラスのインスタンスにして呼び出し元に返す。
    */

    async getCurrentUser(): Promise<User | undefined> {
        const result = await api.get('/auth/me');
        if (!result.data) return undefined;

        return new User(result.data);
    },
    
    };