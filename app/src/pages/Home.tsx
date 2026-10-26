import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { noteRepository } from '../modules/notes/note.repository';
import { useNoteStore } from '../modules/notes/notes.state';
import '../styles/pages/home.css';

export default function Home() {

  // 入力されたタイトルを保持するステート（初期値は空文字）
  const [title, setTitle] = useState('');

  // APIの通信中（送信中）かどうかを表すフラグステート（true: 通信中 / false: 待機中）
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ノート一覧を取得したり、更新したりする機能を使えるようにする。
  const noteStore = useNoteStore();

  // useNavigateが返す画面移動用の関数を保存し、作成したノートの画面へ移動できるようにする。
  const navigate = useNavigate();

  // -------------------------------------------------------------------------------

  /*
    Home画面からのノート新規作成処理

    【目的】
    入力されたタイトルでノートを作成し、作成したノートの詳細画面へ移動する。

    【処理フロー】
    1. setIsSubmitting(true)で作成中の状態にする。
    2. noteRepository.create({ title })でAPIにノート作成を依頼し、結果を待つ。
    3. 作成したノートを一覧に保存し、タイトル入力欄を空にする。
    4. navigateで作成したノートの詳細画面へ移動する。
    5. 失敗時はエラーを表示し、最後にsetIsSubmitting(false)で作成中の状態を解除する。
  */

  const createNote = async () => {

    setIsSubmitting(true);

    try {
      const newNote = await noteRepository.create({ title });
      noteStore.set([newNote]);
      setTitle('');
      // console.log(newNote)
      navigate(`/notes/${newNote.id}`);
    } catch (error) {
      console.error(error);
      alert('ノートの作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }

  };

  // -------------------------------------------------------------------------------

  return (
    <Card className='home-card'>
      <CardHeader className='home-card-header'>
        <CardTitle className='home-card-title'>
          新しいノートを作成してみましょう
        </CardTitle>
      </CardHeader>
      <CardContent className='home-card-content'>
        <div className='home-input-container'>
          <input
            className='home-input'
            placeholder='ノートのタイトルを入力'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className="home-button"
            onClick={createNote}

            // APIが通信中の場合はボタンを押せない
            disabled={isSubmitting} 
          >
            <FiPlus size={16} />
            <span>ノート作成</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
