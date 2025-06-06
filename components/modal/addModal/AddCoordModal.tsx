import Button from "@/components/BaseButton"
import MapDisplay from "@/components/MapDisplay"
import { useTheme } from "@/context/ThemeContext"
import useLocation from "@/hooks/useLocation"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { modalStyles } from "@/src/styles/ModalStyles"
import { AddableCoordModalProp } from "@/src/types/AddableTravels"
import { LocationObject } from "expo-location"
import { useEffect, useRef, useState } from "react"
import { Alert, Modal, Pressable, View } from "react-native"

export default function AddCoordModal({ currentCoordinates, isModalVisible, onClose, onSelect }: AddableCoordModalProp) {
    const { theme } = useTheme()

    const mapRef = useRef(null)

    const { location } = useLocation()
    const [userLocation, setUserLocation] = useState<LocationObject | null>(null)

    useEffect(() => {
        setUserLocation(location)
    }, [location])

    const getInitialCameraState = () => {
        if (currentCoordinates?.lon && currentCoordinates?.lat) {
            return {
                centerCoordinate: [currentCoordinates.lon, currentCoordinates.lat],
                zoomLevel: 15
            }
        } else if (userLocation) {
            return {
                centerCoordinate: [userLocation.coords.longitude, userLocation.coords.latitude],
                zoomLevel: 14
            }
        } else {
            return {
                centerCoordinate: [0, 0],
                zoomLevel: 0
            }
        }
    }

    const { centerCoordinate, zoomLevel } = getInitialCameraState()

    const handleOnSubmit = async () => {
        const currentMapRef = mapRef.current

        if (currentMapRef === null) {
            Alert.alert('MapRef not available', 'There is a problem obtaining current map ref')
            return
        }

        const currentCoordinates = await currentMapRef.getCenter()
        const roundedCoordinate = {
            lon: Number(currentCoordinates[0].toFixed(6)),
            lat: Number(currentCoordinates[1].toFixed(6))
        }

        onSelect(roundedCoordinate)
    }

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
        >
            <Pressable style={modalStyles[theme].modalBackdrop}>
                <View style={[modalStyles[theme].modalContainer, modalStyles[theme].coordModalContainer]} onStartShouldSetResponder={() => true}>
                    <MapDisplay
                        mapRef={mapRef}
                        zoomLevel={zoomLevel}
                        centerCoordinate={centerCoordinate}
                    />

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button.Dismiss label='Cancel' onPress={onClose} />
                        <Button.Add label='Pick Coordinate' onPress={handleOnSubmit} />
                    </View>
                </View>
            </Pressable>
        </Modal>
    )
}