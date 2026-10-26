import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FiChevronRight,
  FiFile,
  FiMoreHorizontal,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';
import { Note } from '../../modules/notes/note.entity';
import Item from '../SideBar/Item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Props {
  // この画面に渡す情報として、Note型のノートを受け取ることを決める。
  note: Note;

  // 省略可能で、マウス操作の情報を受け取り、値を返さない関数を指定する。
  onCreate?: (event: React.MouseEvent) => void;
  onExpand?: (event: React.MouseEvent) => void;
}

// 渡されたPropsからnoteを取り出し、この部品の中で使う。
export default function NoteItem({ 
  note,
  onCreate,
  onExpand,
} : Props) {

  // カーソルがノートに乗っているかを記録し、状態に応じてアイコンを切り替える。
  const [isHovered, setIsHovered] = useState(false);

  /*
    todo : 処理フローや概要は後ほど記載
  */

  const getIcon = (): IconType => {
    return isHovered ? FiChevronRight : FiFile;
  };

  const menu = (
    <div className='note-item-menu-container'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className='note-item-menu-button' role='button'>
            <FiMoreHorizontal className='note-item-menu-icon' size={16} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='note-item-dropdown'
          align='start'
          side='right'
          forceMount
        >
          <DropdownMenuItem onClick={() => {}}>
            <FiTrash2 className='note-item-delete-icon' size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className='note-item-menu-button' role='button' onClick={onCreate}>
        <FiPlus className='note-item-menu-icon' size={16} />
      </div>
    </div>
  );

  return (
    <div 
      role='button' 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ paddingLeft: '12px' }}
    >
      <Item 
        label={note.title ?? '無題'} 
        icon={getIcon()} 
        trailingItem={menu} 
        onIconClick={onExpand}
      />
    </div>
  );
}
