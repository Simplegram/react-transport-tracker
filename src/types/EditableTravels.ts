import { AddableLap } from "./AddableTravels"

interface EditableStop {
    id: number,
    name: string,
    lat?: number,
    lon?: number,
    name_alt?: string,
    vehicle_type: number
}

interface EditableVehicleType {
    id?: number
    name: string,
    icon_id: number,
}

interface EditableRoute {
    first_stop_id: number,
    last_stop_id: number,
    code: string,
    name: string,
    vehicle_type_id: number,
}

interface EditableTravel {
    id: number
    bus_initial_arrival: string
    bus_initial_departure: string
    bus_final_arrival: string
    notes: string
    vehicle_code: string
    route_id: number | undefined
    first_stop_id: number | undefined
    last_stop_id: number | undefined
    direction_id: number | undefined
    type_id: number | undefined
}

interface EditableLap {
    id: number
    travel_id: number
    time: string
    stop_id: number | null
    note: string | null
}

interface EditableTravelModalProp {
    isModalVisible: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onClose: () => void
    onSelect: (stopId: number) => void
}

interface EditableLapsModalProp {
    isModalVisible: boolean
    onClose: () => void
    onSelect: (laps: AddableLap[]) => void
}

export {
    EditableStop,
    EditableVehicleType,
    EditableRoute,
    EditableTravel,
    EditableLap,
    EditableTravelModalProp,
    EditableLapsModalProp
}