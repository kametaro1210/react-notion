import { atom, useAtom } from 'jotai';
import type { Note } from './note.entity';

// アプリ内で共有するノート一覧を用意する。最初は空の一覧にする。
const notesAtom = atom<Note[]>([]);

export const useNoteStore = () => {

  // notesで現在の一覧を読み取り、setNotesで一覧を更新できるようにする。
  const [notes, setNotes] = useAtom(notesAtom);

// ----------------------------------------------------------------------

  /*
    保存済みノート一覧の取得処理

    【目的】
    アプリ内に保存されているノート一覧を呼び出し元で使えるようにする。

    【処理フロー】
    1. notesに入っているノート一覧を返す。
    2. 呼び出し元がこの一覧を使い、サイドバーにノートを表示する。
  */

  const getAll = () => notes;

// ----------------------------------------------------------------------

  /*
    IDによるノートの検索処理

    【目的】
    アプリ内のノート一覧から、指定したIDのノートを取得する。

    【処理フロー】
    1. 引数のidと一致するノートを一覧から探し、見つかったノートを返す。
  */

  const getOne = (id: number) => notes.find((note) => note.id === id);

// ----------------------------------------------------------------------

  /*
    ノート一覧の追加・更新処理

    【目的】
    新しいノートを一覧に追加し、同じIDのノートがあれば情報を更新する。

    【処理フロー】
    1. oldNotes（現在の一覧）とnewNotes（追加・更新する一覧）を結合する。
    2. ノートIDをキーにしてまとめ、同じIDがある場合は後から処理するnewNotesの情報で置き換える。
    3. for文でcombineNotesからノートを1件ずつnoteとして受け取る。
        note.idをキーにnoteをuniqueNotesへ入れ、同じIDがあれば上書きする。
    4. Object.values(uniqueNotes)でuniqueNotes内のノートだけを配列にしてreturnする。
        setNotesは返された配列を、新しいノート一覧として保存する。
  */

  const set = (newNotes: Note[]) => {
    setNotes((oldNotes) => {

      // oldNotes（現在の一覧）とnewNotes（追加・更新するノート）をまとめて受け取る。
      const combineNotes = [...oldNotes, ...newNotes];
      
      // ノートIDをキー、ノート情報を値として保存する空の入れ物を用意する。
      const uniqueNotes: { [key: number]: Note } = {};

      for (const note of combineNotes) {
        uniqueNotes[note.id] = note;
      }

      return Object.values(uniqueNotes);
    });
  };

// ----------------------------------------------------------------------

  /*
    ノートと子ノートの削除処理

    【目的】
    指定したノートと、その下にあるすべての子ノートを一覧から削除する。

    【処理フロー】
    1. findChildrenIdsに削除対象のidを渡し、そのノートに属する子ノートを探す。
    2. filterでparentIdが一致する子ノートを見つけ、mapでそのIDだけを取り出す。
    3. concatと再帰呼び出しで、子ノートの子（孫以降）のIDもすべて集める。
    4. setNotesで現在の一覧を調べ、削除対象のidと集めた子ノートIDに一致しないノートだけを残す。
    5. 残ったノート一覧をアプリ内に保存する。
  */

  const deleteNote = (id: number) => {
    const findChildrenIds = (parentId: number): number[] => {
      const childrenIds = notes
        .filter((note) => note.parentId == parentId)
        .map((child) => child.id);
      return childrenIds.concat(
        ...childrenIds.map((childId) => findChildrenIds(childId)),
      );
    };

    const childrenIds = findChildrenIds(id);
    
    setNotes((oldNotes) =>
      oldNotes.filter((note) => ![...childrenIds, id].includes(note.id)),
    );
  };

// ----------------------------------------------------------------------

  // アプリ内に保存されているノート一覧を空にする。
  const clear = () => setNotes([]);

  return { 
    getAll, 
    getOne, 
    set, 
    delete: deleteNote, 
    clear
  };

// ----------------------------------------------------------------------

  };