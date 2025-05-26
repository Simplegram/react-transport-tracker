import { useSupabase } from "@/context/SupabaseContext"
import { Direction, FullLap, IconType, Lap, Route, Stop, VehicleType } from "@/src/types/Travels"
import { useEffect, useState } from "react"

export default function useGetTravelData() {
    const { supabaseClient: supabase } = useSupabase()

    const [directions, setDirections] = useState<Direction[]>([])
    const [stops, setStops] = useState<Stop[]>([])
    const [routes, setRoutes] = useState<Route[]>([])
    const [fullVehicleTypes, setFullVehicleTypes] = useState<VehicleType[]>([])
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
    const [icons, setIcons] = useState<IconType[]>([])
    const [averageTime, setAverageTime] = useState()

    const [laps, setLaps] = useState<Lap[]>([])
    const [travelLaps, setTravelLaps] = useState<FullLap[] | undefined>(undefined)

    const getDirections = async () => {
        const { data, error } = await supabase
            .from("directions")
            .select()

        if (error) console.log(error)
        if (data) setDirections(data)
    }

    const getStops = async () => {
        const { data, error } = await supabase
            .from("stops")
            .select("*, vehicle_type(id, name, icon_id(id, name))")
            .order("name")

        if (error) console.log(error)
        if (data) setStops(data)
    }

    const getRoutes = async () => {
        const { data, error } = await supabase
            .from("routes")
            .select("*, first_stop_id(id, name), last_stop_id(id, name), vehicle_type_id(id, name, icon_id(id, name))")
            .order("code")

        if (error) console.log(error)
        if (data) setRoutes(data)
    }

    const getFullVehicletypes = async () => {
        const { data, error } = await supabase
            .from("types")
            .select("*, icon_id(id, name)")

        if (error) console.log(error)
        if (data) setFullVehicleTypes(data)
    }

    const getVehicleTypes = async () => {
        const { data, error } = await supabase
            .from("types")
            .select("*")
            .order("id")

        if (error) console.log(error)
        if (data) setVehicleTypes(data)
    }

    const getIcons = async () => {
        const { data, error } = await supabase
            .from("icons")
            .select()

        if (error) console.log(error)
        if (data) setIcons(data)
    }

    const getAllLaps = async () => {
        const { data, error } = await supabase
            .from("laps")
            .select()

        if (error) console.log(error)
        if (data) setLaps(data)
    }

    const getLaps = async (travelId: number) => {
        const { data, error } = await supabase
            .from("laps")
            .select()
            .eq("travel_id", travelId)

        if (error) console.log(error)
        if (data) {
            setLaps(data)
            return data
        }

        return null
    }

    const getFullLaps = async (travelId: number) => {
        const { data, error } = await supabase
            .from("laps")
            .select("*, stop_id(*)")
            .eq("travel_id", travelId)

        if (error) console.log(error)
        if (data) {
            setLaps(data)
            return data
        }

        return null
    }

    const getTravelLaps = async (travelIds: number[]) => {
        try {
            const lapPromises = travelIds.map(travelId => {
                return getFullLaps(travelId)
            })

            const allLapsData = await Promise.all(lapPromises)

            const validLapsData = allLapsData.filter(laps => laps !== null)
            const flattenedLaps = validLapsData.flat()

            setTravelLaps(flattenedLaps)

        } catch (error) {
            console.error("Error fetching travel laps:", error)
        }
    }

    const getTravelTime = async (route_id: number, direction_id: number, first_stop_id: number, last_stop_id: number) => {
        const { data, error } = await supabase
            .rpc('calculate_average_travel_time', {
                'route_id_param': route_id,
                'direction_id_param': direction_id,
                'first_stop_id_param': first_stop_id,
                'last_stop_id_param': last_stop_id,
            })

        if (data) setAverageTime(data)
        if (error) console.log(error)
    }

    const getTravelData = async (timeout: number = 0) => {
        // listening to database changes might be a better idea?
        setTimeout(async () => {
            await getDirections()
            await getStops()
            await getRoutes()
            await getVehicleTypes()
            await getFullVehicletypes()
            await getIcons()
        }, timeout)
    }

    useEffect(() => {
        getTravelData()
    }, [])

    return {
        directions, getDirections,
        stops, getStops,
        routes, getRoutes,
        vehicleTypes, fullVehicleTypes, getVehicleTypes,
        icons, getIcons,
        laps, setLaps, getLaps, getAllLaps,
        travelLaps, getTravelLaps,
        refetchTravelData: getTravelData,
        averageTime, getTravelTime,
    }
}