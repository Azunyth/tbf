module.exports = [
    {
        desc: "day",
        regex: /d{2}/,
        func: "getDate"
    },
    {
        desc: "month",
        regex: /m{2}/,
        func: "getMonth"
    },
    {
        desc: "year",
        regex: /y{4}/,
        func: "getFullYear"
    },
    {
        desc: "hours",
        regex: /h{2}/,
        func: "getHours"
    },
    {
        desc: "minutes",
        regex: /i{2}/,
        func: "getMinutes"
    },
    {
        desc: "seconds",
        regex: /s{2}/,
        func: "getDate"
    },
    {
        desc: "dayOfWeek",
        regex: /w{2}/,
        func: "getDay"
    },
]
