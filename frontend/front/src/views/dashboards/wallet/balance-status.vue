<template>
  <div class="card">
    <div class="card-body pt-0 pb-1">
      <h4 class="header-title mt-3 mb-0">Balance Status</h4>
      <b-tabs pills align="end" lazy>
        <b-tab title="Day" active>
          <div dir="ltr">
            <BaseApexChart :height="350" :series="dayBalanceChart.series" :options="dayBalanceChart.options"/>
          </div>
        </b-tab>
        <b-tab title="Week">
          <div dir="ltr">
            <BaseApexChart :height="350" :series="weekBalanceChart.series" :options="weekBalanceChart.options"/>
          </div>
        </b-tab>
        <b-tab title="Month">
          <div dir="ltr">
            <BaseApexChart :height="350" :series="monthBalanceChart.series" :options="monthBalanceChart.options"/>
          </div>
        </b-tab>
        <b-tab title="Year">
          <div dir="ltr">
            <BaseApexChart :height="350" :series="yearBalanceChart.series" :options="yearBalanceChart.options"/>
          </div>
        </b-tab>
      </b-tabs>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseApexChart from '@/components/base-apex-chart.vue';

type BalanceDataPoint = [number, number];

interface BalanceChart {
  series: { data: BalanceDataPoint[] }[];
  options: ApexCharts.ApexOptions;
}

export default defineComponent({
  name: 'BalanceStatusCard',
  components: {
    BaseApexChart
  },
  data() {
    const generateEmptyChart = (): BalanceChart => ({
      series: [{ data: [] }],
      options: {
        chart: {
          type: 'area',
          height: 350,
          toolbar: { show: false }
        },
        colors: ['#0acf97'],
        dataLabels: { enabled: false },
        stroke: { width: 1 },
        markers: { size: 0, },
        xaxis: {
          type: 'datetime',
          tickAmount: 6
        },
        yaxis: {
          labels: {
            formatter: (value: number) => `$${value.toFixed(2)}`
          }
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0,
            stops: [0, 100]
          }
        }
      }
    });

    return {
      dayDummyData: [] as number[],
      weekDummyData: [] as number[],
      monthDummyData: [] as number[],
      yearDummyData: [] as number[],
      dayBalanceData: [] as BalanceDataPoint[],
      weekBalanceData: [] as BalanceDataPoint[],
      monthBalanceData: [] as BalanceDataPoint[],
      yearBalanceData: [] as BalanceDataPoint[],

      dayBalanceChart: generateEmptyChart(),
      weekBalanceChart: generateEmptyChart(),
      monthBalanceChart: generateEmptyChart(),
      yearBalanceChart: generateEmptyChart(),
    };
  },
  mounted() {
    this.dayDummyData = this.generateData();
    this.weekDummyData = this.generateData();
    this.monthDummyData = this.generateData();
    this.yearDummyData = this.generateData();

    for (let i = 0; i < 100; i++) {
      const date = new Date();
      this.dayBalanceData.push([
        date.setDate(date.getDate() + i - 100),
        this.dayDummyData[i]
      ]);
    }

    for (let i = 0; i < 100; i++) {
      const date = new Date();
      this.weekBalanceData.push([
        date.setDate(date.getDate() + i * 7 - 700),
        this.weekDummyData[i]
      ]);
    }

    for (let i = 0; i < 100; i++) {
      const date = new Date();
      this.monthBalanceData.push([
        date.setDate(date.getDate() + i * 30 - 3000),
        this.monthDummyData[i]
      ]);
    }

    for (let i = 0; i < 100; i++) {
      const date = new Date();
      this.yearBalanceData.push([
        date.setDate(date.getDate() + i * 365 - 36500),
        this.yearDummyData[i]
      ]);
    }

    // Update chart series
    this.dayBalanceChart.series[0].data = this.dayBalanceData;
    this.weekBalanceChart.series[0].data = this.weekBalanceData;
    this.monthBalanceChart.series[0].data = this.monthBalanceData;
    this.yearBalanceChart.series[0].data = this.yearBalanceData;
  },
  methods: {
    generateData(): number[] {
      const data: number[] = [];
      for (let i = 0; i < 100; i++) {
        data.push(5000 + Math.random() * 100000 + 0.8 * i * i * i);
      }
      return data;
    }
  }
});
</script>
