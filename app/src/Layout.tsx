import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import SearchModal from './components/SearchModal';
import SideBar from './components/SideBar';
import { currentUserAtom } from './modules/auth/current-user.state';
import { Note } from './modules/notes/note.entity';
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

  // 検索モーダルの開閉フラグ
  const [isShowModal, setIsShowModal] = useState(false);

  // 検索結果を取得するステート
  const [searchResult, setSearchResult] = useState<Note[]>([]);

  // useNavigateが返す画面移動用の関数を保存し、
  // 選んだノートの画面へ移動できるようにする。
  const navigate = useNavigate();


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

  /*
    ノート検索処理

    【目的】
    入力されたキーワードでノートを検索し、検索結果を画面に渡す。

    【処理フロー】
    1. keywordをAPIに渡し、検索結果をnotesとして受け取る。
    2. 検索結果をnoteStore.set()でアプリ内のノート一覧に保存する。
    3. setSearchResult(notes ?? [])で検索結果を保存する。
        notesがnullまたはundefinedなら空の一覧[]を使い、それ以外ならnotesを使う。
  */

  const searchNotes = async (keyword: string) => {
    const notes = await noteRepository.find({ keyword });
    noteStore.set(notes);
    setSearchResult(notes ?? []);
  };

  // -----------------------------------------------------------------------------

  /*
    検索結果からノート詳細へ移動する処理

    【目的】
    選択したノートの詳細画面を開き、検索モーダルを閉じる。

    【処理フロー】
    1. 選択されたノートのID(noteId)を受け取る。
    2. navigateでそのIDのノート詳細画面へ移動する。
    3. setIsShowModal(false)で検索モーダルを閉じる。
  */

  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
    setIsShowModal(false);
  };

  // -----------------------------------------------------------------------------

  // ログインしていない場合、ログイン画面へ遷移
  if (!currentUser) return <Navigate to="/signin" replace />;

  return (
    <div className='layout-container'>

      {/* 読み込み中でなければ、サイドバーを表示する。 */}
      {!isLoading && 

        // 検索ボタンを押した際に、モーダルを表示する(フラグをtrueにする)
        <SideBar onSearchButtonClick={() => setIsShowModal(true)} />
      }
      
      <main className='layout-main'>

        {/* 子Routeの画面（現在はHome）を、この位置に表示する。 */}
        <Outlet />
        
      </main>

      <SearchModal 
        isOpen={isShowModal}
        onClose={() => setIsShowModal(false)}
        notes={searchResult}
        onKeywordChange={searchNotes}
        onItemSelect={moveToDetail}
      />
    </div>
  );
}
