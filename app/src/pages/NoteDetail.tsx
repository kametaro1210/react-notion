import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '../components/Editor';
import TitleInput from '../components/TitleInput';
import { noteRepository } from '../modules/notes/note.repository';
import { useNoteStore } from '../modules/notes/notes.state';
import '../styles/pages/note-detail.css';

export default function NoteDetail() {

  // URLに含まれるパラメーター（この画面ではノートのid）を取得する。
  const params = useParams();

  // URLから取得した文字列のidを、ノート検索に使う数値へ変換する。
  const id = parseInt(params.id!);

  // APIの通信中（送信中）かどうかを表すフラグステート（true: 通信中 / false: 待機中）
  const [isLoading, setIsLoading] = useState(false);

  // ノート一覧を取得したり、更新したりする機能を使えるようにする。
  const noteStore = useNoteStore();

  // アプリ内のノート一覧から、idが一致するノートを取得する。
  const note = noteStore.getOne(id);

  // ------------------------------------------------------------------

  /*
    ノート詳細の読み込み処理

    【目的】
    URLのidに対応するノートをAPIから取得し、アプリ内に保存する。

    【処理フロー】
    1. useEffectでノート取得処理を実行する。第二引数の[id]により、
        初回表示時とidが変わったときに実行する。
    2. setIsLoading(true)で読み込み中にする。(API通信中)
    3. noteRepository.findOne(id)で、指定されたidのノートを取得する。
    4. 取得したノートをnoteStore.set()でアプリ内に保存する。
    5. setIsLoading(false)で読み込みを終了する。(API通信終了)
  */

  useEffect(() => {
    const fetchOne = async () => {
      setIsLoading(true);
      const note = await noteRepository.findOne(id);
      noteStore.set([note]);
      setIsLoading(false);
    };
    fetchOne();
  }, [id]);

  // ------------------------------------------------------------------

  /*
    ノート情報の更新処理

    【目的】
    指定したノートの内容を更新し、更新後の情報をアプリ内にも反映する。

    【処理フロー】
    1. URLから取得したidと、TitleInputで入力されたtitleを受け取る。
        onTitleChangeからupdateNote(id, { title })として呼び出される。
    2. 受け取ったidとtitleやcontentをnoteRepository.updateに渡し、ノートを更新する。
    3. APIから返された更新後のノートをnoteStore.set()でアプリ内に保存する。
    4. 更新後のノートをreturnし、呼び出し元で使えるようにする。
  */

  const updateNote = async (
    id: number,
    note: { title?: string; content?: string },
  ) => {
    const updatedNote = await noteRepository.update(id, note);
    noteStore.set([updatedNote]);
    return updatedNote;
  };

  // ------------------------------------------------------------------

  // ノートをAPIから読み込み中の間は、空の画面を表示する。
  if (isLoading) return <div />;

  // 読み込み後に該当するノートがない場合は、メッセージを表示する。
  if (!note) return <div>note is not existed</div>;

  return (
    <div className="note-detail-container">
      <div className="note-detail-content">
        <TitleInput 
          initialData={note} 
          onTitleChange={(title) => updateNote(id, { title })}
        />

        <Editor
          initialContent={note.content}
          onChange={(content) => updateNote(id, { content })}
        />
      </div>
    </div>
  );
}
