export const colors = ["#3e60d5", "#6c757d", "#47ad77", "#fa5c7c", "#ffbc00", "#39afd1", "#e3eaef", "#313a46",];

export const arrayData = [{
    y: 400, quarters: [{
        x: "Q1", y: 120,
    }, {
        x: "Q2", y: 90,
    }, {
        x: "Q3", y: 100,
    }, {
        x: "Q4", y: 90,
    },],
}, {
    y: 430, quarters: [{
        x: "Q1", y: 120,
    }, {
        x: "Q2", y: 110,
    }, {
        x: "Q3", y: 90,
    }, {
        x: "Q4", y: 110,
    },],
}, {
    y: 448, quarters: [{
        x: "Q1", y: 70,
    }, {
        x: "Q2", y: 100,
    }, {
        x: "Q3", y: 140,
    }, {
        x: "Q4", y: 138,
    },],
}, {
    y: 470, quarters: [{
        x: "Q1", y: 150,
    }, {
        x: "Q2", y: 60,
    }, {
        x: "Q3", y: 190,
    }, {
        x: "Q4", y: 70,
    },],
}, {
    y: 540, quarters: [{
        x: "Q1", y: 120,
    }, {
        x: "Q2", y: 120,
    }, {
        x: "Q3", y: 130,
    }, {
        x: "Q4", y: 170,
    },],
}, {
    y: 580, quarters: [{
        x: "Q1", y: 170,
    }, {
        x: "Q2", y: 130,
    }, {
        x: "Q3", y: 120,
    }, {
        x: "Q4", y: 160,
    },],
},];

export const series = [{
    data: makeData(),
},];

export const options = {
    chart: {
        id: "barYear", height: 400, width: "100%", type: "bar", toolbar: {
            show: false,
        }, events: {

            updated(chart: any) {
                updateQuarterChart(chart, "barQuarter");
            },
        },
    }, plotOptions: {
        bar: {
            distributed: true, horizontal: true, barHeight: "75%", dataLabels: {
                position: "bottom",
            },
        },
    }, dataLabels: {
        enabled: true, textAnchor: "start", style: {
            colors: ["#fff"],
        }, formatter: function (val: number, opt: any) {
            return opt.w.globals.labels[opt.dataPointIndex];
        }, offsetX: 0, dropShadow: {
            enabled: true,
        },
    },

    colors: colors,

    states: {
        normal: {
            filter: {
                type: "desaturate",
            },
        }, active: {
            allowMultipleDataPointsSelection: true, filter: {
                type: "darken", value: 1,
            },
        },
    }, tooltip: {
        x: {
            show: false,
        }, y: {
            title: {
                formatter: function (val: number, opts: any) {
                    return opts.w.globals.labels[opts.dataPointIndex];
                },
            },
        },
    }, title: {
        text: "Yearly Results", offsetX: 15,
    }, subtitle: {
        text: "(Click on bar to see details)", offsetX: 15,
    }, yaxis: {
        labels: {
            show: false,
        },
    },
};

export const optionsQuarter = {
    series: [{
        data: [],
    },], chart: {
        id: "barQuarter", height: 400, width: "100%", type: "bar", stacked: true,
    }, plotOptions: {
        bar: {
            columnWidth: "50%", horizontal: false,
        },
    }, legend: {
        show: false,
    }, grid: {
        yaxis: {
            lines: {
                show: false,
            },
        }, xaxis: {
            lines: {
                show: true,
            },
        },
    }, yaxis: {
        labels: {
            show: false,
        },
    }, title: {
        text: "Quarterly Results", offsetX: 10,
    }, tooltip: {
        x: {
            formatter: function (val: any, opts: any) {
                return opts.w.globals.seriesNames[opts.seriesIndex];
            },
        }, y: {
            title: {
                formatter: function (val: any, opts: any) {
                    return opts.w.globals.labels[opts.dataPointIndex];
                },
            },
        },
    }, fill: {colors: []}, colors: []

};

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function makeData() {
    let dataSet = shuffleArray(arrayData);
    // console.log(dataSet);
    let dataYearSeries = [{
        x: "2011", y: dataSet[0].y, color: colors[0], quarters: dataSet[0].quarters,
    }, {
        x: "2012", y: dataSet[1].y, color: colors[1], quarters: dataSet[1].quarters,
    }, {
        x: "2013", y: dataSet[2].y, color: colors[2], quarters: dataSet[2].quarters,
    }, {
        x: "2014", y: dataSet[3].y, color: colors[3], quarters: dataSet[3].quarters,
    }, {
        x: "2015", y: dataSet[4].y, color: colors[4], quarters: dataSet[4].quarters,
    }, {
        x: "2016", y: dataSet[5].y, color: colors[5], quarters: dataSet[5].quarters,
    },];

    return dataYearSeries;
}

function updateQuarterChart(sourceChart: any, destChartIDToUpdate: any) {
    let series = [];
    let seriesIndex = 0;
    let colors = [];

    if (sourceChart.w.globals.selectedDataPoints[0]) {
        let selectedPoints = sourceChart.w.globals.selectedDataPoints;
        for (let i = 0; i < selectedPoints[seriesIndex].length; i++) {
            let selectedIndex = selectedPoints[seriesIndex][i];
            let yearSeries = sourceChart.w.config.series[seriesIndex];
            series.push({
                name: yearSeries.data[selectedIndex].x, data: yearSeries.data[selectedIndex].quarters,
            });
            colors.push(yearSeries.data[selectedIndex].color);
        }

        if (series.length === 0) series = [{
            data: [],
        },];

        return ApexCharts.exec(destChartIDToUpdate, "updateOptions", {
            series: series, colors: colors, fill: {
                colors: colors,
            },
        });
    }
}
