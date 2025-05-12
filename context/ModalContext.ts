import { createContext, useContext, useState } from "react";

export const ScrollContext = createContext<boolean>(false)

interface ModalContextValue {
    modalData: any | undefined
    setModalData: any | undefined
}

export const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export function useModalContext() {
    const modalData = useContext(ModalContext);

    if (modalData === undefined) {
        throw new Error('useTravelContext must be used within a TravelProvider');
    }

    return modalData;
}