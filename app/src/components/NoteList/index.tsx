import { Note } from '../../modules/notes/note.entity';
import { noteRepository } from '../../modules/notes/note.repository';
import { useNoteStore } from '../../modules/notes/notes.state';
import NoteItem from './NoteItem';


interface Props {
  layer?: number;
  parentId?: number;
}

export default function NoteList({ layer = 0, parentId }: Props) {

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


  /*
    todo : 処理フローや概要は後ほど記載
  */

  const fetchChildren = async (e: React.MouseEvent, note: Note) => {
    e.preventDefault();
    const children = await noteRepository.find({ parentId: note.id });
    if (children == null) return;
    console.log(children)
    noteStore.set(children);
  };

  return (
    <>
      {/* note.parentIdとこの一覧のparentIdが一致するノートを表示する（最初の一覧では両方未設定の親ノートが対象） */}
      {notes.filter((note) => note.parentId == parentId)
        .map((note) => (
          <div key={note.id}>
          
            <NoteItem 

              /*
                note: 
                この行で表示するノートの情報。

                onCreate: 
                子ノート作成時に、操作情報と親ノートのIDを渡す関数。

                onExpand: 
                ノート名の左のアイコンを押したとき、
                操作情報とノート情報を渡して子ノートを取得する関数。
              */

              note = {note} 
              onCreate={(e) => createChild(e, note.id)}
              onExpand={(e) => fetchChildren(e, note)}
              layer={layer}
            />

            <NoteList 

              /*
                layer:
                ノートの階層の深さ。子の一覧にlayer + 1を渡すことで階層を一段下げ、
                深さに応じた表示位置にする。

                parentId:
                表示する子ノートの親ノートID。このノートのIDを渡して、
                このノートに属する子ノートを一覧に表示する。
              */

              layer={layer + 1} 
              parentId={note.id} 
            />

          </div>
        ))}
    </>
  );
}
