import {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";

type InputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export interface InputValue<T> {
    value: T,
    setValue: Dispatch<SetStateAction<T>>,
    error: boolean,
    setError: Dispatch<SetStateAction<boolean>>,
    handleChange: (e: InputEvent) => void
}

interface InputOptions<T> {
    required?: boolean,
    regex?: string
}

export default function useInputValue<T>(initValue: T, options?: InputOptions<T>): InputValue<T>
{
    const [value, setValue] = useState<T>(initValue);
    const [error, setError] = useState<boolean>(true);

    useEffect(() => {
        checkValidation(value, options);
    }, [value])

    const handleChange = (e: InputEvent) => {
        setValue(e.target.value as T);
    }

    return {
        value,
        setValue,
        error,
        setError,
        handleChange
    }


    function checkValidation(value: T, options? : InputOptions<T>): void {
        let isValid = true;
        if(options) {
            if(options.required) {
                isValid =
                    value !== undefined &&
                    value !== null &&
                    value !== ""
            }
            if(options.regex && typeof value === 'string') {
                isValid = new RegExp(options.regex).test(value);
            }
        }
        setError(!isValid);
    }
}


