import { DataItem, Lap } from "../types/Travels"

export interface DataItemWithNewKey extends DataItem {
    lapCount: number
}

export const getGroupedData = (data: DataItem[], laps: Lap[]) => {
    const groupedData = data.reduce((acc, currentItem) => {
        const directionName = currentItem.directions?.name || 'Unassigned Direction'
        const directionKey = directionName

        if (!acc[directionKey]) {
            acc[directionKey] = []
        }
        acc[directionKey].push(currentItem)
        return acc
    }, {} as Record<string, DataItem[]>)

    const sortedGroupedData: Record<string, DataItem[]> = {}
    Object.keys(groupedData).forEach(directionKey => {
        sortedGroupedData[directionKey] = groupedData[directionKey].sort((a, b) => {
            const timeA = (a.bus_initial_departure && new Date(a.bus_initial_departure).getTime()) || Infinity
            const timeB = (b.bus_initial_departure && new Date(b.bus_initial_departure).getTime()) || Infinity

            return timeA - timeB
        })
    })

    const finalGroupedDataWithNewKey: Record<string, DataItemWithNewKey[]> = {}
    Object.keys(sortedGroupedData).forEach(directionKey => {
        finalGroupedDataWithNewKey[directionKey] = sortedGroupedData[directionKey].map(item => {
            const matchingLaps = laps.filter(lap => lap.travel_id === item.id)
            const lapCount = matchingLaps.length

            return {
                ...item,
                lapCount: lapCount
            }
        })
    })

    return finalGroupedDataWithNewKey
}