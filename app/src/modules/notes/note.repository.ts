import api from '../../lib/api';
import { Note } from './note.entity';

export const noteRepository = {

  /*
    todo 概要や処理フローは後ほど記載
  */

  async find(): Promise<Note[]> {
    const result = await api.get('/notes')
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

};