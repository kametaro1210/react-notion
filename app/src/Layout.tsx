import { Outlet } from 'react-router-dom';
import SearchModal from './components/SearchModal';
import SideBar from './components/SideBar';
import './styles/layout.css';

export default function Layout() {
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
