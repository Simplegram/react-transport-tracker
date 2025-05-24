import { DataItem } from "@/src/types/Travels"
import { createContext, useContext } from "react"

export const ScrollContext = createContext<boolean>(false)

interface TravelContextValue {
    selectedItem: any | undefined
    setSelectedItem: (item: any | undefined) => void
    selectedModification: string | undefined
    setSelectedModification: (modification: string | undefined) => void
    selectedTravelItems: DataItem[] | undefined
    setSelectedTravelItems: (travels: DataItem[] | undefined) => void
}

export const TravelContext = createContext<TravelContextValue | undefined>(undefined)

export function useTravelContext() {
    const travelItem = useContext(TravelContext)

    if (travelItem === undefined) {
        throw new Error('useTravelContext must be used within a TravelProvider')
    }

    return travelItem
}