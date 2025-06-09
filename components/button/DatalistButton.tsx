import { useTheme } from "@/context/ThemeContext"
import { TouchableOpacity, View } from "react-native"
import { TouchableOpacityProps } from "react-native-gesture-handler"
import Icon from 'react-native-vector-icons/FontAwesome6'
import Input from "../input/Input"

export interface ItemTemplate {
    id: string | number
    name: string
    [key: string]: any
}

interface Props extends Omit<TouchableOpacityProps, 'onPress'> {
    name: string
    onPress: (key: any) => void
}

export default function DataButtonBase({ name, onPress, ...props }: Props) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <TouchableOpacity
            style={{
                gap: 10,
                flex: 1,
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
                flexDirection: 'column',
                justifyContent: 'space-between',

                borderColor: theme.palette.borderColor,
                backgroundColor: theme.palette.background,
            }}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={{ flexDirection: 'column' }}>
                {props.children}
                <Input.Title>{name}</Input.Title>
            </View>
        </TouchableOpacity>
    )
}

function StopsButton(item: ItemTemplate) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <>
            <Icon
                style={{
                    alignItems: 'center',
                    color: theme.palette.textWhite,
                }}
                name={item.vehicle_type?.icon_id.name}
                size={20}
            />
            <Input.Subtitle>{item.vehicle_type?.name}</Input.Subtitle>
        </>
    )
}

function RoutesButton(item: ItemTemplate) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <>
            <Icon
                style={{
                    alignItems: 'center',
                    color: theme.palette.textWhite,
                }}
                name={item.vehicle_type_id?.icon_id.name}
                size={20}
            />
            <Input.Subtitle>{item.code}</Input.Subtitle>
        </>
    )
}

DataButtonBase.Stops = StopsButton
DataButtonBase.Routes = RoutesButton