import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
  allowCreate?: boolean;
  onCreate?: (value: string) => void;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Auswählen...",
  emptyText = "Keine Ergebnisse gefunden.",
  searchPlaceholder = "Suchen...",
  className,
  allowCreate = false,
  onCreate,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (currentValue: string) => {
    onValueChange?.(currentValue === value ? "" : currentValue);
    setOpen(false);
    setSearchValue("");
  };

  const handleCreate = () => {
    if (searchValue.trim() && onCreate) {
      onCreate(searchValue.trim());
      setSearchValue("");
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {emptyText}
              {allowCreate && searchValue.trim() && (
                <Button
                  variant="ghost"
                  className="w-full justify-start mt-2"
                  onClick={handleCreate}
                >
                  <span className="text-sm">
                    Erstellen: <strong>{searchValue}</strong>
                  </span>
                </Button>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface MultiComboboxProps {
  options: ComboboxOption[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
  allowCreate?: boolean;
  onCreate?: (value: string) => void;
}

export function MultiCombobox({
  options,
  values,
  onValuesChange,
  placeholder = "Auswählen...",
  emptyText = "Keine Ergebnisse gefunden.",
  searchPlaceholder = "Suchen...",
  className,
  allowCreate = false,
  onCreate,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedOptions = options.filter((option) =>
    values.includes(option.value)
  );

  const availableOptions = options.filter(
    (option) => !values.includes(option.value)
  );

  const filteredOptions = availableOptions.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (currentValue: string) => {
    if (values.includes(currentValue)) {
      onValuesChange(values.filter((v) => v !== currentValue));
    } else {
      onValuesChange([...values, currentValue]);
    }
    setSearchValue("");
  };

  const handleRemove = (valueToRemove: string) => {
    onValuesChange(values.filter((v) => v !== valueToRemove));
  };

  const handleCreate = () => {
    if (searchValue.trim() && onCreate) {
      onCreate(searchValue.trim());
      setSearchValue("");
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedOptions.length > 0
              ? `${selectedOptions.length} ausgewählt`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {emptyText}
                {allowCreate && searchValue.trim() && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start mt-2"
                    onClick={handleCreate}
                  >
                    <span className="text-sm">
                      Erstellen: <strong>{searchValue}</strong>
                    </span>
                  </Button>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        values.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge key={option.value} variant="secondary" className="pr-1">
              {option.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => handleRemove(option.value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

