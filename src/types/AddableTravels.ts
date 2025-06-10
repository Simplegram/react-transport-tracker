import { Stop } from "./Travels"

interface AddableDirection {
    name: string | undefined
}

interface AddableStop {
    name: string | undefined
    lat: number | null
    lon: number | null
    name_alt: string | null
    vehicle_type: number | undefined
}

interface AddableRoute {
    first_stop_id: number | undefined
    last_stop_id: number | undefined
    code: string | undefined
    name: string | undefined
    vehicle_type_id: number | undefined
}

interface AddableVehicleType {
    name: string | undefined,
    icon_id: number | undefined,
}

interface AddableIconType {
    name: string | undefined
}

interface AddableTravel {
    bus_initial_arrival: string | undefined
    bus_initial_departure: string | undefined
    bus_final_arrival: string | undefined
    notes: string | undefined
    vehicle_code: string | undefined
    route_id: number | undefined
    first_stop_id: number | undefined
    last_stop_id: number | undefined
    direction_id: number | undefined
    type_id: number | undefined
}

interface AddableLap {
    id: number | string
    travel_id?: number | undefined
    time: string | undefined
    lat: number | undefined
    lon: number | undefined
    stop_id: number | undefined
    note: string | undefined
}

interface AddableCoordinates {
    lon: number | null | undefined
    lat: number | null | undefined
}

export interface StandaloneModalProp {
    isModalVisible: boolean
    onClose: () => void
    onSelect: (data: any) => void
}

interface AddableCoordModalProp {
    currentCoordinates: AddableCoordinates | undefined
    isModalVisible: boolean
    onClose: () => void
    onSelect: (coordinates: AddableCoordinates) => void
}

interface AddableLapsModalProp {
    currentLaps: AddableLap[]
    stops: Stop[]
    isModalVisible: boolean
    onClose: () => void
    onSelect: (laps: AddableLap[]) => void
}

interface AddableLapModalProp {
    travel_id?: number
    stops: Stop[]
    isModalVisible: boolean
    onClose: () => void
    onSelect: (lap: AddableLap) => void
}

export {
    AddableCoordinates, AddableCoordModalProp, AddableDirection, AddableIconType, AddableLap, AddableLapModalProp, AddableLapsModalProp, AddableRoute, AddableStop, AddableTravel, AddableVehicleType
}

