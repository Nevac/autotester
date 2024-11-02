import {InputValue} from "./input-value-hook";
import {useEffect, useState} from "react";

export default function useFormValidationHook(inputs: InputValue<any>[]): boolean {

    const [isValid, setIsValid] = useState<boolean>(false);

    useEffect(() => {
        setIsValid(inputs.every(input => !input.error));
    }, [...inputs.map(input => input.value)]);

    return isValid;
}