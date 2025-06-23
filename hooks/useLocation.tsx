import { useDialog } from "@/context/DialogContext"
import * as Location from 'expo-location'
import { useCallback, useEffect, useRef, useState } from "react" // Added useCallback and useRef

const WARM_UP_DURATION_MS = 10000

export default function useLocation() {
    const { dialog } = useDialog()

    const [location, setLocation] = useState<Location.LocationObject | null>(null)

    const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false)

    const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false)

    const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null)

    const warmUpTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

    const stopLocationWatch = useCallback(async () => {
        if (locationSubscriptionRef.current) {
            console.log('Stopping warm-up location watch.')
            locationSubscriptionRef.current.remove() // This removes the listener
            locationSubscriptionRef.current = null
        }
    }, [])

    const getCurrentLocation = useCallback(async () => {
        setIsLoadingLocation(true)

        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            dialog('Location access denied', 'Permission to access location was denied.')
            setHasLocationPermission(false)
            setIsLoadingLocation(false)
            return
        }
        setHasLocationPermission(true)

        await stopLocationWatch()

        try {
            console.log('Getting current location with high accuracy...')
            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.LocationAccuracy.Highest
            })
            setLocation(currentLocation)
            console.log('Current location obtained:', currentLocation.coords.latitude)
        } catch (error) {
            console.error('Error getting current location:', error)
            dialog('Error', 'Could not retrieve location. Please try again.')
            setLocation(null)
        } finally {
            setIsLoadingLocation(false)
        }
    }, [dialog, stopLocationWatch])

    useEffect(() => {
        const warmUpAndStop = async () => {
            console.log('Starting location warm-up sequence...')
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                console.warn('Location warm-up skipped: Permissions not granted.')
                setHasLocationPermission(false)
                return
            }
            setHasLocationPermission(true)

            try {
                console.log('Starting low-accuracy watch for warm-up...')
                locationSubscriptionRef.current = await Location.watchPositionAsync(
                    { accuracy: Location.LocationAccuracy.Low },
                    (loc) => { }
                )

                warmUpTimeoutIdRef.current = setTimeout(async () => {
                    await stopLocationWatch()
                    console.log(`Warm-up watch stopped after ${WARM_UP_DURATION_MS / 1000} seconds.`)
                }, WARM_UP_DURATION_MS)

            } catch (error) {
                console.error('Error during location warm-up:', error)
            }
        }

        warmUpAndStop()

        return () => {
            console.log('Cleaning up location hook: Clearing timeout and stopping watch.')
            if (warmUpTimeoutIdRef.current) {
                clearTimeout(warmUpTimeoutIdRef.current)
                warmUpTimeoutIdRef.current = null
            }
            stopLocationWatch()
        }
    }, [stopLocationWatch])

    const refetchLocation = useCallback(() => {
        getCurrentLocation()
    }, [getCurrentLocation])

    return {
        location,
        refetchLocation,
        isLoadingLocation, // Expose loading state for UI
        hasLocationPermission // Expose permission state for UI
    }
}