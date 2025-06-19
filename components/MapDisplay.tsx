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
    ref: React.MutableRefObject<null>

    zoomLevel: number
    centerCoordinate: number[]

    zoomEnabled?: boolean
    scrollEnabled?: boolean

    updateLocation?: () => void

    children?: React.ReactNode
}

export default function MapDisplay({ ref, zoomLevel, centerCoordinate, scrollEnabled = true, zoomEnabled = true, updateLocation, children }: MapDisplayProps) {
    const { theme } = useTheme()

    return (
        <View style={styles.mapContainer}>
            <MapView
                ref={ref}
                style={{ flex: 1, overflow: 'hidden' }}
                rotateEnabled={false}
                mapStyle={process.env.EXPO_PUBLIC_MAP_STYLE}
                scrollEnabled={scrollEnabled}
                zoomEnabled={zoomEnabled}
            >
                {children}
                <Camera
                    zoomLevel={zoomLevel}
                    centerCoordinate={centerCoordinate}
                    animationMode={"moveTo"}
                />
            </MapView>
            <View style={styles.pointContainer}>
                <View style={styles.point} />
            </View>
            {updateLocation && (
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} onPress={updateLocation}>
                        <Icon name="location-crosshairs" style={{ color: 'black' }} size={24} />
                    </Button>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
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