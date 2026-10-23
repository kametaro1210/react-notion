import type { InternalAxiosRequestConfig } from 'axios';

/*
  API通信にログイン情報を追加する処理

  【概要】
  APIに送るリクエストに、ログイン中であることを示す情報を追加する。
  ログイン情報が保存されていない場合は、何も追加せずにリクエストを返す。

  【コードの意味】
  AxiosがAPIへ送るリクエスト設定をaddAuthorizationHeader関数に渡し、
  関数はその設定をconfigという名前で受け取る。
  InternalAxiosRequestConfigは、その設定に含まれる項目や書き方を示す型。
  localStorageは、ブラウザーに情報を保存しておく場所。
  Authorizationは、ログイン情報をAPIに伝えるための項目。
  Bearerは、後ろに続くtokenをログイン確認に使う情報として送ることを示す文字列。

  【処理フロー】
  1. AxiosがAPIへ送る直前のリクエスト設定をこの関数に渡す。
      関数はその設定をconfigとして受け取り、InternalAxiosRequestConfig型であることを示す。
  2. localStorageからログイン時に保存したtokenを取り出す。
  3. tokenが見つからない場合は、Authorizationを追加せずにconfigを返す。
  4. tokenが見つかった場合は、Authorizationに設定する。
  5. ログイン情報を追加したconfigを返し、Axiosがその設定でAPIへ通信できるようにする。
*/

export const addAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (!token) return config;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};