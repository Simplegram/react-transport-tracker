import { useSupabase } from "@/context/SupabaseContext"
import { AverageTimes, TravelTimeData } from "@/src/types/Travels"
import { useState } from "react"

import { useDialog } from "@/context/DialogContext"
import axios from 'axios'

interface Geometry {
    coordinates: Array<Array<number>>
    type: string
}

interface TravelTimeInput {
    routeId: number
    directionId: number
    startStopId: number
    endStopId: number
}

export default function useTravelDetail() {
    const { supabaseClient: supabase } = useSupabase()

    const { dialog } = useDialog()

    const [averageTime, setAverageTime] = useState<AverageTimes>()
    const [travelTimes, setTravelTimes] = useState<TravelTimeData>()
    const [routeTrace, setRouteTrace] = useState<number[][]>()

    const instance = axios.create({
        baseURL: 'https://router.project-osrm.org/match/v1/driving',
        timeout: 10000,
        proxy: false
    })

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

    const getRouteTrace = async (joinedCoordinates: string) => {
        return instance.get(`/${joinedCoordinates}`, {
            params: {
                geometries: 'geojson'
            }
        })
            .then((response) => {
                console.log(response.status)
                setRouteTrace(response.data['matchings'][0]['geometry']['coordinates'])
            })
            .catch(function (error) {
                dialog('Error', JSON.stringify(error, null, 2))
                console.log(JSON.stringify(error, null, 2))
            })
    }

    return {
        averageTime, getTravelTime,
        travelTimes, getAllTravelTimes,
        routeTrace, getRouteTrace,
    }
}