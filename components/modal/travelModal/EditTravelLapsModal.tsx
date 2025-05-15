import Button from '@/components/BaseButton';
import LoadingScreen from '@/components/LoadingScreen';
import { colors } from '@/const/color';
import useGetTravelData from '@/hooks/useGetTravelData';
import useStopModal from '@/hooks/useStopModal';
import { AddableLap } from '@/src/types/AddableTravels';
import { EditableLap, EditableLapsModalProp } from '@/src/types/EditableTravels';
// import { EditableLapsModalProp } from '@/src/types/EditableTravels';
import { formatDateForDisplay } from '@/src/utils/utils';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    ScrollView,
} from 'react-native';
import AddLapModal from '../addModal/AddLapModal';

export default function EditTravelLapsModal({ travel_id, currentLaps, isModalVisible, onClose, onSelect }: EditableLapsModalProp) {
    const { stops } = useGetTravelData()

    const {
        showStopModal: showLapModal,
        openStopModal: openLapModal,
        closeStopModal: closeLapModal
    } = useStopModal();

    const [laps, setLaps] = useState<EditableLap[]>([])

    const handleOnSubmit = () => {
        onSelect(laps);
    };

    const handleLapAdd = (lap: AddableLap) => {
        if (laps) setLaps([...laps, lap])

        closeLapModal()
    }

    useEffect(() => {
        setLaps(currentLaps)
    }, [currentLaps])

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    <View style={styles.inputContainer}>
                        {laps.length === 0 ? (
                            <View style={styles.emptyList}>
                                <Text style={styles.label}>No lap found.</Text>
                            </View>
                        ) : (
                            <ScrollView 
                                contentContainerStyle={{
                                    gap: 10,
                                }}
                            >
                                {laps.map((lap: EditableLap, index) => (
                                    <View key={index} style={styles.detailRow}>
                                        <Text style={styles.label}>{formatDateForDisplay(lap.time)}</Text>
                                        <Text style={[styles.label, {color: colors.appBlue}]}>{stops.find(stop => stop.id === lap.stop_id)?.name}</Text>
                                        <Text style={styles.label}>{lap.note}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                    
                    <View style={{paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
                        <Button title='Add lap' color={colors.appBlue} onPress={openLapModal} style={addButtonStyles.buttonContainer} textStyle={addButtonStyles.plusText}></Button>
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' color='#ffffff' onPress={onClose} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Save Laps' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </View>
                <AddLapModal 
                    travel_id={travel_id}
                    isModalVisible={showLapModal}
                    onSelect={handleLapAdd}
                    onClose={closeLapModal}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        height: 550,
        marginTop: 'auto',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#fff',
    },
    emptyList: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        flexShrink: 0,
    },
    inputContainer: {
        flex: 1,
        gap: 10,
        flexDirection: 'column',
        paddingVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputGroup: {
        gap: 5,
    },
    detailRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderRadius: 10,
        gap: 5,
    },
});

const addButtonStyles = StyleSheet.create({
    buttonContainer: {
        borderColor: 'black',
        borderRadius: 10,
    },
    plusText: {
        color: 'white',
        fontWeight: 'bold',
    },
})

const buttonStyles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        gap: 10,
    },
    addButton: {
        backgroundColor: '#1E88E5',
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        borderWidth: 1,
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
})