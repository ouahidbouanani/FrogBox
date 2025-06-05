<template>
  <canvas id="draw-time-example"></canvas>
</template>

<script lang="ts">
import {hexToRGB} from '../utility';
import { Chart, type ChartItem, type ChartConfiguration,type ChartTypeRegistry } from 'chart.js/auto';

export default {
  data() {
    let chart
    const colors = ["#3e60d5", "#47ad77"]
    const config:ChartConfiguration<keyof ChartTypeRegistry, number[], unknown>  = {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'], datasets: [{
          label: 'Fully Rounded',
          data: [10, 20, 15, 35, 38, 24],
          borderColor: colors[0],
          backgroundColor: colors[0],
          fill: true

        }, {
          label: 'Small Radius',
          data: [24, 38, 35, 15, 20, 10],
          backgroundColor: hexToRGB(colors[1], 0.3),
          borderColor: colors[1],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, plugins: {
          legend: {
            display: false,
          }, filler: {
            propagate: false,
          },
        },
        interaction: {
          intersect: false,
        }, scales: {
          x: {
            grid: {
              display: false
            }
          }, y: {
            grid: {
              display: false
            }
          },
        }
      }
    }
    return {
      chart,
      config
    }
  },
  mounted() {
    const canvasTag = <ChartItem>document.getElementById('draw-time-example')
    new Chart(canvasTag, this.config)
  },
}
</script>
