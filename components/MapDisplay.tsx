import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { Camera, MapView } from "@maplibre/maplibre-react-native"
import { StyleSheet, View } from "react-native"

const pointSize = {
    width: 8,
    height: 8
}

interface MapDisplayProps {
    mapRef: React.MutableRefObject<null>
    zoomLevel: number
    centerCoordinate: number[]
    draggable?: boolean
}

export default function MapDisplay({ mapRef, zoomLevel, centerCoordinate, draggable = true }: MapDisplayProps) {
    const { theme } = useTheme()

    return (
        <View style={[inputElementStyles[theme].inputGroup, styles.mapContainer]}>
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                rotateEnabled={false}
                mapStyle={process.env.EXPO_PUBLIC_MAP_STYLE}
                scrollEnabled={draggable}
            >
                <Camera
                    zoomLevel={zoomLevel}
                    centerCoordinate={centerCoordinate}
                />
            </MapView>
            <View style={styles.pointContainer}>
                <View style={styles.point} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        borderRadius: 12,
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
})