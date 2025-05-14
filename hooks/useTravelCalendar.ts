import { useCallback, useEffect, useState } from "react";
import { DataItem } from "@/src/types/Travels";
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

export default function useTravelCalendar() {
    const [travelAtDate, setTravelAtDate] = useState<DataItem[]>([])
    const [selectedDate, setSelectedDate] = useState<string>(getDateToday);

    const [dates, setDates] = useState<string[]>([])

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

    const getDates = async () => {
        const { data, error } = await supabase
            .from("travels")
            .select("created_at")

        if (!data) {
            if (error) console.log(error)
            return
        }

        const dates = data.map(item => {
            const date = new Date(item.created_at);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        });

        if (error) console.log(error)
        if (data) setDates(dates)
    }

    useEffect(() => {
        getTravelAtDate()
    }, [selectedDate])

    return { 
        travelAtDate, getTravelAtDate, getDates,
        dates, selectedDate, setSelectedDate,
    }
}