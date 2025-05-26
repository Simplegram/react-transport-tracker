import moment from "moment"

export const getTodayString = () => {
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
    const today = moment(getTodayString())
    let latestDate = moment(selectedDate)

    const monthsDifference = Math.ceil(today.diff(latestDate, 'months', true)) + offset

    return monthsDifference
}

export const timeToMinutes = (averageTime: number) => {
    const momentTime = moment(averageTime, "HH:mm:ss")
    const formattedTime = momentTime.format("HH:mm:ss")

    return formattedTime
}

export const sumTimesMs = (times: number[]) => {
    let timeSum = moment("00:00:00", "HH:mm:ss")

    for (const time of times) {
        const momentTime = moment(time, "HH:mm:ss")

        timeSum = timeSum.add(momentTime.minutes(), 'minutes').add(momentTime.seconds(), 'seconds')
    }

    const startOfDay = moment().startOf('day')
    const milliseconds = timeSum.diff(startOfDay);

    return milliseconds
}