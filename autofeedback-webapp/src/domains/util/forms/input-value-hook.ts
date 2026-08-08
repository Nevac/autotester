import {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";

type InputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type InputType<T> = T | undefined;

export interface InputValue<T> {
    value: InputType<T>,
    valueOrThrow: () => T,
    valueOrUndefined: () => T | undefined,
    setValue: Dispatch<SetStateAction<InputType<T>>>,
    setRawValue: (value: T) => void,
    options: InputOptions<T>,
    error: boolean,
    setError: Dispatch<SetStateAction<boolean>>,
    handleChange: (e: InputEvent) => void
}

interface InputOptions<T> {
    required?: boolean,
    regex?: string
}

export default function useInputValue<T>(initValue: InputType<T>, initOptions: InputOptions<T> = {required: false, regex: undefined}): InputValue<T>
{
    const [value, setValue] = useState<InputType<T>>(initValue);
    const [error, setError] = useState<boolean>(true);
    const [options, setOptions] = useState<InputOptions<T>>(initOptions);

    useEffect(() => {
        checkValidation(value, options);
    }, [value])

    const handleChange = (e: InputEvent) => {
        setValue(e.target.value as T);
    }

    const valueOrThrow = () => {
        if(value !== undefined) return value;
        else throw "Input value is undefined";
    }

    const valueOrUndefined = () => {
        return value;
    }

    const setRawValue = (value: T): void => {
        setValue(value);
    }

    return {
        value,
        valueOrThrow,
        valueOrUndefined,
        setValue,
        setRawValue,
        options,
        error,
        setError,
        handleChange
    }


    function checkValidation(value: InputType<T>, options? : InputOptions<T>): void {
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


