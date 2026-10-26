import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // 子ノートを開いている場合、{1 : true},
  // 閉じている場合は、{2 : false} のようなデータを取得する
  const [expanded, setExpanded] = useState<Map<number, boolean>>(new Map());

  // useNavigateが返す画面移動用の関数を保存し、
  // 選んだノートの画面へ移動できるようにする。
  const navigate = useNavigate();

  // -------------------------------------------------------------------

  /*
    子ノートの作成処理

    【目的】
    指定した親ノートの下に子ノートを作成し、その詳細画面を開く。

    【処理フロー】
    1. eはクリック操作の情報、parentIdは親ノートのID。
    2. parentIdをAPIに渡して子ノートを作成する。
    3. 作成したノートを一覧に追加し、setExpandedで親ノートの表示状態を更新する。
        setExpandedに渡す関数は、引数prevで現在の表示状態を受け取る。
        その内容をコピーしたnewExpandedでparentIdの状態をtrueにし、
        returnで返したnewExpandedが新しい表示状態として使われる。
    4. 作成したノートの詳細画面へ移動する。
  */

  const createChild = async (e: React.MouseEvent, parentId: number) => {
    e.preventDefault();
    const newNote = await noteRepository.create({ parentId });
    // console.log(newNote)
    noteStore.set([newNote]);
    setExpanded((prev) => {
      const newExpanded = new Map(prev);
      newExpanded.set(parentId, true);
      return newExpanded;
    });
    moveToDetail(newNote.id);
  };

  // -------------------------------------------------------------------

  /*
    子ノートの取得・表示切り替え処理

    【目的】
    ノート名の左のアイコンを押したとき、そのノートの子ノートを取得して表示する。

    【処理フロー】
    1. eはアイコンを押したときのマウス操作情報、noteは対象のノート情報。
    2. e.preventDefault()で、クリック時にブラウザーが自動で行う動作を止める。
    3. note.idを親ノートのIDとしてAPIに渡し、子ノートを取得する。
    4. noteStore.set(children)で、取得した子ノートをアプリ内の一覧に追加する。
        setは既存のノートを残し、同じIDのノートは重複しないように更新する。
    5. setExpandedで表示状態を更新する。new Map(prev)は現在の状態をコピーし、
        コピーした一覧のnote.idに、現在と反対の値（開く/閉じる）を設定して返す。
        これにより、対象ノートの子ノートの表示・非表示が切り替わる。
  */

  const fetchChildren = async (e: React.MouseEvent, note: Note) => {
    e.preventDefault();
    const children = await noteRepository.find({ parentId: note.id });
    if (children == null) return;
    // console.log(children)
    noteStore.set(children);
    setExpanded((prev) => {
      const newExpanded = new Map(prev);
      newExpanded.set(note.id, !prev.get(note.id));
      return newExpanded;
    });
  };

  // -------------------------------------------------------------------

  /*
    ノート詳細画面への移動処理

    【目的】
    指定したノートの詳細画面を表示する。

    【処理フロー】
    1. noteIdで表示するノートを指定する。
    2. navigateにノートIDを含むURLを渡して、詳細画面へ移動する。
  */

  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
  };

  // -------------------------------------------------------------------

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
              expanded={expanded.get(note.id)}
              onClick={() => moveToDetail(note.id)}
            />

            {/* このノートのexpandedがtrueなら、子ノートの一覧を表示する。 */}
            {expanded.get(note.id) && (
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
            )}

          </div>
        ))}
    </>
  );
}
