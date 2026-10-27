import { useDebouncedCallback } from 'use-debounce';
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

  // ------------------------------------------------------------------

  /*
    検索実行のタイミング調整

    【目的】
    入力のたびに検索せず、入力が止まってから検索してAPIへの通信を減らす。

    【処理フロー】
    1. 入力が変わるたびにonKeywordChangeを呼ぶ代わりに、実行を500ミリ秒待つ。
    2. 待っている間に入力が変わると、待ち時間をやり直す。
    3. 入力が止まって500ミリ秒後に、最後のキーワードで検索する。
  */

  const debounced = useDebouncedCallback(onKeywordChange, 500);

  // ------------------------------------------------------------------

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={'キーワードで検索'}
          onValueChange={debounced}
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
