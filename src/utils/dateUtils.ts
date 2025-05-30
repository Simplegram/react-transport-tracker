import moment from "moment"
import { padNumber } from "./utils"

const getCurrentTime = () => {
    const todaysDate = new Date().toISOString().toString()
    return todaysDate
}

export const getTimeString = () => {
    const todaysDate = new Date().toISOString()
    const cleanDate = moment(todaysDate).format("HH:mm:ss")
    return cleanDate
}

export const getDateString = () => {
    const todaysDate = new Date().toISOString().split('T')[0].toString()
    return todaysDate
}

export const formatDate = (date: string) => {
    const cleanDate = date.replace("T", " ")
    const formattedDate = moment(cleanDate, "YYYY-MM-DD hh:mm:ss").format("HH:mm:ss")

    return formattedDate
}

export const getMonthsSinceEarliestDate = (dates: string[], selectedDate: string): number => {
    if (!dates || dates.length === 0) {
        return 0
    }

    const earliestDate = moment(dates[0])
    const currentSelectedDate = moment(selectedDate)

    const monthsDifference = Math.ceil(currentSelectedDate.diff(earliestDate, 'months', true))

    return monthsDifference
}

export const getFutureMonthFromLatestDate = (selectedDate: string, offset: number = 1): number => {
    const today = moment(getDateString())
    let latestDate = moment(selectedDate)

    const monthsDifference = Math.ceil(today.diff(latestDate, 'months', true)) + offset

    return monthsDifference
}

export const timeToMinutes = (averageTime: number | string) => {
    const momentTime = moment(averageTime, "HH:mm:ss.S")
    const formattedTime = momentTime.format("HH:mm:ss")

    const stringTime = `${momentTime.hours()}h ${padNumber(momentTime.minutes())}m ${padNumber(momentTime.seconds())}s`

    return stringTime
}

export const addTime = (time: string) => {
    const today = moment(getCurrentTime())
    const momentTime = moment(time, "HH:mm:ss")

    const addedTime = today.add(momentTime.hours(), 'hours').add(momentTime.minutes(), 'minutes').add(momentTime.seconds(), 'seconds')
    const formattedTime = addedTime.format("HH:mm:ss")

    return formattedTime
}

export const sumTimesToMs = (times: number[]) => {
    let timeSum = moment("00:00:00", "HH:mm:ss")

    for (const time of times) {
        const momentTime = moment(time, "HH:mm:ss")

        timeSum = timeSum.add(momentTime.hours(), 'hours').add(momentTime.minutes(), 'minutes').add(momentTime.seconds(), 'seconds')
    }

    const startOfDay = moment().startOf('day')
    const milliseconds = timeSum.diff(startOfDay)

    return milliseconds
}

export const formatMsToMinutes = (milliseconds: number, showSign: boolean = false): string => {
    if (isNaN(milliseconds)) {
        return 'N/A'
    }
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const sign = showSign ? Math.sign(milliseconds) < 0 ? '' : '+' : ''
    return `${sign}${minutes} mins`
}

export const formatMsToHoursMinutes = (milliseconds: number): string => {
    if (isNaN(milliseconds) || milliseconds < 0) {
        return 'N/A'
    }
    const totalMinutes = Math.floor(milliseconds / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m / ${totalMinutes}m`
}

export const getDiffString = (duration: moment.Duration, usePrefix: boolean = false) => {
    const hours = duration.hours()
    const minutes = duration.minutes()
    const seconds = duration.seconds()

    const hoursString = hours !== 0 ? `${Math.abs(hours)}h ` : ``
    const minutesString = minutes !== 0 ? `${padNumber(Math.abs(minutes))}m ` : ``
    const secondsString = `${padNumber(Math.abs(seconds))}s`

    const prefix = usePrefix ? (hours < 0 || minutes < 0 || seconds < 0) ? "+" : "-" : ""

    const diffString = `${prefix} ${hoursString}${minutesString}${secondsString}`

    return diffString
}