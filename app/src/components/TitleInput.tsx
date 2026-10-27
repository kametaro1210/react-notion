import { useState } from "react";
import { Note } from "../modules/notes/note.entity";

interface Props {
  initialData: Note;
  onTitleChange: (value: string) => void;
}

export default function TitleInput({ initialData, onTitleChange }: Props) {

  const [value, setValue] = useState(initialData.title ?? '無題');


  // -------------------------------------------------------------------

  /*
    タイトル入力時の処理

    【目的】
    入力されたタイトルを画面に反映し、親画面(NoteDetail.tsx)へ知らせる。

    【処理フロー】
    1. 入力された文字列をvalueに保存して、入力欄に表示する。
    2. onTitleChangeを通じて、入力された文字列を親画面のNoteDetailへ渡す。
  */

  const handleInputChange = (value: string) => {
    setValue(value);
    onTitleChange(value);
  };

  // -------------------------------------------------------------------

  return (
    <div className='title-input-container'>
      <textarea 
        className='title-input'
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </div>
  );
}
