import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { PropsWithChildren, useEffect, useState } from "react"
import { Keyboard, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native"

interface TravelHeaderProps {
    index: number
    directionNameKey: string
    directionNamesLength: number
    onPress: (key: string) => void
}

export function EmptyHeaderComponent({ children }: PropsWithChildren) {
    const { height, width } = useWindowDimensions()

    const [keyboardShown, setKeyboardShown] = useState<boolean>(false)

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardShown(true)
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardShown(false)
        })

        return () => {
            showSubscription.remove()
            hideSubscription.remove()
        }
    }, [])

    const minMaxHeight = width < height ? height * 0.3 : 0
    const minHeight = width < height ? height * 0.15 : 0

    return (
        <View style={{
            flex: 1,
            height: keyboardShown ? minHeight : minMaxHeight,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {children}
        </View>
    )
}

export function Header({ index, directionNameKey, directionNamesLength, onPress }: TravelHeaderProps) {
    const { theme } = useTheme()

    return (
        <Pressable
            onPress={() => onPress(directionNameKey)}
            style={{
                gap: 5,
                paddingVertical: 10,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={styles[theme].title}>
                Direction ({index + 1}/{directionNamesLength}):
            </Text>
            <Text style={styles[theme].label}>
                {directionNameKey}
            </Text>
        </Pressable>
    )
}

const lightStyles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2c3e50'
    },
})

const styles = {
    light: { ...lightStyles, label: lightStyles.title },
    dark: StyleSheet.create({
        title: {
            ...lightStyles.title,
            color: colors.white_300,
        },
        label: {
            ...lightStyles.title,
            color: colors.white_100,
        },
    })
}