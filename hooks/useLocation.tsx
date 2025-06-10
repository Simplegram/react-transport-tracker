import { useDialog } from "@/context/DialogContext"
import * as Location from 'expo-location'
import { useEffect, useState } from "react"

export default function useLocation() {
    const { dialog } = useDialog()

    const [location, setLocation] = useState<Location.LocationObject | null>()

    async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            dialog('Location access denied', 'Permission to access location was denied')
            setLocation(null)
            return
        }

        let location = await Location.getCurrentPositionAsync({
            accuracy: Location.LocationAccuracy.Highest
        })
        setLocation(location)
    }

    const refetchLocation = () => {
        getCurrentLocation()
    }

    useEffect(() => {
        getCurrentLocation()
    }, [])

    return {
        location, refetchLocation
    }
}