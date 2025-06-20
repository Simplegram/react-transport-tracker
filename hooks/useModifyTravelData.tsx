import { useSupabase } from "@/context/SupabaseContext"
import { AddableDirection, AddableIconType, AddableLap, AddableRoute, AddableStop, AddableTravel, AddableVehicleType } from "@/src/types/AddableTravels"
import { EditableLap, EditableRoute, EditableStop, EditableTravel, EditableVehicleType } from "@/src/types/EditableTravels"
import { IconType } from "@/src/types/Travels"

export default function useModifyTravelData() {
    const { supabaseClient: supabase } = useSupabase()

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

    const addTravel = async (item: AddableTravel, getData: boolean = false) => {
        const { data, error } = await supabase
            .from("travels")
            .insert(item)
            .select()

        if (error) {
            console.log(error)
            return error
        }
        if (getData === true) return data
    }

    const addLaps = async (items: AddableLap[]) => {
        const { error } = await supabase
            .from("laps")
            .insert(items)

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

    const editIcon = async (item: IconType) => {
        const { error } = await supabase
            .from("icons")
            .upsert(item)

        if (error) console.log(error)
    }

    const editTravel = async (item: EditableTravel) => {
        const { error } = await supabase
            .from("travels")
            .upsert(item)

        if (error) console.log(error)
    }

    const editLaps = async (items: EditableLap[]) => {
        const { error } = await supabase
            .from("laps")
            .upsert(items)

        if (error) console.log(error)
    }

    // ---

    const deleteLaps = async (itemIds: number[]) => {
        const response = await supabase
            .from("laps")
            .delete()
            .in('id', itemIds)

        if (response.error) console.log(response)
    }

    return {
        addDirection, editDirection,
        addStop, editStop,
        addIcon, editIcon,
        addVehicleType, editVehicleType,
        addRoute, editRoute,
        addTravel, editTravel,
        addLaps, editLaps, deleteLaps
    }
}