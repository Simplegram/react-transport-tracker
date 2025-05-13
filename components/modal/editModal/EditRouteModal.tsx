import Button from "@/components/BaseButton"
import { useModalContext } from "@/context/ModalContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { EditableRoute } from "@/src/types/EditableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useRef, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import EditTravelStopModal from "./EditTravelStopModal"
import useStopModal from "@/hooks/useStopModal"
import { sortByIdToFront } from "@/src/utils/utils"
import useLoading from "@/hooks/useLoading"


export default function EditRouteModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { modalData: data } = useModalContext()

    const { stops, fullVehicleTypes } = useGetTravelData()

    const {
        showStopModal,
        editingStopField,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal();

    const [route, setRoute] = useState<EditableRoute>({
        ...data,
        'first_stop_id': data.first_stop_id.id,
        'last_stop_id': data.last_stop_id.id,
        'vehicle_type_id': data.vehicle_type_id.id
    })

    const savedVehicleTypeId = useRef(route.vehicle_type_id)

    const { loading } = useLoading()

    const handleOnSubmit = () => {
        onSubmit(route);
    };

    const handleStopSelect = (stopId: number) => {
        if (!editingStopField) {
            return
        }
        
        setRoute({ ...route, [editingStopField]: stopId })
        closeStopModal();
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.label}>Loading...</Text>
            ) : (
                <>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Code:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Route code..."
                            value={route.code}
                            onChangeText={text => (setRoute({ ...route, "code": text }))}
                        />
                        <Text style={styles.label}>Name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Route name..."
                            value={route.name}
                            onChangeText={text => (setRoute({ ...route, "name": text }))}
                        />

                        <Text style={styles.label}>First Stop:</Text>
                        <Pressable
                            style={styles.pressableInput}
                            onPress={() => openStopModal('first_stop_id')}>
                            <Text style={[styles.label, { marginBottom: 0 }]}>{stops.find(item => item.id === route.first_stop_id)?.name || 'Select First Stop'}</Text>
                        </Pressable>

                        <Text style={styles.label}>Last Stop:</Text>
                        <Pressable
                            style={styles.pressableInput}
                            onPress={() => openStopModal('last_stop_id')}>
                            <Text style={[styles.label, { marginBottom: 0 }]}>{stops.find(item => item.id === route.last_stop_id)?.name || 'Select Last Stop'}</Text>
                        </Pressable>

                        <View style={{
                            flexDirection: 'column',
                        }}>
                            <Text style={styles.label}>Type:</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.iconScrollView}
                                keyboardShouldPersistTaps={"always"}
                            >
                                {sortByIdToFront(fullVehicleTypes, savedVehicleTypeId.current).map((type) => (
                                    <TouchableOpacity
                                        key={type.id}
                                        style={[
                                            styles.iconContainer,
                                            route.vehicle_type_id === type.id && styles.selectedIconContainer,
                                        ]}
                                        onPress={() => setRoute({ ...route, vehicle_type_id: type.id })}
                                    >
                                        <Icon name={type.icon_id.name} size={20}></Icon>
                                        <Text style={styles.label}>{type.name.slice(0, 5)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <EditTravelStopModal
                            isModalVisible={showStopModal}
                            searchQuery={stopSearchQuery}
                            setSearchQuery={setStopSearchQuery}
                            onSelect={handleStopSelect}
                            onClose={closeStopModal}
                        />
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Edit Route' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    inputContainer: {
        gap: 10,
        flexDirection: 'column',
        paddingVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingBottom: 12,
        fontSize: 16,
    },
    iconScrollView: {
        marginBottom: 20,
    },
    iconContainer: {
        width: 75,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingTop: 10,
        flexDirection: 'column',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIconContainer: {
        borderColor: '#0284f5',
        backgroundColor: '#e3f2fd',
    },
    pressableInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 12,
        justifyContent: 'center',
        minHeight: 44,
        backgroundColor: '#fff',
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
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
})