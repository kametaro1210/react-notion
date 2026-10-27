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

}

export default function SearchModal({isOpen, onClose} : Props) {
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={'キーワードで検索'}
          onValueChange={() => {}}
        />
        <CommandList>
          <CommandEmpty>条件に一致するノートがありません</CommandEmpty>
          <CommandGroup>
            <CommandItem>
              <span>ノート1</span>
            </CommandItem>
            <CommandItem>
              <span>ノート2</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
