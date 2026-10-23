
/*
  ノート情報を扱うエンティティ

  【目的】
  APIから受け取ったノート情報をひとまとめにし、アプリ内で共通して扱う。

  【コードの意味】
  idやuserIdなどのプロパティでノートの情報を表す。
  「?」が付いた項目は省略でき、title・content・parentIdはnullの場合もある。
  「!」が付いた項目は、constructorで値を設定する前提であることを示す。

  【処理フロー】
  1. Object.assignで、受け取ったAPIの応答データ(data)をNoteの各プロパティにコピーする。
      これにより、呼び出し元がNoteとしてノート情報を扱えるようにする。
  2. createdAtをDate型に変換し、アプリ内で日付として扱えるようにする。
*/

export class Note {
  id!: number;
  userId!: string;
  title?: string | null;
  content?: string | null;
  parentId?: number | null;
  createdAt!: Date;

  constructor(data: Note) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt);
  }
}