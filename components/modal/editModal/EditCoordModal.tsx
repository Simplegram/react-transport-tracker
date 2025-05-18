import Button from "@/components/BaseButton";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles";
import { modalStyles } from "@/src/styles/ModalStyles";
import { AddableCoordModalProp } from "@/src/types/AddableTravels";
import { Camera, MapView } from "@maplibre/maplibre-react-native";
import { useRef, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text } from "react-native";
import { View } from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

const pointSize = {
    width: 8,
    height: 8
}

export default function EditCoordModal({ currentCoordinates, isModalVisible, onClose, onSelect }: AddableCoordModalProp) {
    const mapRef = useRef(null)

    const handleOnSubmit = async () => {
        const centerCoordinate = await mapRef.current?.getCenter()
        const roundedCoordinate = {
            lon: Number(centerCoordinate[0].toFixed(6)),
            lat: Number(centerCoordinate[1].toFixed(6))
        };

        onSelect(roundedCoordinate);
    };

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={modalStyles.modalBackdrop}>
                <View style={[modalStyles.modalContainer, modalStyles.coordModalContainer]}>
                    <View style={[inputElementStyles.inputGroup, { flex: 1 }]}>
                        <MapView
                            ref={mapRef}
                            style={{ flex: 1 }}
                            rotateEnabled={false}
                            mapStyle={process.env.EXPO_PUBLIC_MAP_STYLE}
                        />
                        <View style={styles.container}>
                            <View style={styles.point} />
                        </View>
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' onPress={onClose} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Add Direction' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
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