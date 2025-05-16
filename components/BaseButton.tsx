import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

type Props = {
    title: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>; // Change to ViewStyle as the container will have background color
    textStyle?: StyleProp<TextStyle>;
    color?: string; // Keep for fallback
    darkenAmount?: number;
};

export default function Button({
    title,
    onPress,
    style,
    textStyle,
    color = '#f3f3f3',
    darkenAmount = 0.3,
}: Props) {
    const darkenColor = (hexColor: string, amount: number) => {
        // Remove the '#' if it exists
        hexColor = hexColor.replace('#', '');

        // Parse the hex color into its RGB components
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);

        // Darken each component
        const darkenR = Math.max(0, Math.floor(r * (1 - amount)));
        const darkenG = Math.max(0, Math.floor(g * (1 - amount)));
        const darkenB = Math.max(0, Math.floor(b * (1 - amount)));

        // Convert the darkened components back to hex
        const darkenRHex = darkenR.toString(16).padStart(2, '0');
        const darkenGHex = darkenG.toString(16).padStart(2, '0');
        const darkenBHex = darkenB.toString(16).padStart(2, '0');

        return `#${darkenRHex}${darkenGHex}${darkenBHex}`;
    };

    const getBackgroundColorFromStyle = (buttonStyle: StyleProp<ViewStyle>): string | undefined => {
        if (!buttonStyle) {
            return undefined;
        }

        if (Array.isArray(buttonStyle)) {
            // If it's an array of styles, iterate and find the last one with backgroundColor
            for (let i = buttonStyle.length - 1; i >= 0; i--) {
                const styleObject = buttonStyle[i];
                if (styleObject && typeof styleObject === 'object' && 'backgroundColor' in styleObject) {
                    return styleObject.backgroundColor as string;
                }
            }
        } else if (typeof buttonStyle === 'object' && buttonStyle !== null && 'backgroundColor' in buttonStyle) {
            // If it's a single style object
            return (buttonStyle as ViewStyle).backgroundColor as string;
        }

        return undefined;
    };

    const buttonStyle = ({ pressed }: { pressed: boolean }) => {
        const styleBackgroundColor = getBackgroundColorFromStyle(style);
        const baseColor = styleBackgroundColor || color; // Prioritize color from style, fallback to color prop

        const backgroundColor = pressed ? darkenColor(baseColor, darkenAmount) : baseColor;

        // Create a new style object to override the background color if it was in the original style
        const effectiveStyle = Array.isArray(style) ? [...style] : style ? { ...style } : {};

        if (typeof effectiveStyle === 'object' && effectiveStyle !== null) {
             // Remove the original backgroundColor if it exists to avoid conflicts with the pressed state
            if ('backgroundColor' in effectiveStyle) {
                delete (effectiveStyle as ViewStyle).backgroundColor;
            }
        }


        return [styles.buttonContainer, effectiveStyle, { backgroundColor }];
    };

    return (
        <Pressable style={buttonStyle} onPress={onPress}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        maxHeight: 55,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});