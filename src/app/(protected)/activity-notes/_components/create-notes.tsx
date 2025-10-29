
"use client";

import React, { useState, useEffect } from "react";
import { IconCircleDashedPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import NotesForm from "@/components/forms/notes";

const CreateNotes = ({ userId }: { userId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to simulate pressing Ctrl+B
  const triggerCtrlB = () => {
    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "b",
      code: "KeyB",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(keyboardEvent);
  };

  // Trigger Ctrl+B when modal opens or closes
  useEffect(() => {
    triggerCtrlB();
  }, [isOpen]);

  return (
    <>
      <Modal
        className="max-w-5xl! overflow-y-auto h-[90vh]"
        title="Create new activity note"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <NotesForm
          initialData={null}
          userId={userId}
          onClose={() => setIsOpen(false)}
        />
      </Modal>

      <Button onClick={() => setIsOpen(true)} size="lg">
        <IconCircleDashedPlus className="size-5" /> Create Note
      </Button>
    </>
  );
};

export default CreateNotes;
