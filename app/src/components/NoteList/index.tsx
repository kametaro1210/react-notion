import { useNoteStore } from '../../modules/notes/notes.state';
import NoteItem from './NoteItem';


export default function NoteList() {

  // ノート一覧を取得したり、更新したりする機能を使えるようにする。
  const noteStore = useNoteStore();

  // 保存済みノート一覧の取得
  const notes = noteStore.getAll();

  return (
    <>
      {notes.map((note) => (
        <NoteItem key = {note.id} note = {note}/>
      ))}
    </>
  );
}
