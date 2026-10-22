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
};