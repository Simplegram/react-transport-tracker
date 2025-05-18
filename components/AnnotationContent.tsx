import { StyleSheet } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface AnnotationContentProps {
    stop_id: string
    title: string
}

export default function AnnotationContent({ stop_id, title }: AnnotationContentProps) {
    return (
        <TouchableOpacity style={styles.touchableContainer}>
            <View style={[styles.marker, { backgroundColor: stop_id === "stop" ? 'limegreen' : 'yellow'}]} />
            <Text style={styles.title}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchableContainer: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    marker: {
        width: 12,
        aspectRatio: 1,
        borderWidth: 2,
        borderRadius: 8
    },
    title: {
        fontSize: 8,
        textAlign: 'center',
        fontWeight: 'bold'
    },
});