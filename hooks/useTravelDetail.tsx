import { useSupabase } from "@/context/SupabaseContext"
import { AverageTimes, TravelTimeData } from "@/src/types/Travels"
import { useState } from "react"

interface TravelTimeInput {
    routeId: number
    directionId: number
    startStopId: number
    endStopId: number
}

export default function useTravelDetail() {
    const { supabaseClient: supabase } = useSupabase()

    const [averageTime, setAverageTime] = useState<AverageTimes>()
    const [travelTimes, setTravelTimes] = useState<TravelTimeData>()

    const getTravelTime = async (route_id: number, direction_id: number, first_stop_id: number, last_stop_id: number) => {
        const { data, error } = await supabase
            .rpc('calculate_average_travel_times', {
                'route_id_param': route_id,
                'direction_id_param': direction_id,
                'first_stop_id_param': first_stop_id,
                'last_stop_id_param': last_stop_id,
            })

        if (data) setAverageTime(data[0])
        if (error) console.log(error)
        return data[0]
    }

    const getAllTravelTimes = async (items: TravelTimeInput[]) => {
        items.map(async (item) => {
            await getTravelTime(item.routeId, item.directionId, item.startStopId, item.endStopId).then(
                data => setTravelTimes(
                    prevTravelTimes => ({
                        ...prevTravelTimes,
                        [item.routeId]: {
                            ...data
                        }
                    })
                )
            )
        })
    }

    return {
        averageTime, getTravelTime,
        travelTimes, getAllTravelTimes,
    }
}