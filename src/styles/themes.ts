import { colors } from "../const/color"

interface Palette {
    background: string
    backgroundPrimary: string

    textWhite: string
    textBlack: string
    textDark: string
    textPlaceholder: string

    borderColor: string
    borderColorSoft: string
    borderColorPrimary: string
}

export interface Theme {
    name: string
    palette: Palette
}

const lightPallete: Palette = {
    background: colors.white_100,
    backgroundPrimary: colors.primary,

    textWhite: colors.white_100,
    textBlack: colors.black,
    textDark: colors.white_700,
    textPlaceholder: colors.white_500,

    borderColor: colors.black,
    borderColorSoft: colors.white_500,
    borderColorPrimary: colors.black,
}

const darkPallete: Palette = {
    background: colors.black,
    backgroundPrimary: colors.black,

    textWhite: colors.white_200,
    textBlack: colors.white_200,
    textDark: colors.white_300,
    textPlaceholder: colors.white_600,

    borderColor: colors.white_200,
    borderColorSoft: colors.white_500,
    borderColorPrimary: colors.primary_100,
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