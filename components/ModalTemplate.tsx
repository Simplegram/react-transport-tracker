import { useTheme } from '@/context/ThemeContext'
import {
    Modal,
    ModalProps,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewProps
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Input from './input/Input'

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

function ModalBackdrop(props: TouchableOpacityProps) {
    const { children, style, onPress, ...restProps } = props

    return (
        <TouchableOpacity
            disabled={onPress ? false : true}
            activeOpacity={1}
            style={[
                {
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }, style
            ]}
            onPress={onPress}
            {...restProps}
        >
            {children}
        </TouchableOpacity>
    )
}

function ModalContainer(props: ViewProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { children, style, ...restProps } = props

    return (
        <View
            style={[
                {
                    gap: 10,
                    padding: 20,
                    borderWidth: 1,
                    borderRadius: 10,
                    justifyContent: 'space-between',

                    borderColor: theme.palette.borderColor,
                    backgroundColor: theme.palette.background,
                }, style
            ]}
            {...restProps}
        >
            {children}
        </View>
    )
}

function ModalBottomContainer(props: ViewProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { children, style, ...restProps } = props

    return (
        <View
            style={[
                {
                    gap: 10,
                    padding: 20,
                    borderWidth: 1,
                    justifyContent: 'space-between',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,

                    borderTopColor: theme.palette.borderColor,
                    backgroundColor: theme.palette.background,
                }, style
            ]}
            {...restProps}
        >
            {children}
        </View>
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
    return (
        <ModalBottom
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <ModalTemplate.BottomContainer>
                <Input.Header>{title}</Input.Header>
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
                    {props.children}
                </KeyboardAwareScrollView>
            </ModalTemplate.BottomContainer>
        </ModalBottom>
    )
}

ModalTemplate.Backdrop = ModalBackdrop

ModalTemplate.Container = ModalContainer
ModalTemplate.BottomContainer = ModalBottomContainer

ModalTemplate.Bottom = ModalBottom
ModalTemplate.BottomInput = ModalBottomInput