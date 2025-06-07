import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { TouchableOpacity } from "react-native"
import InputGroup from "../input/Input"

interface TypeButtonProps {
    onPress: () => void
    label: React.ReactNode
    typeSelected: boolean
}

export default function TypeButton({ label, onPress, typeSelected }: TypeButtonProps) {
    const { theme: oldTheme, getTheme } = useTheme()
    const theme = getTheme()

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                travelDetailStyles[oldTheme].detailRow,
                {
                    flex: 1,
                    alignItems: 'center',
                    borderColor: colors.white_500
                },
                typeSelected && { borderColor: oldTheme === 'light' ? colors.black : colors.white_200 }
            ]}
            onPress={onPress}
        >
            <InputGroup.Label
                style={[{ color: colors.white_500 }, typeSelected && { color: oldTheme === 'light' ? colors.black : colors.white_200 }]}
            >{label}</InputGroup.Label>
        </TouchableOpacity>
    )
}