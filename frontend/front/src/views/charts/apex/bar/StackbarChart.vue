<template>
<apexchart height="380" :series="series" :options="options"></apexchart>
</template>

<script>
export default {
    data: function () {
        return {
            series: [{
                name: 'Marine Sprite',
                data: [44, 55, 41, 37, 22, 43, 21]
            }, {
                name: 'Striking Calf',
                data: [53, 32, 33, 52, 13, 43, 32]
            }, {
                name: 'Tank Picture',
                data: [12, 17, 11, 9, 15, 11, 20]
            }, {
                name: 'Bucket Slope',
                data: [9, 7, 5, 8, 6, 9, 4]
            }, {
                name: 'Reborn Kid',
                data: [25, 12, 19, 32, 25, 24, 10]
            }],
            options: {
                chart: {
                    height: 380,
                    type: 'bar',
                    stacked: true,
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                    },

                },
                stroke: {
                    show: false
                },
                xaxis: {
                    categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
                    labels: {
                        formatter: function (val) {
                            return val + "K"
                        }
                    },
                    axisBorder: {
                        show: false,
                    }
                },
                yaxis: {
                    title: {
                        text: undefined
                    },

                },
                colors: ["#727cf5","#0acf97","#fa5c7c","#6c757d","#39afd1"],
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + "K"
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                states: {
                    hover: {
                        filter: 'none'
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'center',
                    offsetY: 10
                },
                grid: {
                    borderColor: '#f1f3fa'
                }
            }
        }
    }
}
</script>
