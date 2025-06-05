<template>
  <canvas id="stacked-example"></canvas>
</template>

<script lang="ts">
import {
  Chart,
  type ChartConfiguration,
  type ChartItem,
  type ChartTypeRegistry,
} from 'chart.js/auto'

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
            fill: true,
            backgroundColor: colors[0],
          },
          {
            label: 'D1',
            data: [12, 18, 18, 33, 41, 20],
            borderColor: colors[1],
            fill: true,
            backgroundColor: colors[1],
          },
          {
            label: 'D2',
            data: [5, 25, 20, 25, 28, 14],
            borderColor: colors[2],
            fill: true,
            backgroundColor: colors[2],
          },
          {
            label: 'D3',
            data: [12, 45, 15, 35, 38, 24],
            borderColor: colors[3],
            fill: true,
            backgroundColor: colors[3],
          },
          {
            label: 'D4',
            data: [24, 38, 35, 15, 20, 10],
            borderColor: colors[4],
            fill: true,
            backgroundColor: colors[4],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month',
            },

            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Value',
            },
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
    const canvasTag = <ChartItem>document.getElementById('stacked-example')
    new Chart(canvasTag, this.config)
  },
}
</script>
