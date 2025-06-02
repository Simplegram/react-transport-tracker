import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { useRef } from "react"
import { Animated, Easing, EasingFunction, Text, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

interface DataButtonProps {
    label: string
    iconName: string
    onPress: () => void
}

export default function DataButton({ label, iconName, onPress }: DataButtonProps) {
    const { theme } = useTheme()

    const itemScale = useRef(new Animated.Value(1)).current
    const itemScaleAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(itemScale, {
            toValue,
            duration: 100,
            easing,
            useNativeDriver: true,
        }).start()
    }

    const backgroundScale = useRef(new Animated.Value(0)).current
    const backgroundScaleAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(backgroundScale, {
            toValue,
            duration: 100,
            easing,
            useNativeDriver: true,
        }).start()
    }

    const onPressIn = () => {
        itemScaleAnimation(0.9, Easing.bounce)
        backgroundScaleAnimation(1, Easing.bounce)
    }

    const onPressOut = () => {
        itemScaleAnimation(1, Easing.bounce)
        backgroundScaleAnimation(0, Easing.bounce)
    }

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[buttonStyles[theme].addButton, { justifyContent: 'center', overflow: 'hidden' }]}
            onPress={onPress}
        >
            <Animated.View style={{
                gap: 5,
                alignItems: 'center',
                transform: [{ scale: itemScale }],
            }}>
                <Icon name={iconName} color={colors.white} size={24}></Icon>
                <Text style={buttonStyles[theme].addButtonText}>{label}</Text>
            </Animated.View>
            <Animated.View
                style={{
                    flex: 1,
                    position: 'absolute',
                    backgroundColor: theme === 'light' ? colors.black : colors.white_900,
                    borderRadius: 50,
                    width: 80,
                    height: 80,
                    zIndex: -1,
                    opacity: theme === 'light' ? 0.2 : 1,
                    transform: [{ scale: backgroundScale }],
                }}
            />
        </TouchableOpacity>
    )
}