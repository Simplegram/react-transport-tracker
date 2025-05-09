import { supabase } from "@/lib/supabase"
import { Direction, Icon, Route, Stop, VehicleType } from "@/src/types/Travels"
import { useCallback, useEffect, useState } from "react"

export default function useTravelData() {
    const [directions, setDirections] = useState<Direction[]>([])
    const [stops, setStops] = useState<Stop[]>([])
    const [routes, setRoutes] = useState<Route[]>([])
    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
    const [icons, setIcons] = useState<Icon[]>([])

    const [loading, setLoading] = useState<boolean>(false)

    const getDirections = useCallback(async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from("directions")
            .select()

        if (error) console.log(error)
        if (data) setDirections(data)

        setLoading(false)
    }, [])

    const getStops = useCallback(async () => {
        setLoading(true)
        
        const { data, error } = await supabase
            .from("stops")
            .select("*, vehicle_type(id, name)")
            .order("name")

        if (error) console.log(error)
        if (data) setStops(data)

        setLoading(false)
    }, [])

    const getRoutes = useCallback(async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from("routes")
            .select()
            .order("code")

        if (error) console.log(error)
        if (data) setRoutes(data)

        setLoading(false)
    }, [])

    const getVehicleTypes = useCallback(async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from("types")
            .select()

        if (error) console.log(error)
        if (data) setVehicleTypes(data)

        setLoading(false)
    }, [])

    const getIcons = useCallback(async () => {
        const { data, error } = await supabase
            .from("icons")
            .select()

        if (error) console.log(error)
        if (data) setIcons(data)
    }, [])

    useEffect(() => {
        getDirections()
        getStops()
        getVehicleTypes()
        getRoutes()
    }, [getDirections, getStops, getVehicleTypes, getRoutes])

    return { 
        directions, getDirections,
        stops, getStops,
        routes, getRoutes,
        vehicleTypes, getVehicleTypes,
        icons, getIcons,
        loading, setLoading
    }
}