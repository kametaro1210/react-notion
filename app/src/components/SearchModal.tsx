import { Note } from '../modules/notes/note.entity';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onKeywordChange: (keyword: string) => void;
}

export default function SearchModal({
  isOpen, 
  onClose,
  notes,
  onKeywordChange
} : Props) {
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={'キーワードで検索'}
          onValueChange={onKeywordChange}
        />
        <CommandList>
          <CommandEmpty>条件に一致するノートがありません</CommandEmpty>
          <CommandGroup>
            {notes.map((note) => (
              <CommandItem
                key={note.id}
                title={note.title ?? '無題'}
              >
                <span>{note.title ?? '無題'}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
