import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
        <Tabs.Screen 
            name="index" 
            options={{ 
                title: "Home", 
                headerShown: false,
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                tabBarStyle: {
                  height: 60
                },
                tabBarLabelStyle: {
                  fontSize: 13
                }
        }} />
        <Tabs.Screen 
            name="add-page" 
            options={{ 
                title: "Add", 
                headerShown: false,
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
                tabBarStyle: {
                  height: 60
                },
                tabBarLabelStyle: {
                  fontSize: 13
                }
        }} />
        <Tabs.Screen 
            name="inputs/vehicle-input" 
            options={{ 
                title: "Add", 
                headerShown: false,
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
                tabBarStyle: {
                  height: 60
                },
                tabBarLabelStyle: {
                  fontSize: 13
                },
                href: null
        }} />
        <Tabs.Screen 
            name="(inputs)" 
            options={{ 
                title: "Add", 
                headerShown: false,
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
                tabBarStyle: {
                  height: 60
                },
                tabBarLabelStyle: {
                  fontSize: 13
                },
                href: null
        }} />
    </Tabs>
  )
};

export default TabsLayout;