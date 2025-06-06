import { colors } from "../const/color"

interface Palette {
    background: string
    backgroundPrimary: string

    textWhite: string
    textBlack: string

    borderColor: string
}

export interface Theme {
    name: string
    palette: Palette
}

const lightPallete = {
    background: colors.white_100,
    backgroundPrimary: colors.primary,

    textWhite: colors.white_100,
    textBlack: colors.black,

    borderColor: colors.black,
}

const darkPallete = {
    background: colors.black,
    backgroundPrimary: colors.black,

    textWhite: colors.white_200,
    textBlack: colors.white_200,

    borderColor: colors.white_200,
}

export const lightTheme = {
    name: 'light',
    palette: lightPallete,
}

export const darkTheme = {
    name: 'dark',
    palette: darkPallete,
}

export const themes = {
    light: lightPallete,
    dark: darkTheme,
}

export const defaultTheme = lightTheme