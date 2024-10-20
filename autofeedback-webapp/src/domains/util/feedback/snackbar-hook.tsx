import {Alert, Snackbar, SnackbarCloseReason} from "@mui/material";
import {Fragment, ReactElement, ReactNode, SyntheticEvent, useState} from "react";

export function useSnackbar(): [(message: string, variant: SnackbarVariant) => void, () => JSX.Element] {

    const [open, setOpen] = useState<boolean>(false);
    const [variant, setVariant] = useState<SnackbarVariant>(SnackbarVariant.INFO);
    const [message, setMessage] = useState<string>("");

    const openSnackbar = (message: string, snackbarVariant: SnackbarVariant) => {
        setMessage(message);
        setVariant(snackbarVariant);
        setOpen(true);
    };

    const handleClose = (
        event: SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const snackbar = () => (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={5000}
            open={open}
            onClose={handleClose}
            key={message}
        >
            <Alert severity={variant}>
                {message}
            </Alert>
        </Snackbar>
    )

    return [
        openSnackbar,
        snackbar
    ]
}

export enum SnackbarVariant  {
    SUCCESS = "success",
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
}