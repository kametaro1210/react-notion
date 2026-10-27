import { ja } from '@blocknote/core/locales';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';

interface Props {
  onChange: (value: string) => void;
  initialContent?: string | null;
}

export function Editor({ onChange, initialContent }: Props) {

  /*
    エディターの作成処理

    【目的】
    日本語表示のエディターを作成し、初期内容があれば表示する。

    【処理フロー】
    1. useCreateBlockNoteでエディターを作成する。
    2. dictionaryに日本語の設定(ja)を渡し、エディターの表示を日本語にする。
    3. initialContentに内容があればJSON.parseで文字列からデータに戻し、初期内容として渡す。
        内容がなければundefinedを渡し、空の状態でエディターを作成する。
  */
  const editor = useCreateBlockNote({
    dictionary: ja,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  return (
    <div>

      {/*
        エディターの表示と変更通知

        【目的】
        作成したエディターを画面に表示し、内容が変更されたことを呼び出し元に伝える。

        【処理フロー】
        1. editorに作成済みのエディターを渡し、BlockNoteViewに表示する。
        2. 内容が変更されるとonChangeが呼び出される。
        3. editor.documentをJSON.stringifyで文字列にし、受け取ったonChangeに渡す。
      */}
      
      <BlockNoteView
        editor={editor}
        onChange={() => onChange(JSON.stringify(editor.document))}
      />
    </div>
  );
}