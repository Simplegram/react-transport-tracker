import { TravelProvider } from "@/context/PageContext"
import { Stack } from "expo-router"

export default function Layout() {
    return (
        <TravelProvider>
            <Stack screenOptions={{
                headerShown: false,
                animation: "ios_from_right",
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
        </TravelProvider>
    )
}