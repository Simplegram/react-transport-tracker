import { useEffect, useState } from "react";

import * as Location from 'expo-location';
import { Alert } from "react-native";

export default function useLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    async function getCurrentLocation() {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Location access denied', 'Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({
            accuracy: Location.LocationAccuracy.Highest
        });
        setLocation(location);
    }

    useEffect(() => {
        getCurrentLocation();
    }, []);

    return {
        location
    }
}