import React, { ReactNode } from "react";
import * as Selection from "@radix-ui/react-select";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import clsx from "clsx";

interface SelectOption {
  label: string;
  value: string;
}

interface ISelectProps {
  label: string;
  options: SelectOption[];
  onValueChange: (value: string) => any;
  className?: string;
}

interface ISelectItemProps {
  children: ReactNode;
  value: string;
  position?: "first" | "last";
  className?: string;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<HTMLDivElement, ISelectItemProps>(
  ({ children, className, position, value }, forwardedRef) => {
    return (
      <Selection.Item
        className={clsx(
          "leading-none text-sg-900 flex items-center px-5 py-2 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-sg-primary",
          "data-[state='checked']:bg-sg-primary",
          position === "first"
            ? "data-[state='checked']:border-b data-[state='checked']:border-sg-900"
            : position === "last"
            ? "data-[state='checked']:border-t data-[state='checked']:border-sg-900"
            : "data-[state='checked']:border-y data-[state='checked']:border-sg-900",
          className
        )}
        value={value}
        ref={forwardedRef}
      >
        <Selection.ItemText>{children}</Selection.ItemText>
      </Selection.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";

const Select = ({ label, options, className, onValueChange }: ISelectProps) => {
  const [selected, setSelected] = React.useState<string>();

  return (
    <Selection.Root
      onValueChange={(value) => {
        setSelected(value);
        onValueChange(value);
      }}
    >
      <Selection.Trigger
        className={clsx(
          "whitespace-nowrap inline-flex items-center justify-between rounded-lg p-2 pl-5 leading-none text-sg-900 hover:bg-sg-200 focus:shadow-[0_0_0_2px] border border-sg-900 outline-none data-[placeholder]:text-sg-900 max-h-[34px] w-36 data-[state=open]:rounded-b-none",
          className
        )}
        aria-label={label}
      >
        <div className="overflow-hidden">
          <Selection.Value placeholder={label}>
            <p className="truncate">
              {options.find((option) => option.value === selected)?.label ||
                "Sort"}
            </p>
          </Selection.Value>
        </div>
        <Selection.Icon className="text-sg-900">
          <TriangleDownIcon />
        </Selection.Icon>
      </Selection.Trigger>
      <Selection.Portal>
        <Selection.Content
          className="overflow-hidden border bg-sg-50 border-sg-900 rounded-lg data-[state=open]:rounded-t-none w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)]"
          position="popper"
          sideOffset={-1}
        >
          <ScrollArea.Root className="w-full h-full" type="auto">
            <Selection.Viewport asChild>
              <ScrollArea.Viewport className="w-full h-full">
                <Selection.Group>
                  {options.map((option, index) => (
                    <SelectItem
                      value={option.value}
                      position={
                        index === 0
                          ? "first"
                          : index === options.length - 1
                          ? "last"
                          : undefined
                      }
                      key={index}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Selection.Group>
              </ScrollArea.Viewport>
            </Selection.Viewport>
            <ScrollArea.Scrollbar
              className="w-1 px-1 py-[2px]"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="bg-sg-50 rounded-sm" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Selection.Content>
      </Selection.Portal>
    </Selection.Root>
  );
};

export default Select;