import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { hexToRgbA } from "@/src/utils/colorUtils"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing, EasingFunction, StyleSheet, TouchableOpacity, Vibration } from "react-native"

interface SwitchProps {
    onPress: () => void
    overrideIsEnabled?: boolean
}

export default function CustomSwitch({ onPress, overrideIsEnabled }: SwitchProps) {
    const { theme } = useTheme()

    const [isEnabled, setIsEnabled] = useState(false)

    useEffect(() => {
        if (overrideIsEnabled) setIsEnabled(overrideIsEnabled)
    }, [overrideIsEnabled])

    const ballTranslateX = useRef(new Animated.Value(overrideIsEnabled ? 1 : 0)).current
    const ballMovingAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(ballTranslateX, {
            toValue,
            duration: 150,
            easing,
            useNativeDriver: true,
        }).start()
    }
    const ballTranslate = ballTranslateX.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
    })

    const ballScale = useRef(new Animated.Value(overrideIsEnabled ? 1 : 0)).current
    const ballScaleAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(ballScale, {
            toValue,
            duration: 125,
            easing,
            useNativeDriver: true,
        }).start()
    }
    const ballScaleTranslate = ballScale.interpolate({
        inputRange: [0, 0.1, 0.9, 1],
        outputRange: [1, 0.7, 0.7, 1]
    })

    const trackColor = theme === 'light' ? colors.appBlue : colors.dimAppBlue
    const ballColor = theme === 'light' ? colors.dimWhite : colors.dimWhite2

    const colorTransition = useRef(new Animated.Value(overrideIsEnabled ? 1 : 0)).current
    const colorAnimation = (toValue: number, easing: EasingFunction) => {
        Animated.timing(colorTransition, {
            toValue,
            duration: 350,
            easing,
            useNativeDriver: true,
        }).start()
    }
    const colorValue = ballScale.interpolate({
        inputRange: [0, 1],
        outputRange: [hexToRgbA('#767577'), hexToRgbA(trackColor)]
    })

    const onChangeHandler = () => {
        const newValue = !isEnabled
        setIsEnabled(newValue)

        ballMovingAnimation(newValue ? 1 : 0, Easing.bezier(0, .54, .47, .71))
        ballScaleAnimation(newValue ? 1 : 0, Easing.bezier(0, .54, .47, .71))
        colorAnimation(newValue ? 1 : 0, Easing.bounce)
        Vibration.vibrate(5)

        onPress()
    }

    return (
        <TouchableOpacity
            style={[styles.switchContainer, { backgroundColor: colorValue }]}
            onPress={onChangeHandler}
            activeOpacity={1}
        >
            <Animated.View
                style={[
                    styles.switchThumb,
                    {
                        transform: [{ translateX: ballTranslate }, { scale: ballScaleTranslate }],
                        backgroundColor: ballColor,
                    },
                ]}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    switchContainer: {
        width: 45,
        height: 23,
        borderRadius: 18,
        padding: 3,
        justifyContent: "center",
    },
    switchThumb: {
        width: 19,
        height: 19,
        borderRadius: 20,
    },
})
