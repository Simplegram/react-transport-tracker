import { AddableRoute } from "@/src/types/AddableTravels"
import { useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import EditTravelStopModal from "../travelModal/EditTravelStopModal"
import Button from "@/components/BaseButton"
import Icon from 'react-native-vector-icons/FontAwesome6'
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import useStopModal from "@/hooks/useStopModal"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputStyles } from "@/src/styles/Styles"

export default function AddRouteModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { stops, fullVehicleTypes } = useGetTravelData()

    const { loading } = useLoading()

    const {
        showStopModal,
        editingStopField,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal();

    const [route, setRoute] = useState<AddableRoute>({
        code: undefined,
        first_stop_id: undefined,
        last_stop_id: undefined,
        name: undefined,
        vehicle_type_id: undefined
    })

    const handleStopSelect = (stopId: number) => {
        if (!editingStopField) {
            return
        }

        setRoute({ ...route, [editingStopField]: stopId })
        closeStopModal();
    };

    const handleOnSubmit = () => {
        onSubmit(route);
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
                            style={inputStyles.pressableInput}
                            placeholder="Route code..."
                            value={route.code}
                            onChangeText={text => (setRoute({ ...route, "code": text }))}
                        />
                        <Text style={styles.label}>Name:</Text>
                        <TextInput
                            style={inputStyles.pressableInput}
                            placeholder="Route name..."
                            value={route.name}
                            onChangeText={text => (setRoute({ ...route, "name": text }))}
                        />

                        <Text style={styles.label}>First Stop:</Text>
                        <Pressable
                            style={inputStyles.pressableInput}
                            onPress={() => openStopModal('first_stop_id')}>
                            <Text style={[styles.label, { marginBottom: 0 }]}>{stops.find(item => item.id === route.first_stop_id)?.name || 'Select First Stop'}</Text>
                        </Pressable>

                        <Text style={styles.label}>Last Stop:</Text>
                        <Pressable
                            style={inputStyles.pressableInput}
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
                                {fullVehicleTypes.map((type) => (
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
                        <Button title='Add Route' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
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
})