import Button from "@/components/BaseButton"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import modalStyles from "@/src/styles/ModalStyles"
import { AddableStop } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function AddStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { loading } = useLoading()

    const { fullVehicleTypes } = useGetTravelData()

    const [stop, setStop] = useState<AddableStop>({
        name: undefined,
        lat: null,
        lon: null,
        name_alt: null,
        vehicle_type: undefined
    })

    const handleOnSubmit = () => {
        if (!stop.name?.trim() || !stop.vehicle_type) {
            Alert.alert('Input Required', 'Please enter a stop name and choose a vehicle type.');
            return
        }

        onSubmit(stop);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.label}>Loading...</Text>
            ) : (
                <>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name:</Text>
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Stop name..."
                            value={stop.name}
                            onChangeText={text => (setStop({ ...stop, "name": text }))}
                        />
                        <Text style={styles.label}>Latitude:</Text>
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Stop latitude..."
                            value={stop.lat}
                            onChangeText={text => (setStop({ ...stop, "lat": Number(text) }))}
                        />
                        <Text style={styles.label}>Longitude:</Text>
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Stop longitude..."
                            value={stop.lon}
                            onChangeText={text => (setStop({ ...stop, "lon": Number(text) }))}
                        />
                        <Text style={styles.label}>Alternative name:</Text>
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Alternative name..."
                            value={stop.name_alt}
                            onChangeText={text => (setStop({ ...stop, "name_alt": text }))}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'column',
                    }}>
                        <Text style={styles.label}>Icon:</Text>
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
                                        stop.vehicle_type === type.id && styles.selectedIconContainer,
                                    ]}
                                    onPress={() => setStop({ ...stop, vehicle_type: type.id })}
                                >
                                    <Icon name={type.icon_id.name} size={20}></Icon>
                                    <Text style={styles.label}>{type.name.slice(0, 5)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Add Stop' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8
    },
    inputContainer: {
        gap: 10,
        flexDirection: 'column',
        paddingVertical: 10,
    },
    icon: {
        paddingLeft: 5,
        alignItems: 'center',
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
        marginRight: 10, // Space between icons
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIconContainer: {
        borderColor: '#0284f5', // Highlight selected icon
        backgroundColor: '#e3f2fd', // Light background for selected
    },
    stopListItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    emptyList: {
        padding: 20,
        alignItems: 'center',
    }
});

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