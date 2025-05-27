import { useSupabase } from "@/context/SupabaseContext"
import { AverageTimes } from "@/src/types/Travels"
import { useState } from "react"

export default function useTravelDetail() {
    const { supabaseClient: supabase } = useSupabase()

    const [averageTime, setAverageTime] = useState<AverageTimes>()

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
    }

    return {
        averageTime, getTravelTime,
    }
}