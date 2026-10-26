import { noteRepository } from '../../modules/notes/note.repository';
import { useNoteStore } from '../../modules/notes/notes.state';
import NoteItem from './NoteItem';


export default function NoteList() {

  // ノート一覧を取得したり、更新したりする機能を使えるようにする。
  const noteStore = useNoteStore();

  // 保存済みノート一覧の取得
  const notes = noteStore.getAll();

    /*
      todo : 処理フローや概要は後ほど記載
    */

    const createChild = async (e: React.MouseEvent, parentId: number) => {
      e.preventDefault();
      const newNote = await noteRepository.create({ parentId });
      console.log(newNote)
      noteStore.set([newNote]);
    };


  return (
    <>
      {notes.map((note) => (
        <NoteItem 
          key = {note.id} 
          note = {note} 

          // 各ノートに、マウス操作の情報とそのノートのIDを渡して子ノートを作れるようにする。
          onCreate={(e) => createChild(e, note.id)}
        />
      ))}
    </>
  );
}
