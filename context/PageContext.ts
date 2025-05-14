import { DataItem } from "@/src/types/Travels";
import { createContext, useContext, useState } from "react";

export const ScrollContext = createContext<boolean>(false)

interface TravelContextValue {
    selectedItem: any | undefined
    selectedModification: string | undefined
    setSelectedItem: (item: any | undefined) => void
    setSelectedModification: (modification: string | undefined) => void
}

export const TravelContext = createContext<TravelContextValue | undefined>(undefined)

export function useTravelContext() {
    const travelItem = useContext(TravelContext);

    if (travelItem === undefined) {
        throw new Error('useTravelContext must be used within a TravelProvider');
    }

    return travelItem;
}