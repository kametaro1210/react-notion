import { useAtomValue } from 'jotai';
import { Navigate, Outlet } from 'react-router-dom';
import SearchModal from './components/SearchModal';
import SideBar from './components/SideBar';
import { currentUserAtom } from './modules/auth/current-user.state';
import './styles/layout.css';

export default function Layout() {

  // ログイン中のユーザー情報の取得
  const currentUser = useAtomValue(currentUserAtom);

  // ログインしていない場合、ログイン画面へ遷移
  if (!currentUser) return <Navigate to="/signin" replace />;

  return (
    <div className='layout-container'>
      <SideBar />
      <main className='layout-main'>

        {/* 子Routeの画面（現在はHome）を、この位置に表示する。 */}
        <Outlet />
        
      </main>
      <SearchModal />
    </div>
  );
}
