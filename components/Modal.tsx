import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-900/90 backdrop-blur-sm inset-0 fixed" />
        <Dialog.Content
          className={`
          fixed 
          drop-shadow-md 
          max-h-full 
          md:max-h-[85vh]
          h-full 
          md:h-auto 
          border 
          border-neutral-700 
          top-[50%] 
          left-[50%]
          max-w-full
          md:w-[90vw]
          md:max-w-[450px]
          w-full
          translate-x-[-50%]
          translate-y-[-50%]
          rounded-md
          bg-neutral-800
          p-6
          focus:outline-none`}>
          <Dialog.Title className="text-xl text-center font-semibold mb-4 tracking-wide">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-center leading-normal mb-4">
            {description}
          </Dialog.Description>
          <div>{children}</div>
          <Dialog.Close asChild>
            <button
              aria-label="Close"
              className={`
              text-neutral-500 
              hover:text-neutral-50 
              transition 
              absolute 
              top-3.5 
              right-3.5 
              h-6 
              w-6
              appearance-none
              rounded-full
              inline-flex
              items-center
              justify-center
              focus:outline-none`}>
              <IoMdClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
