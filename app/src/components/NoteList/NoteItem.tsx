import {
  FiChevronRight,
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

// この画面に渡す情報として、Note型のノートを受け取ることを決める。
interface Props {
  note: Note;
}

// 渡されたPropsからnoteを取り出し、この部品の中で使う。
export default function NoteItem({ note } : Props) {
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
      <div className='note-item-menu-button' role='button' onClick={() => {}}>
        <FiPlus className='note-item-menu-icon' size={16} />
      </div>
    </div>
  );

  return (
    <div role='button' style={{ paddingLeft: '12px' }}>
      <Item label={note.title ?? '無題'} icon={FiChevronRight} trailingItem={menu} />
    </div>
  );
}
