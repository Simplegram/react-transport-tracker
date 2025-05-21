interface Direction {
    id: number
    name: string
}

interface Stop {
    id: number,
    name: string,
    lat?: number,
    lon?: number,
    name_alt?: string,
    vehicle_type?: VehicleType
}

interface Route {
    id: number
    first_stop_id: Stop
    last_stop_id: Stop
    code: string
    name: string
    vehicle_type_id: VehicleType
}

interface VehicleType {
    id: number
    name: string,
    icon_id: IconType,
}

interface IconType {
    id: number,
    name: string
}

interface DataItem {
    id: number;
    created_at: string;
    bus_initial_arrival: string;
    bus_initial_departure: string;
    bus_final_arrival: string;
    routes: Route
    first_stop_id: Stop;
    last_stop_id: Stop;
    notes: string | null;
    vehicle_code: string;
    directions: Direction;
    types: VehicleType;
}

interface Lap {
    id: number
    travel_id: number
    time: string
    stop_id: number | null
    note: string | null
}

interface FullLap {
    id: number
    travel_id: number
    time: string
    stop_id: Stop | null
    note: string | null
}

interface Coordinates {
    lon: number
    lat: number
}

export {
    Coordinates,
    DataItem, Direction, FullLap, IconType,
    Lap, Route, Stop, VehicleType
}
