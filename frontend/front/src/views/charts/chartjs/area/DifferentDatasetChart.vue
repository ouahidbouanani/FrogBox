<template>
  <canvas id="dataset-example"></canvas>
</template>

<script lang="ts">
import { hexToRGB } from '../utility'
import { Chart, type ChartItem, type ChartConfiguration,type ChartTypeRegistry } from 'chart.js/auto';

export default {
  data() {
    const colors = ['#3e60d5', '#fa5c7c', '#47ad77', '#ebeff2', '#f56f36']
    const config: ChartConfiguration<keyof ChartTypeRegistry, number[], unknown> = {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'D0',
            data: [10, 20, 15, 35, 38, 24],
            borderColor: colors[0],
            hidden: true,
            backgroundColor: hexToRGB(colors[0], 0.3),
          },
          {
            label: 'D1',
            data: [12, 18, 18, 33, 41, 20],
            borderColor: colors[1],
            fill: '-1',
            backgroundColor: hexToRGB(colors[1], 0.3),
          },
          {
            label: 'D2',
            data: [5, 25, 20, 25, 28, 14],
            borderColor: colors[2],
            fill: 1,
            backgroundColor: hexToRGB(colors[2], 0.3),
          },
          {
            label: 'D3',
            data: [12, 45, 15, 35, 38, 24],
            borderColor: colors[3],
            fill: '-1',
            backgroundColor: hexToRGB(colors[3], 0.3),
          },
          {
            label: 'D4',
            data: [24, 38, 35, 15, 20, 10],
            borderColor: colors[4],
            fill: 8,
            backgroundColor: hexToRGB(colors[4], 0.3),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          filler: {
            propagate: false,
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,
            grid: {
              display: false,
            },
          },
        },
      },
    }
    return {
      config,
    }
  },
  mounted() {
    const canvasTag = <ChartItem>document.getElementById('dataset-example')
    new Chart(canvasTag, this.config)
  },
}
</script>
