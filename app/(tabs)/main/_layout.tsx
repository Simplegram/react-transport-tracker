import { Stack } from "expo-router"

export default function ManageLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen
                name="index"
            />
            <Stack.Screen
                name="editTravel"
            />
            <Stack.Screen
                name="travelDetail"
            />
        </Stack>
    )
}