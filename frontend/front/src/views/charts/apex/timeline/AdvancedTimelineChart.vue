<template>
<apexchart height="350" :options="options" :series="series"></apexchart>
</template>

<script lang="ts">
export default {
    data() {
        return {
            options: {
                chart: {
                    height: 350,
                    type: "rangeBar",
                    toolbar: {
                        show: false,
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: "80%",
                    },
                },
                xaxis: {
                    type: "datetime",
                },
                stroke: {
                    width: 1,
                },
                colors: ["#727cf5","#0acf97","#fa5c7c"],
                fill: {
                    type: "solid",
                    opacity: 0.6,
                },
                legend: {
                    position: "top",
                    horizontalAlign: "left",
                },
            },
            series: [{
                    name: "Bob",
                    data: [{
                            x: "Design",
                            y: [
                                new Date("2019-03-05").getTime(),
                                new Date("2019-03-08").getTime(),
                            ],
                        },
                        {
                            x: "Code",
                            y: [
                                new Date("2019-03-02").getTime(),
                                new Date("2019-03-05").getTime(),
                            ],
                        },
                        {
                            x: "Code",
                            y: [
                                new Date("2019-03-05").getTime(),
                                new Date("2019-03-07").getTime(),
                            ],
                        },
                        {
                            x: "Test",
                            y: [
                                new Date("2019-03-03").getTime(),
                                new Date("2019-03-09").getTime(),
                            ],
                        },
                        {
                            x: "Test",
                            y: [
                                new Date("2019-03-08").getTime(),
                                new Date("2019-03-11").getTime(),
                            ],
                        },
                        {
                            x: "Validation",
                            y: [
                                new Date("2019-03-11").getTime(),
                                new Date("2019-03-16").getTime(),
                            ],
                        },
                        {
                            x: "Design",
                            y: [
                                new Date("2019-03-01").getTime(),
                                new Date("2019-03-03").getTime(),
                            ],
                        },
                    ],
                },
                {
                    name: "Joe",
                    data: [{
                            x: "Design",
                            y: [
                                new Date("2019-03-02").getTime(),
                                new Date("2019-03-05").getTime(),
                            ],
                        },
                        {
                            x: "Test",
                            y: [
                                new Date("2019-03-06").getTime(),
                                new Date("2019-03-16").getTime(),
                            ],
                            goals: [{
                                name: "Break",
                                value: new Date("2019-03-10").getTime(),
                                strokeColor: "#CD2F2A",
                            }, ],
                        },
                        {
                            x: "Code",
                            y: [
                                new Date("2019-03-03").getTime(),
                                new Date("2019-03-07").getTime(),
                            ],
                        },
                        {
                            x: "Deployment",
                            y: [
                                new Date("2019-03-20").getTime(),
                                new Date("2019-03-22").getTime(),
                            ],
                        },
                        {
                            x: "Design",
                            y: [
                                new Date("2019-03-10").getTime(),
                                new Date("2019-03-16").getTime(),
                            ],
                        },
                    ],
                },
                {
                    name: "Dan",
                    data: [{
                            x: "Code",
                            y: [
                                new Date("2019-03-10").getTime(),
                                new Date("2019-03-17").getTime(),
                            ],
                        },
                        {
                            x: "Validation",
                            y: [
                                new Date("2019-03-05").getTime(),
                                new Date("2019-03-09").getTime(),
                            ],
                            goals: [{
                                name: "Break",
                                value: new Date("2019-03-07").getTime(),
                                strokeColor: "#CD2F2A",
                            }, ],
                        },
                    ],
                },
            ],
        };
    },
};
</script>
