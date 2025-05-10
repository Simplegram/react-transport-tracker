import { Direction, Icon, Route, Stop, VehicleType } from "@/src/types/Travels";
import { useEffect, useMemo, useState } from "react";
import { useTravelContext } from "@/context/PageContext";
import useGetTravelData from "./useGetTravelData";

export default function useDataList() {
    const { selectedModification: dataType } = useTravelContext()

    const { 
        directions, getDirections,
        stops, getStops,
        routes, getRoutes,
        vehicleTypes, getVehicleTypes,
        icons, getIcons,
        loading
    } = useGetTravelData()

    const [data, setData] = useState<Direction[] | Stop[] | Route[] | VehicleType[] | IconType[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('')
    
    useEffect(() => {
        switch (dataType) {
        case 'Directions':
            getDirections()
            break;
        case 'Stops':
            getStops()
            break;
        case 'Routes':
            getRoutes()
            break;
        case 'VehicleTypes':
            getVehicleTypes()
            break;
        case 'Icons':
            getIcons()
            break;
        }
    }, [dataType]);

    const filteredStops = useMemo(() => {
        if (!data) return [];
        const query = searchQuery.toLowerCase();

        return data.filter(item => {
            if (item.code) {
                return item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query)
            } else {
                return item.name.toLowerCase().includes(query)
            }
        });
    }, [directions, stops, routes, vehicleTypes, icons, searchQuery]);
    
    let fetchedData: Direction[] | Stop[] | Route[] | VehicleType[] | Icon[] = [];
    useEffect(() => {
        switch (dataType) {
        case 'Directions':
            fetchedData = directions
            break;
        case 'Stops':
            fetchedData = stops
            break;
        case 'Routes':
            fetchedData = routes
            break;
        case 'VehicleTypes':
            fetchedData = vehicleTypes
            break;
        case 'Icons':
            fetchedData = icons
            break;
        default:
            fetchedData = []
            break;
        }

        setData(fetchedData)
    }, [dataType, directions, stops, routes, vehicleTypes, icons]); // Include all fetched data arrays as dependencies

    return {
        dataType,
        data, filteredData: filteredStops,
        searchQuery, setSearchQuery,
        loading
    }
}