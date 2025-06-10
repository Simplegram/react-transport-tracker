import { ManageableLap } from "@/components/modal/FlatlistPicker"
import { Direction, IconType, Route, Stop, VehicleType } from "./Travels"

interface EditableStop {
    id: number,
    name: string,
    lat?: number,
    lon?: number,
    name_alt?: string,
    vehicle_type: number
    icon_id: IconType
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
    vehicle_type: VehicleType,
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
    stop_id: number | undefined
    note: string | undefined
}

interface EditableTravelModalProp {
    isModalVisible: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onClose: () => void
    onSelect: (stopId: number) => void
}

export interface EditableTravelRouteModalProp {
    routes: Route[]
    isModalVisible: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onClose: () => void
    onSelect: (stopId: number) => void
}

export interface EditableTravelDirectionModalProp {
    directions: Direction[]
    isModalVisible: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onClose: () => void
    onSelect: (stopId: number) => void
}

interface EditableTravelStopModalProp {
    stops: Stop[]
    isModalVisible: boolean
    searchQuery: string
    setSearchQuery: (query: string) => void
    onClose: () => void
    onSelect: (stopId: number) => void
}

interface EditableLapsModalProp {
    travel_id: number
    currentLaps: ManageableLap[]
    stops: Stop[]
    isModalVisible: boolean
    onClose: () => void
    onSelect: (lap: ManageableLap[]) => void
}

interface EditableLapModalProp {
    stops: Stop[]
    selectedLap: ManageableLap
    isModalVisible: boolean
    onClose: () => void
    onSelect: (lap: ManageableLap[]) => void
}

export {
    EditableLap, EditableLapModalProp, EditableLapsModalProp, EditableRoute, EditableStop, EditableTravel, EditableTravelModalProp, EditableTravelStopModalProp, EditableVehicleType
}
