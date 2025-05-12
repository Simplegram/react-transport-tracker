import { supabase } from "@/lib/supabase"
import { Direction, IconType, Route, Stop, VehicleType } from "@/src/types/Travels"
import { useCallback, useEffect, useRef, useState } from "react"

export default function useGetTravelData() {
    const [directions, setDirections] = useState<Direction[]>([])
    const [stops, setStops] = useState<Stop[]>([])
    const [routes, setRoutes] = useState<Route[]>([])
    const [fullVehicleTypes, setFullVehicleTypes] = useState<VehicleType[]>([])
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
    const [icons, setIcons] = useState<IconType[]>([])

    const [loading, setLoading] = useState<boolean>(false)

    const stopLoading = () => {
        setLoading(false)
    }

    const getDirections = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from("directions")
            .select()

        if (error) console.log(error)
        if (data) setDirections(data)

        stopLoading()
    }

    const getStops = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from("stops")
            .select("*, vehicle_type(id, name, icon_id(id, name))")
            .order("name")

        if (error) console.log(error)
        if (data) setStops(data)

        stopLoading()
    }

    const getRoutes = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from("routes")
            .select("*, first_stop_id(id, name), last_stop_id(id, name), vehicle_type_id(id, name, icon_id(id, name))")
            .order("code")

        if (error) console.log(error)
        if (data) setRoutes(data)

        stopLoading()
    }

    const getFullVehicletypes = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from("types")
            .select("*, icon_id(id, name)")

        if (error) console.log(error)
        if (data) setFullVehicleTypes(data)

        stopLoading()
    }

    const getVehicleTypes = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from("types")
            .select("*")
            .order("id")

        if (error) console.log(error)
        if (data) setVehicleTypes(data)

        stopLoading()
    }

    const getIcons = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from("icons")
            .select()

        if (error) console.log(error)
        if (data) setIcons(data)

        stopLoading()
    }

    const getTravelData = useCallback(() => {
        getDirections()
        getStops()
        getRoutes()
        getVehicleTypes()
        getFullVehicletypes()
        getIcons()
    }, [])

    useEffect(() => {
        getTravelData()
    }, [getTravelData])

    return {
        directions, getDirections,
        stops, getStops,
        routes, getRoutes,
        vehicleTypes, fullVehicleTypes, getVehicleTypes,
        icons, getIcons,
        loading, setLoading,
        refetchTravelData: getTravelData,
    }
}