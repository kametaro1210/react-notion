import { useAtom } from 'jotai';
import { FiChevronsLeft, FiLogOut } from 'react-icons/fi';
import { currentUserAtom } from '../../modules/auth/current-user.state';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Item from './Item';

export default function UserItem() {

  // アプリ全体で共有するログイン中のユーザー情報と更新関数
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  // ------------------------------------------------------------------------------

  /*
    ログアウト処理

    【目的】
    ログイン中のユーザー情報とトークンを削除し、ログイン画面へ戻す。

    【処理フロー】
    1. setCurrentUser(undefined)でアプリ内のユーザー情報を消去する。
    2. localStorage.removeItem('token')で、ブラウザーに保存した'token'を削除する。
        removeItemは、指定したキーの保存データを削除する処理。
    3. ユーザー情報がなくなるとLayoutが未ログインと判断し、/signinへ移動する。
  */

  const signout = async () => {
    setCurrentUser(undefined);
    localStorage.removeItem('token');
  };

  // ------------------------------------------------------------------------------

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='user-item-trigger' role='button'>
          <div className='user-item-info'>
            <span className='user-item-name'>
              {currentUser!.name} さんのノート {/* !. で null/undefined でないことを明示 */}
            </span>
          </div>
          <FiChevronsLeft className='user-item-chevron' size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='user-item-dropdown'
        align='start'
        alignOffset={11}
        forceMount
      >
        <div className='user-item-dropdown-content'>
          <p className='user-item-email'>
            {currentUser!.email}
          </p>
          <div className='user-item-info'>
            <div>
              <p className='user-item-name-display'>
                {currentUser!.name}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='user-item-logout'>
          <Item label='ログアウト' icon={FiLogOut} onClick={signout} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
