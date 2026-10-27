import api from '../../lib/api';
import { Note } from './note.entity';

export const noteRepository = {

  /*
    ノート一覧の取得処理

    【目的】
    条件に合うノート一覧をAPIから取得し、アプリで使える形にして返す。

    【処理フロー】
    1. 必要に応じて親ノートID(parentId)や検索キーワード(keyword)を指定する。
        options自体と各項目は省略できる。
    2. awaitで/notesへの取得結果を待ち、指定した条件をAPIに渡す。
    3. 取得したノートごとにNoteを作成し、一覧としてreturnする。
        Promise<Note[]>は、処理完了後にNoteの一覧を返すことを表す。
  */

  async find(options?: {
    parentId?: number;
    keyword?: string; 
  }): Promise<Note[]> {
    const result = await api.get('/notes', {
      params: {
        parentId: options?.parentId,
        keyword: options?.keyword, 
      },
    });
    return result.data.notes.map((data: Note) => new Note(data));
  },

// ------------------------------------------------------------------------------

  /*
    ノートの新規作成処理

    【目的】
    APIにノートの作成を依頼し、作成されたノートを返す。

    【処理フロー】
    1. titleとparentIdを受け取り、/notesへノート作成を依頼する。
        paramsは作成内容をまとめた引数で、titleとparentIdは省略できる（?が付いている）。
    2. awaitでAPIの応答を待ち、応答データをresultに受け取る。
        async関数はPromiseを返し、Promise<Note>は処理完了後にNoteを返すことを表す。
    3. 応答データからNoteを作成してreturnする。
        呼び出し元は、Promiseの処理完了後にこのNoteを受け取る。
  */

  async create(params: { title?: string; parentId?: number }): Promise<Note> {
    const result = await api.post('/notes', {
      title: params.title,
      parentId: params.parentId,
    });
    return new Note(result.data);
  },

// ------------------------------------------------------------------------------

  /*
    指定したノートの取得処理

    【目的】
    指定されたIDのノートをAPIから取得し、Noteとして返す。

    【処理フロー】
    1. idを使ってAPIにノートの取得を依頼し、awaitで応答を待つ。
    2. 応答データからNoteを作成して返す。
        Promise<Note>は、処理完了後にNoteを返すことを表す。
  */

  async findOne(id: number): Promise<Note> {
    const result = await api.get(`/notes/${id}`);
    return new Note(result.data);
  },

// ------------------------------------------------------------------------------

  /*
    ノート情報の更新処理

    【目的】
    指定したノートの内容をAPIで更新し、更新後のノートを返す。

    【処理フロー】
    1. idで更新するノートを指定する。noteは更新内容を受け取る引数名で、
        NoteDetail.tsxから渡されたtitleやcontentが入る。
    2. noteに入った更新内容をAPIへ送り、awaitで応答を待つ。
    3. 応答データからNoteを作成して返す。
  */

  async update(
    id: number,
    note: { title?: string; content?: string },
  ): Promise<Note> {
    const result = await api.patch(`/notes/${id}`, note);
    return new Note(result.data);
  },

};