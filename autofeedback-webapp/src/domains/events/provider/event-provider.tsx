import {createContext, Dispatch, SetStateAction, useContext, useMemo, useState} from "react";

type ReactState<T> = [T, Dispatch<SetStateAction<T>>]

class Event<T> {
    constructor(
        public readonly state: ReactState<T>
    ){}

    public value(): T {
        const [stateValue, setStateValue] = this.state;
        return stateValue;
    }

    public trigger(value: T): void {
        const [stateValue, setStateValue] = this.state;
        setStateValue(value);
    }
}

class Events {
    constructor(
        public readonly chatGroupsChanged: Event<void>,
        public readonly exercisesChanged: Event<string>,
        public readonly promptGroupsChanged: Event<void>,
    ) {}
    
    public static ofStates(
        chatGroupsChangedState: ReactState<void>,
        exercisesChangedState: ReactState<string>,
        promptGroupsChangedState: ReactState<void>
    ) : Events {
        return new Events(
            new Event<void>(chatGroupsChangedState),
            new Event<string>(exercisesChangedState),
            new Event<void>(promptGroupsChangedState),
        );
    }
}

const EventContext = createContext<Events | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const events = Events.ofStates(
        useState<void>(),
        useState<string>(""),
        useState<void>()
    );

    const value = useMemo(() => events, []);

    return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEventContext = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEventContext must be used within an EventProvider');
    }
    return context;
};