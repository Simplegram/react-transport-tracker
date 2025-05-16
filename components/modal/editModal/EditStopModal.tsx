import Button from "@/components/BaseButton";
import { useModalContext } from "@/context/ModalContext";
import useGetTravelData from "@/hooks/useGetTravelData";
import { useLoading } from "@/hooks/useLoading";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { inputStyles } from "@/src/styles/Styles"
import { EditableStop } from "@/src/types/EditableTravels";
import { BaseModalContentProps } from "@/src/types/ModalContentProps";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function EditStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { modalData: data } = useModalContext()

    const { fullVehicleTypes } = useGetTravelData()
    const [stop, setStop] = useState<EditableStop>({ ...data, vehicle_type: data.vehicle_type?.id })

    const { loading } = useLoading()

    const handleOnSubmit = () => {
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
                            style={inputStyles.pressableInput}
                            placeholder="Stop name..."
                            value={stop.name}
                            onChangeText={text => (setStop({ ...stop, "name": text }))}
                        />
                        <Text style={styles.label}>Latitude:</Text>
                        <TextInput
                            style={inputStyles.pressableInput}
                            placeholder="Stop latitude..."
                            value={stop.lat?.toString()}
                            onChangeText={text => (setStop({ ...stop, "lat": Number(text) }))}
                        />
                        <Text style={styles.label}>Longitude:</Text>
                        <TextInput
                            style={inputStyles.pressableInput}
                            placeholder="Stop longitude..."
                            value={stop.lon?.toString()}
                            onChangeText={text => (setStop({ ...stop, "lon": Number(text) }))}
                        />
                        <Text style={styles.label}>Alternative name:</Text>
                        <TextInput
                            style={inputStyles.pressableInput}
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
                        <Button title='Edit Stop' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
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