import { View } from "react-native"
import CustomSwitch from "./CustomSwitch"
import Input from "./Input"

interface SwitcherProps {
    title?: string
    onPress: () => void
    overrideIsEnabled?: boolean
    children?: string
}

export default function Switcher({ title, onPress, overrideIsEnabled, children }: SwitcherProps) {
    return (
        <View style={{
            height: 30,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <Input.Label>{title ? title : children}</Input.Label>
            <CustomSwitch onPress={onPress} overrideIsEnabled={overrideIsEnabled} />
        </View>
    )
}