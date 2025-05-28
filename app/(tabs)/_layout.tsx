import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { statusBarStyles } from "@/src/styles/Styles"
import { Tabs, usePathname } from "expo-router"
import { StatusBar } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

const TabsLayout = () => {
    const { theme } = useTheme()

    const barColor = theme === 'light' ? colors.dimWhite : colors.black
    const iconColor = theme === 'light' ? colors.black : colors.dimWhite2

    const getDisplayValue = () => {
        const paths = ["/manage/settings", "/manage/datalist", "/main/editTravel", "/main/travelDetail"]

        const currentPathname = usePathname()
        if (paths.indexOf(currentPathname) <= -1) return "flex"

        return "none"
    }

    return (
        <>
            <StatusBar
                backgroundColor={statusBarStyles[theme]}
            />
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        height: 60,
                        backgroundColor: barColor,
                        borderTopWidth: 0,
                        display: getDisplayValue()
                    },
                    tabBarLabelStyle: {
                        fontSize: 13,
                        fontWeight: 'bold',
                    },
                    tabBarActiveTintColor: colors.appBlue,
                    tabBarInactiveTintColor: iconColor,
                    headerShown: false,
                    sceneStyle: {
                        backgroundColor: barColor
                    }
                }}
                backBehavior="order"
            >
                <Tabs.Screen
                    name="main"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color }) => <Icon size={24} name="house" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="addTravel"
                    options={{
                        title: "Add",
                        tabBarIcon: ({ color }) => <Icon size={24} name="square-plus" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="manage"
                    options={{
                        title: "Modify",
                        tabBarIcon: ({ color }) => <Icon size={24} name="pen-to-square" color={color} />,
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout