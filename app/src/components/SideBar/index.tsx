import { FiPlus, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { noteRepository } from '../../modules/notes/note.repository';
import { useNoteStore } from '../../modules/notes/notes.state';
import NoteList from '../NoteList';
import Item from './Item';
import UserItem from './UserItem';

interface Props  {
  // 検索ボタンがクリックされたときに
  // 親コンポーネント(Layout.tsx)へ通知するコールバック関数
  onSearchButtonClick: () => void;
};

export default function SideBar({onSearchButtonClick} : Props) {
  
  // ノート一覧を取得したり、更新したりする機能を使えるようにする。
  const noteStore = useNoteStore();

  // useNavigateが返す画面移動用の関数を保存し、作成したノートの画面へ移動できるようにする。
  const navigate = useNavigate();

  /*
    サイドバーからのノート新規作成処理

    【目的】
    ノートを作成して一覧に保存し、作成したノートの画面を開く。

    【処理フロー】
    1. noteRepository.create({})でAPIにノートの作成を依頼し、結果を待つ。
    2. 作成されたノートをnoteStore.set()でアプリ内の一覧に追加する。
    3. navigateで作成したノートの詳細画面へ移動する。
    4. 失敗した場合はエラーを記録し、作成に失敗したことを知らせる。
  */

  const createNote = async () => {
    try {
      const newNote = await noteRepository.create({});
      noteStore.set([newNote]);
      navigate(`/notes/${newNote.id}`);
    } catch (error) {
      console.error(error);
      alert('ノートの作成に失敗しました');
    }
  };

  return (
    <>
      <aside className='sidebar'>
        <div>
          <div>
            <UserItem />
            <Item
              label='検索'
              icon={FiSearch}
              onClick={onSearchButtonClick}
            />
          </div>
          <div className='sidebar-spacer'>
            <NoteList />
            <Item label='ノートを作成' icon={FiPlus} onClick={createNote} />
          </div>
        </div>
      </aside>
      <div className='sidebar-placeholder'></div>
    </>
  );
}
