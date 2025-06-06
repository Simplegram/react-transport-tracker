import Button from "@/components/BaseButton"
import { TextInputBlock } from "@/components/input/TextInput"
import { useTheme } from "@/context/ThemeContext"
import { useLoading } from "@/hooks/useLoading"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { iconPickerStyles, inputElementStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { AddableVehicleType } from "@/src/types/AddableTravels"
import { VehicleTypeModalProp } from "@/src/types/TravelModal"
import { useState } from "react"
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function AddVehicleTypeModal({ icons, onSubmit, onCancel }: VehicleTypeModalProp) {
    const { theme } = useTheme()

    const { loading } = useLoading()

    const [vehicleType, setVehicleType] = useState<AddableVehicleType>({ "name": undefined, "icon_id": undefined })

    const handleOnSubmit = () => {
        if (!vehicleType.name || !vehicleType.icon_id) {
            Alert.alert('Input Required', 'Please enter a type name and choose an icon.')
            return
        }

        onSubmit(vehicleType)
    }

    return (
        <View>
            {(loading || !icons || icons.length === 0) ? (
                <Text style={inputElementStyles[theme].inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles[theme].inputContainer}>
                        <TextInputBlock
                            label="Name:"
                            value={vehicleType.name}
                            placeholder="e.g., Standard Bus"
                            onChangeText={(text) => setVehicleType({ ...vehicleType, "name": text })}
                        />

                        <View style={inputElementStyles[theme].inputGroup}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={inputElementStyles[theme].inputLabel}>Icon:</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {icons.map((icon) => (
                                        <TouchableOpacity
                                            key={icon.id}
                                            style={[
                                                iconPickerStyles[theme].iconContainer,
                                                vehicleType.icon_id === icon.id && iconPickerStyles[theme].selectedIconContainer,
                                            ]}
                                            onPress={() => setVehicleType({ ...vehicleType, "icon_id": icon.id })}
                                        >
                                            <Icon
                                                style={
                                                    vehicleType.icon_id === icon.id ?
                                                        iconPickerStyles[theme].selectedIcon
                                                        :
                                                        styles[theme].icon
                                                }
                                                name={icon.name}
                                                size={20}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Add Type' onPress={handleOnSubmit} />
                    </View>
                </>
            )}
        </View>
    )
}