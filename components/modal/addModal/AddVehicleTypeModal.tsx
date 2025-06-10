import Button from "@/components/button/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { IconSelector } from "@/components/input/VehicleSelector"
import { useTheme } from "@/context/ThemeContext"
import { useLoading } from "@/hooks/useLoading"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { AddableVehicleType } from "@/src/types/AddableTravels"
import { VehicleTypeModalProp } from "@/src/types/TravelModal"
import { useState } from "react"
import { Alert, ScrollView, View } from "react-native"

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
                <Input.LoadingLabel />
            ) : (
                <>
                    <Input.Container>
                        <TextInputBlock
                            label="Name:"
                            value={vehicleType.name}
                            placeholder="e.g., Standard Bus"
                            onChangeText={(text) => setVehicleType({ ...vehicleType, "name": text })}
                            onClear={() => setVehicleType({ ...vehicleType, "name": '' })}
                        />

                        <View style={inputElementStyles[theme].inputGroup}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Input.Label>Icon:</Input.Label>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {icons.map((icon) => (
                                        <IconSelector
                                            key={icon.id}
                                            icon={icon}
                                            condition={vehicleType.icon_id === icon.id}
                                            onPress={() => setVehicleType({ ...vehicleType, "icon_id": icon.id })}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Input.Container>

                    <Button.Row>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Add Type' onPress={handleOnSubmit} />
                    </Button.Row>
                </>
            )}
        </View>
    )
}