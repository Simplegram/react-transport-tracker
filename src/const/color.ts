import { darkenHexColor } from "../utils/colorUtils"

const allColor = {
    white: '#ffffff',
    black: '#000000',
    appBlue: '#007bff',
    lightBlue: '#e3f2fd',
    redCancel: '#f0473e',
    greenPositive: '#4CAF50',
    placeholderGray: '#9E9E9E',
}

const white = {
    dimWhite: darkenHexColor(allColor.white, 90),
    dimWhite2: darkenHexColor(allColor.white, 80),
    dimmerWhite: darkenHexColor(allColor.white, 70),
    dimmerWhite2: darkenHexColor(allColor.white, 60),
    dimmestWhite: darkenHexColor(allColor.white, 50),
}

const appBlue = {
    dimAppBlue: darkenHexColor(allColor.appBlue, 90),
    dimmerAppBlue: darkenHexColor(allColor.appBlue, 70),
}

export const colors = {
    ...allColor,
    ...white,
    ...appBlue,
    dimRedCancel: darkenHexColor(allColor.redCancel, 90),
    dimGreenPositive: darkenHexColor(allColor.greenPositive, 90)
}