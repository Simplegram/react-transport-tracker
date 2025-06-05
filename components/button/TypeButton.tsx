import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { Text, TouchableOpacity } from "react-native"

interface TypeButtonProps {
    onPress: () => void
    label: React.ReactNode
    typeSelected: boolean
}

export default function TypeButton({ label, onPress, typeSelected }: TypeButtonProps) {
    const { theme } = useTheme()

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                travelDetailStyles[theme].detailRow,
                {
                    flex: 1,
                    alignItems: 'center',
                    borderColor: colors.white_500
                },
                typeSelected && { borderColor: colors.white_200 }
            ]}
            onPress={onPress}
        >
            <Text style={[
                inputElementStyles[theme].inputLabel,
                { color: colors.white_500 },
                typeSelected && { color: theme === 'light' ? colors.white : colors.white_200 }
            ]}>{label}</Text>
        </TouchableOpacity>
    )
}