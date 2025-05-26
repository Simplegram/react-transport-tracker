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
                name="datalist"
            />
            <Stack.Screen
                name="settings"
            />
        </Stack>
    )
}