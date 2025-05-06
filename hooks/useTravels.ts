import { useCallback, useEffect, useState } from "react";
import { DataItem, Stop, VehicleType } from "@/src/types/Travels";
import { supabase } from "@/lib/supabase";

function formatDate(
    date: Date, 
    custom_hours: number | null = null, 
    custom_minutes: number | null = null, 
    custom_seconds: number | null = null
) {
    // Create a new Date object if one wasn't passed in
    if (!date) {
      date = new Date();
    }
  
    // Ensure we're working with a Date object
    if (!(date instanceof Date)) {
      return "Invalid Date"; // Or handle the error in a way that suits your needs
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = custom_hours ?? String(date.getHours()).padStart(2, '0');
    const minutes = custom_minutes ?? String(date.getMinutes()).padStart(2, '0');
    const seconds = custom_seconds ?? String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getDateToday() {
    const dateToday = new Date()
    return formatDate(dateToday)
}

export default function useTravels() {
    const [travelAtDate, setTravelAtDate] = useState<DataItem[]>([])
    const [selectedDate, setSelectedDate] = useState<string>(getDateToday);

    const [stops, setStops] = useState<Stop[]>([])

    const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])

    async function getTravelAtDate() {
        const endDate = formatDate(new Date(selectedDate), 23, 59, 59)
        const { data, error } = await supabase
            .from('travels')
            .select("id, created_at, types(id, name), routes(id, code, name), directions(id, name), first_stop_id(id, name, vehicle_type), last_stop_id(id, name, vehicle_type), bus_initial_arrival, bus_initial_departure, bus_final_arrival, vehicle_code, notes")
            .gte('created_at', selectedDate)
            .lte('created_at', endDate.toString())
        
        if (error) console.log(error)

        if (data) setTravelAtDate(data)
    }

    const getStops = useCallback(async () => {
        const { data, error } = await supabase
            .from("stops")
            .select()
            .order("name")

        if (error) console.log(error)

        if (data) setStops(data)
    }, [])

    const getVehicleTypes = useCallback(async () => {
        const { data, error } = await supabase
            .from("types")
            .select()

        if (error) console.log(error)

        if (data) setVehicleTypes(data)
    }, [])

    useEffect(() => {
        getTravelAtDate()
    }, [selectedDate])

    useEffect(() => {
        getStops()
        getVehicleTypes()
    }, [getStops, getVehicleTypes])

    return { selectedDate, travelAtDate, stops, vehicleTypes, setSelectedDate }
}