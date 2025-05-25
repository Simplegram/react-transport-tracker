import { useEffect, useState } from "react"

import * as Location from 'expo-location'
import { Alert } from "react-native"

export default function useLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>()

    async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Location access denied', 'Permission to access location was denied')
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