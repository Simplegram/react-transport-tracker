import { useTheme } from '@/context/ThemeContext'
import { loadingStyles } from '@/src/styles/LoadingScreenStyles'
import React from 'react'
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    View
} from 'react-native'

type Props = {
    text?: String
}

export default function LoadingScreen({ text = "Loading..." }: Props) {
    const { theme } = useTheme()

    return (
        <Modal transparent animationType="fade" visible={true}>
            <View style={loadingStyles[theme].modalOverlay}>
                <View style={loadingStyles[theme].modalContent}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={loadingStyles[theme].loadingText}>{text}</Text>
                </View>
            </View>
        </Modal>
    )
};

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    modalOverlay: {
        width: width,
        height: height,
        flex: 1,
        position: "absolute",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
})