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
    </Tabs>
  )
};

export default TabsLayout;