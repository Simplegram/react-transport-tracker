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
    bus_initial_arrival: string | null
    bus_initial_departure: string | null
    bus_final_arrival: string | null
    notes: string | null
    vehicle_code: string | null
    route_id: number | undefined
    first_stop_id: number | undefined
    last_stop_id: number | undefined
    direction_id: number | undefined
    type_id: number | undefined
}

interface AddableLap {
    travel_id?: number | undefined
    time: string | undefined
    stop_id: number | null
    note: string | null
}

interface AddableLapsModalProp {
    travel_id: number
    currentLaps: AddableLap[]
    isModalVisible: boolean
    onClose: () => void
    onSelect: (laps: AddableLap[]) => void
}

interface AddableLapModalProp {
    travel_id?: number
    isModalVisible: boolean
    onClose: () => void
    onSelect: (lap: AddableLap) => void
}

export {
    AddableDirection,
    AddableStop,
    AddableRoute,
    AddableVehicleType,
    AddableIconType,
    AddableTravel,
    AddableLap,
    AddableLapsModalProp, AddableLapModalProp
}