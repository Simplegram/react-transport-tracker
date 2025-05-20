import Button from "@/components/BaseButton";
import useLocation from "@/hooks/useLocation";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { inputElementStyles } from "@/src/styles/InputStyles";
import { modalStyles } from "@/src/styles/ModalStyles";
import { AddableCoordModalProp } from "@/src/types/AddableTravels";
import { MapView, Camera } from "@maplibre/maplibre-react-native";
import { LocationObject } from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text } from "react-native";
import { View } from "react-native";

const pointSize = {
    width: 8,
    height: 8
}

export default function AddCoordModal({ currentCoordinates, isModalVisible, onClose, onSelect }: AddableCoordModalProp) {
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
            };
        } else if (userLocation) {
            return {
                centerCoordinate: [userLocation.coords.longitude, userLocation.coords.latitude],
                zoomLevel: 14
            };
        } else {
            return {
                centerCoordinate: [0, 0],
                zoomLevel: 0
            };
        }
    };

    const { centerCoordinate, zoomLevel } = getInitialCameraState();

    const handleOnSubmit = async () => {
        const currentMapRef = mapRef.current

        if (currentMapRef === null) {
            Alert.alert('MapRef not available', 'There is a problem obtaining current map ref');
            return
        }

        const currentCoordinates = await currentMapRef.getCenter()
        const roundedCoordinate = {
            lon: Number(currentCoordinates[0].toFixed(6)),
            lat: Number(currentCoordinates[1].toFixed(6))
        };

        onSelect(roundedCoordinate);
    };

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
        >
            <Pressable style={modalStyles.modalBackdrop}>
                <View style={[modalStyles.modalContainer, modalStyles.coordModalContainer]} onStartShouldSetResponder={() => true}>
                    <View style={[inputElementStyles['light'].inputGroup, { flex: 1 }]}>
                        <MapView
                            ref={mapRef}
                            style={{ flex: 1 }}
                            rotateEnabled={false}
                            mapStyle={process.env.EXPO_PUBLIC_MAP_STYLE}
                        >
                            <Camera
                                zoomLevel={zoomLevel}
                                centerCoordinate={centerCoordinate}
                            />
                        </MapView>
                        <View style={styles.container}>
                            <View style={styles.point} />
                        </View>
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' onPress={onClose} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Pick Coordinate' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'box-none',
    },
    point: {
        width: pointSize.width,
        height: pointSize.height,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: 'red',
    },
})