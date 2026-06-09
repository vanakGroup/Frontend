import { CustomDialog } from "../Custom/CustomDialog";
import { Button } from "@base-ui/react/button";

export enum ActionTypes {
  ok = "بله",
  cancle = "خیر",
}

interface confirmDialogProps {
  actions?: ActionTypes[];
  onClose: () => void;
  message?: string;
  title?: string;
  open: boolean;
  setAction: (action: ActionTypes) => void;
}

function ConfirmDialog({
  actions,
  onClose,
  message,
  title,
  open,
  setAction,
}: confirmDialogProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onClose}
      title={title ?? "ازانجام عملیات مورد نظر اطمینان دارید؟"}
      description={message ?? ""}
      showCloseButton={true}
    >
      <div className="flex gap-1.5">
        {actions?.map((action) => (
          <Button
            className="bg-primary hover:bg-secondary text-white transition-colors gap-2 rounded-2xl px-3 py-1"
            onClick={() => {
              setAction(action);
              onClose();
            }}
            key={action}
          >
            {action}
          </Button>
        ))}
      </div>
    </CustomDialog>
  );
}

export default ConfirmDialog;
