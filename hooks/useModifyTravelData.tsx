import { supabase } from "@/lib/supabase";
import { Direction, IconType, Stop } from "@/src/types/Travels";
import { EditableRoute, EditableStop, EditableVehicleType } from "@/src/types/EditableTravels";
import { AddableDirection, AddableIconType, AddableRoute, AddableStop, AddableVehicleType } from "@/src/types/AddableTravels";

export default function useModifyTravelData() {
    const addDirection = async (item: AddableDirection) => {
        const { error } = await supabase
            .from("directions")
            .upsert(item)

        if (error) console.log(error)
    }

    const addStop = async (item: AddableStop) => {
        const { error } = await supabase
            .from("stops")
            .upsert(item)

        if (error) console.log(error)
    }

    const addRoute = async (item: AddableRoute) => {
        const { error } = await supabase
            .from("routes")
            .upsert(item)

        if (error) console.log(error)
    }

    const addVehicleType = async (item: AddableVehicleType) => {
        const { error } = await supabase
            .from("types")
            .upsert(item)

        if (error) console.log(error)
    }
    
    const addIcon = async (item: AddableIconType) => {
        const { error } = await supabase
            .from("icons")
            .insert(item)

        if (error) console.log(error)
    }

    // ---

    const editDirection = async (item: AddableDirection) => {
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
        addDirection, editDirection,
        addStop, editStop,
        addIcon,
        addVehicleType, editVehicleType,
        addRoute, editRoute
    }
}