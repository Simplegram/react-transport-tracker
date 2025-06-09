import { useTheme } from '@/context/ThemeContext'
import {
    Modal,
    ModalProps,
    Pressable,
    PressableProps,
    PressableStateCallbackType,
    StyleProp,
    Text,
    ViewStyle
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function ModalTemplate({ visible, onRequestClose, ...props }: ModalProps) {
    const { transparent, statusBarTranslucent, ...restProps } = props

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onRequestClose}
            statusBarTranslucent={true}
            {...props}
        >
            {restProps.children}
        </Modal>
    )
}

function ModalBackdrop(props: PressableProps) {
    const { children, style, onPress, ...restProps } = props

    const baseStyle: StyleProp<ViewStyle> = {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }

    const pressableStyle = typeof style === 'function'
        ? (state: PressableStateCallbackType) => [baseStyle, style(state)]
        : [baseStyle, style]

    return (
        <Pressable
            style={pressableStyle}
            onPress={onPress}
            {...restProps}
        >
            {children}
        </Pressable>
    )
}

function ModalContainer(props: PressableProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { children, style, onPress, ...restProps } = props

    const baseStyle: StyleProp<ViewStyle> = {
        gap: 10,
        padding: 20,
        borderWidth: 1,
        justifyContent: 'space-between',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,

        borderTopColor: theme.palette.borderColor,
        backgroundColor: theme.palette.background,
    }

    const pressableStyle = typeof style === 'function'
        ? (state: PressableStateCallbackType) => [baseStyle, style(state)]
        : [baseStyle, style]

    return (
        <Pressable
            style={pressableStyle}
            onPress={onPress}
            {...restProps}
        >
            {children}
        </Pressable>
    )
}

interface Props extends ModalProps {
    title: string
}

function ModalBottom({ title, visible, onRequestClose, ...props }: Props) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { animationType, transparent, statusBarTranslucent, ...restProps } = props

    return (
        <ModalTemplate
            animationType="slide"

            visible={visible}
            onRequestClose={onRequestClose}
        >
            <ModalTemplate.Backdrop style={{ justifyContent: 'flex-end' }} onPress={onRequestClose}>
                <ModalTemplate.Container>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',

                        color: theme.palette.textBlack,
                    }}>{title}</Text>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
                        {restProps.children}
                    </KeyboardAwareScrollView>
                </ModalTemplate.Container>
            </ModalTemplate.Backdrop>
        </ModalTemplate>
    )
}

ModalTemplate.Backdrop = ModalBackdrop
ModalTemplate.Container = ModalContainer

ModalTemplate.Bottom = ModalBottom