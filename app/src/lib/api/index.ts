import axios from 'axios';
import { addAuthorizationHeader } from './interceptors/request';

/*
  API通信の共通設定

  【概要】
  APIへリクエストを送るための共通設定を行い、
  アプリ内の各処理から同じ設定を使えるようにする。

  【コードの意味】
  baseURLは、APIのリクエスト先となる基本のURL。
  import.meta.env.VITE_API_URLは、環境設定からAPIのURLを読み込む。
  axios.createは、共通設定を持ったAPI通信のための道具を作る。
  Content-Typeは、送信するデータがJSON形式であることをAPIに伝える項目。
  request interceptorは、リクエストを送る前に共通の処理を行う仕組み。

  【処理フロー】
  1. 環境設定からAPIの基本URLを読み込む。
  2. 基本URLを設定したaxiosを作成する。
  3. APIに送るデータがJSON形式であることを設定する。
  4. リクエストを送る前にaddAuthorizationHeaderを実行するよう設定し、
      保存済みのログイン情報があればリクエストに追加する。
  5. 設定したapiを他のファイルから使えるようにする。
*/

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL });
api.defaults.headers.common['Content-Type'] = 'application/json';
api.interceptors.request.use(addAuthorizationHeader);

export default api;