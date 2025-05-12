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

export {
  EditableStop,
  EditableVehicleType,
  EditableRoute
}