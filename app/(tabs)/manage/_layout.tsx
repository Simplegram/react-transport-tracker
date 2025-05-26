import { Stack } from "expo-router"

export default function Layout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            animation: "ios_from_right",
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