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

export const getMonthsSinceEarliestDate = (dates: string[]): number => {
    if (!dates || dates.length === 0) {
        return 0
    }

    const earliestDate = moment(dates[0])
    const today = moment(getTodayString())

    const monthsDifference = today.diff(earliestDate, 'months') + 1

    return monthsDifference
}

export const getFutureMonthFromLatestDate = (selectedDate: string, offset: number = 1): number => {
    const today = moment(getTodayString())
    let latestDate = moment(selectedDate)

    const monthsDifference = Math.abs(today.diff(latestDate, 'months')) + offset

    return monthsDifference
}