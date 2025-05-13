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

interface AddableVehicleType {
    name: string | undefined,
    icon_id: number | undefined,
}

interface AddableIconType {
    name: string | undefined
}

export {
    AddableDirection,
    AddableStop,
    AddableVehicleType,
    AddableIconType
}