<template>
<apexchart height="330" :options="options" :series="series"></apexchart>
</template>

<script lang="ts">
export default {
    data() {
        return {
            series: [75],
            options: {
                chart: {
                    height: 330,
                    type: "radialBar",
                    toolbar: {
                        show: true,
                    },
                },
                plotOptions: {
                    radialBar: {
                        startAngle: -135,
                        endAngle: 225,
                        hollow: {
                            margin: 0,
                            size: "70%",
                            background: "transparent",
                            image: undefined,
                            imageOffsetX: 0,
                            imageOffsetY: 0,
                            position: "front",
                            dropShadow: {
                                enabled: true,
                                top: 3,
                                left: 0,
                                blur: 4,
                                opacity: 0.24,
                            },
                        },
                        track: {
                            background: "rgba(170,184,197, 0.2)",
                            strokeWidth: "67%",
                            margin: 0,
                        },

                        dataLabels: {
                            showOn: "always",
                            name: {
                                offsetY: -10,
                                show: true,
                                color: "#888",
                                fontSize: "17px",
                            },
                            value: {
                                formatter: function (val: string) {
                                    return parseInt(val);
                                },
                                color: "#111",
                                fontSize: "36px",
                                show: true,
                            },
                        },
                    },
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shade: "dark",
                        type: "horizontal",
                        shadeIntensity: 0.5,
                        gradientToColors: ["#8f75da", "#727cf5"],
                        inverseColors: true,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100],
                    },
                },

                stroke: {
                    lineCap: "round",
                },
                labels: ["Percent"],
            },
        };
    },
};
</script>
