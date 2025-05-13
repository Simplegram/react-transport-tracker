import { supabase } from "@/lib/supabase";
import { Direction, IconType, Stop } from "@/src/types/Travels";
import { EditableRoute, EditableStop, EditableVehicleType } from "@/src/types/EditableTravels";

export default function useModifyTravelData() {
    const addVehicleType = async (item: EditableVehicleType) => {
        const { error } = await supabase
            .from("types")
            .upsert(item)

        if (error) console.log(error)
    }
    
    const addIcon = async (item: IconType) => {
        const { error } = await supabase
            .from("icons")
            .insert(item)

        if (error) console.log(error)
    }

    // ---

    const editDirection = async (item: Direction) => {
        const { error } = await supabase
            .from("directions")
            .upsert(item)

        if (error) console.log(error)
    }

    const editStop = async (item: EditableStop) => {
        const { error } = await supabase
            .from("stops")
            .upsert(item)

        if (error) console.log(error)
    }

    const editVehicleType = async (item: EditableVehicleType) => {
        const { error } = await supabase
            .from("types")
            .upsert(item)

        if (error) console.log(error)
    }

    const editRoute = async (item: EditableRoute) => {
        const { error } = await supabase
            .from("routes")
            .upsert(item)

        if (error) console.log(error)
    }

    return {
        editDirection,
        editStop,
        addIcon,
        addVehicleType, editVehicleType,
        editRoute
    }
}