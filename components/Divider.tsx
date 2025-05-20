import { StyleSheet, View } from "react-native";

export default function Divider() {
    return (
        <View style={styles.divider}/>
    )
}

const styles = StyleSheet.create({
    divider: {
        paddingTop: 5,
        marginBottom: 5,
        borderBottomWidth: 1,
    }
})