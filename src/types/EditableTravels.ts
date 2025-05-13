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
  bus_initial_arrival: string
  bus_initial_departure: string
  bus_final_arrival: string
  route_id: number
  first_stop_id: number
  last_stop_id: number
  notes: string
  vehicle_code: string
  direction_id: number
  type_id: number
}

interface EditableTravelModalProp {
  isModalVisible: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  onClose: () => void
  onSelect: (stopId: number) => void
}

export {
  EditableStop,
  EditableVehicleType,
  EditableRoute,
  EditableTravel,
  EditableTravelModalProp
}