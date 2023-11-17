<template>
	<div class="container">
<!--		<div class="schart-box">-->
<!--			<div class="content-title"></div>-->
<!--			<schart class="schart" canvasId="bar" :options="options1"></schart>-->
<!--		</div>-->
<!--		<div class="schart-box">-->
<!--			<div class="content-title"></div>-->
<!--			<schart class="schart" canvasId="line" :options="options2"></schart>-->
<!--		</div>-->
		<div class="schart-box">
			<div class="content-title"></div>
			<schart class="schart" canvasId="pie" :options="options3"></schart>
		</div>
		<div class="schart-box">
			<div class="content-title"></div>
			<schart class="schart" canvasId="ring" :options="options4"></schart>
		</div>
	</div>
</template>

<script setup lang="ts" name="basecharts">
import Schart from 'vue-schart';

const options1 = {
	type: 'bar',
	title: {
		text: ''
	},
	bgColor: '#fbfbfb',
	labels: [],
	datasets: [
		{
			label: '',
			fillColor: 'rgba(241, 49, 74, 0.5)',
			data: [234, 278, 270, 190, 230]
		},
		{
			label: '',
			data: [164, 178, 190, 135, 160]
		},
		{
			label: '',
			data: [144, 198, 150, 235, 120]
		}
	]
};
const options2 = {
	type: 'line',
	title: {
		text: ''
	},
	bgColor: '#fbfbfb',
	labels: [],
	datasets: [
		{
			label: '',
			data: [234, 278, 270, 190, 230]
		},
		{
			label: '',
			data: [164, 178, 150, 135, 160]
		},
		{
			label: '',
			data: [114, 138, 200, 235, 190]
		}
	]
};
const options3 = {
	type: 'pie',
	title: {
		text: ''
	},
	legend: {
		position: 'left'
	},
	bgColor: '#fbfbfb',
	labels: ['1', '2', '3', '4', '5', '6', '7'],
	datasets: [
		{
			data: [334, 278, 190, 235, 260, 200, 141]
		}
	]
};
const options4 = {
	type: 'ring',
	title: {
		text: ''
	},
	showValue: false,
	legend: {
		position: 'bottom',
		bottom: 40
	},
	bgColor: '#fbfbfb',
	labels: ['vue', 'react', 'angular'],
	datasets: [
		{
			data: [500, 500, 500]
		}
	]
};
</script>

<style scoped>
.schart-box {
	display: inline-block;
	margin: 20px;
}
.schart {
	width: 600px;
	height: 400px;
}
.content-title {
	clear: both;
	font-weight: 400;
	line-height: 50px;
	margin: 10px 0;
	font-size: 22px;
	color: #1f2f3d;
}
</style>
