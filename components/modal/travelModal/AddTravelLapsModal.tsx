import Button from '@/components/BaseButton';
import { colors } from '@/const/color';
import useGetTravelData from '@/hooks/useGetTravelData';
import { AddableLap, AddableLapsModalProp } from '@/src/types/AddableTravels';
import { formatDateForDisplay } from '@/src/utils/utils';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
} from 'react-native';
import AddLapModal from '../addModal/AddLapModal';
import useStopModal from '@/hooks/useStopModal';
import EditLapModal from '../editModal/EditLapModal';
import { Pressable } from 'react-native';
import { buttonStyles } from '@/src/styles/ButtonStyles';
import { inputElementStyles } from '@/src/styles/InputStyles';

export default function AddTravelLapsModal({ currentLaps, isModalVisible, onClose, onSelect }: AddableLapsModalProp) {
    const { stops } = useGetTravelData()

    const {
        showStopModal: showLapModal,
        openStopModal: openLapModal,
        closeStopModal: closeLapModal
    } = useStopModal();

    const {
        showStopModal: showEditLapModal,
        openStopModal: openEditLapModal,
        closeStopModal: closeEditLapModal
    } = useStopModal();

    const [laps, setLaps] = useState<AddableLap[]>([])
    const [selectedLap, setSelectedLap] = useState<AddableLap | undefined>(undefined)

    const handleOnSubmit = () => {
        onSelect(laps);
    };

    const handleLapSelect = (lap: AddableLap) => {
        setSelectedLap(lap)
        openEditLapModal()
    }

    const handleLapAdd = (lap: AddableLap) => {
        if (laps) setLaps([...laps, lap])

        closeLapModal()
    }

    const handleLapEdit = (lap: AddableLap) => {
        const updatedLaps = laps.map(item => {
            if (item.time === lap.time) {
                return lap;
            }
            return item;
        });

        setLaps(updatedLaps)
        closeEditLapModal()
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
                <View style={[styles.modalContainer, inputElementStyles.inputContainer]}>
                    <View style={styles.inputContainer}>
                        {laps.length === 0 ? (
                            <View style={styles.emptyList}>
                                <Text style={inputElementStyles.inputLabel}>No lap found</Text>
                            </View>
                        ) : (
                            <ScrollView
                                contentContainerStyle={{
                                    gap: 10,
                                }}
                            >
                                {laps.map((lap: AddableLap, index) => (
                                    <Pressable key={index} style={styles.detailRow} onPress={() => handleLapSelect(lap)}>
                                        <Text style={styles.label}>{formatDateForDisplay(lap.time)}</Text>
                                        <Text style={[styles.label, { color: colors.appBlue }]}>{stops.find(stop => stop.id === lap.stop_id)?.name}</Text>
                                        <Text style={styles.label}>{lap.note}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={{ paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <Button title='Add lap' color={colors.appBlue} onPress={openLapModal} style={addButtonStyles.buttonContainer} textStyle={addButtonStyles.plusText}></Button>
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' onPress={onClose} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Save Laps' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </View>

                <EditLapModal
                    selectedLap={selectedLap}
                    isModalVisible={showEditLapModal}
                    onSelect={handleLapEdit}
                    onClose={closeEditLapModal}
                />

                <AddLapModal
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
        fontSize: 16,
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