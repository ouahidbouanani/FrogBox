<template>
<apexchart height="380" :options="options" :series="series"></apexchart>
</template>

<script lang="ts">
export default {
    data() {
        const colors = ["#727cf5","#ffbc00"];
        return {
            series: [{
                name: "Actual",
                data: [{
                        x: "2011",
                        y: 1292,
                        goals: [{
                            name: "Expected",
                            value: 1400,
                            strokeHeight: 5,
                            strokeColor: colors[1],
                        }, ],
                    },
                    {
                        x: "2012",
                        y: 4432,
                        goals: [{
                            name: "Expected",
                            value: 5400,
                            strokeHeight: 5,
                            strokeColor: colors[1],
                        }, ],
                    },
                    {
                        x: "2013",
                        y: 5423,
                        goals: [{
                            name: "Expected",
                            value: 5200,
                            strokeHeight: 5,
                            strokeColor: colors[1],
                        }, ],
                    },
                    {
                        x: "2014",
                        y: 6653,
                        goals: [{
                            name: "Expected",
                            value: 6500,
                            strokeHeight: 5,
                            strokeColor: colors[1],
                        }, ],
                    },
                    {
                        x: "2015",
                        y: 8133,
                        goals: [{
                            name: "Expected",
                            value: 6600,
                            strokeHeight: 13,
                            strokeWidth: 0,
                            strokeLineCap: "round",
                            strokeColor: colors[1],
                        }, ],
                    },
                    {
                        x: "2016",
                        y: 7132,
                        goals: [{
                            name: "Expected",
                            value: 7500,
                            strokeHeight: 5,
                            strokeColor: colors[1],
                        }, ],
                    },
                    {
                        x: "2017",
                        y: 7332,
                        goals: [{
                            name: "Expected",
                            value: 8700,
                            strokeHeight: 5,
                            strokeColor: colors[1],
                        }, ],
                    },
                    {
                        x: "2018",
                        y: 6553,
                        goals: [{
                            name: "Expected",
                            value: 7300,
                            strokeHeight: 2,
                            strokeDashArray: 2,
                            strokeColor: colors[1],
                        }, ],
                    },
                ],
            }, ],
            options: {
                chart: {
                    height: 380,
                    type: "bar",
                },
                plotOptions: {
                    bar: {
                        columnWidth: "60%",
                    },
                },
                colors: colors,
                dataLabels: {
                    enabled: false,
                },
                legend: {
                    show: true,
                    showForSingleSeries: true,
                    customLegendItems: ["Actual", "Expected"],
                    markers: {
                        fillColors: colors,
                    },
                },
            },
        };
    },
};
</script>
