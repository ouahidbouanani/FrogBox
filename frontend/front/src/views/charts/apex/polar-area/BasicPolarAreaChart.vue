<template>
<apexchart height="380" :options="options" :series="series"></apexchart>
</template>

<script lang="ts">
export default {
    data() {
        return {
            series: [14, 23, 21, 17, 15, 10],
            options: {
                chart: {
                    height: 380,
                    type: "polarArea",
                },
                stroke: {
                    colors: ["#fff"],
                },
                fill: {
                    opacity: 0.8,
                },
                labels: ["Vote A", "Vote B", "Vote C", "Vote D", "Vote E", "Vote F"],
                legend: {
                    position: "bottom",
                },
                colors: ["#727cf5", "#6c757d", "#0acf97", "#fa5c7c", "#ffbc00", "#39afd1"],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                }, ],
            },
        };
    },
};
</script>
