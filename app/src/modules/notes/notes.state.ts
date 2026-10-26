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
    todo : 処理フローや概要は後ほど記載
  */

  const set = (newNotes: Note[]) => {
    setNotes((oldNotes) => {
      const combineNotes = [...oldNotes, ...newNotes];
      const uniqueNotes: { [key: number]: Note } = {};

      for (const note of combineNotes) {
        uniqueNotes[note.id] = note;
      }

      return Object.values(uniqueNotes);
    });
  };

// ----------------------------------------------------------------------

  return { getAll, getOne, set };

  };