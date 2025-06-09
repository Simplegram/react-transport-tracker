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

function ModalBottom({ visible, onRequestClose, ...props }: ModalProps) {
    const { animationType, ...restProps } = props

    return (
        <ModalTemplate
            animationType="slide"

            visible={visible}
            onRequestClose={onRequestClose}
        >
            <ModalTemplate.Backdrop style={{ justifyContent: 'flex-end' }} onPress={onRequestClose}>
                {restProps.children}
            </ModalTemplate.Backdrop>
        </ModalTemplate>
    )
}

interface ModalBottomInputProps extends ModalProps {
    title: string
}

function ModalBottomInput({ title, visible, onRequestClose, ...props }: ModalBottomInputProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <ModalBottom
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <ModalTemplate.Container>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',

                    color: theme.palette.textBlack,
                }}>{title}</Text>
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
                    {props.children}
                </KeyboardAwareScrollView>
            </ModalTemplate.Container>
        </ModalBottom>
    )
}

ModalTemplate.Backdrop = ModalBackdrop
ModalTemplate.Container = ModalContainer

ModalTemplate.Bottom = ModalBottom
ModalTemplate.BottomInput = ModalBottomInput