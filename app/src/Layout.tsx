import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import SearchModal from './components/SearchModal';
import SideBar from './components/SideBar';
import { currentUserAtom } from './modules/auth/current-user.state';
import { noteRepository } from './modules/notes/note.repository';
import { useNoteStore } from './modules/notes/notes.state';
import './styles/layout.css';

export default function Layout() {

  // ログイン中のユーザー情報の取得
  const currentUser = useAtomValue(currentUserAtom);

  // APIの通信中（送信中）かどうかを表すフラグステート（true: 通信中 / false: 待機中）
  const [isLoading, setIsLoading] = useState(false);

  // ノート一覧を取得したり、更新したりする機能を使えるようにする。
  const noteStore = useNoteStore();

  // -----------------------------------------------------------------------------

  /*
    ノート一覧の読み込み処理

    【目的】
    APIからノート一覧を取得し、アプリ内に保存してサイドバーに表示する。

    【処理フロー】
    1. useEffectで、Layoutが表示されたときに一度だけ読み込み処理を始める。(マウント)
    2. setIsLoading(true)で読み込み中にし、サイドバーを一時的に非表示にする。
    3. noteRepository.find()でAPIからノート一覧を取得する。
    4. 取得した一覧をnoteStore.set()でアプリ内に保存する。
    5. setIsLoading(false)で読み込みを終え、サイドバーに一覧を表示する。
  */

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      const notes = await noteRepository.find();
      noteStore.set(notes);
      setIsLoading(false);
  };
    fetchNotes();
  }, []);

  // -----------------------------------------------------------------------------


  // ログインしていない場合、ログイン画面へ遷移
  if (!currentUser) return <Navigate to="/signin" replace />;

  return (
    <div className='layout-container'>

      {/* 読み込み中でなければ、サイドバーを表示する。 */}
      {!isLoading && <SideBar />}
      
      <main className='layout-main'>

        {/* 子Routeの画面（現在はHome）を、この位置に表示する。 */}
        <Outlet />
        
      </main>
      <SearchModal />
    </div>
  );
}
