import { useTheme } from "@/context/ThemeContext"
import { Camera, MapView } from "@maplibre/maplibre-react-native"
import { StyleSheet, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import Button from "./button/BaseButton"

const pointSize = {
    width: 8,
    height: 8
}

interface MapDisplayProps {
    mapRef?: React.MutableRefObject<null>

    zoomLevel: number
    centerCoordinate: number[]

    zoomEnabled?: boolean
    rotateEnabled?: boolean
    scrollEnabled?: boolean

    children?: React.ReactNode
}

export default function MapDisplay({
    mapRef,

    zoomLevel,
    centerCoordinate,

    zoomEnabled = true,
    rotateEnabled = false,
    scrollEnabled = true,

    children
}: MapDisplayProps) {
    const { theme } = useTheme()

    return (
        <MapView
            ref={mapRef}

            zoomEnabled={zoomEnabled}
            rotateEnabled={rotateEnabled}
            scrollEnabled={scrollEnabled}

            style={{ flex: 1, overflow: 'hidden', borderRadius: 10 }}
            mapStyle={((theme === 'light') || (!process.env.EXPO_PUBLIC_MAP_STYLE_DARK)) ? process.env.EXPO_PUBLIC_MAP_STYLE : process.env.EXPO_PUBLIC_MAP_STYLE_DARK}
        >
            {children}
            <Camera
                zoomLevel={zoomLevel}
                centerCoordinate={centerCoordinate}
                animationMode={"moveTo"}
            />
        </MapView>
    )
}

interface PinProps extends MapDisplayProps {
    updateLocation?: () => void
}

export function Pin(props: PinProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { updateLocation, ...restProps } = props

    return (
        <View style={{ flex: 1 }}>
            <MapDisplay {...restProps} />
            <View style={styles.pointContainer}>
                <View style={styles.point} />
            </View>
            {updateLocation && (
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} onPress={updateLocation}>
                        <Icon name="location-crosshairs" style={{ color: theme.palette.textBlack }} size={24} />
                    </Button>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    pointContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'box-none',
    },
    point: {
        width: pointSize.width,
        height: pointSize.height,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: 'red',
    },
    buttonContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'box-none',
    },
    button: {
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
})

MapDisplay.Pin = Pin