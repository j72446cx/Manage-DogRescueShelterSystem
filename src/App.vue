<template>
    <el-config-provider :locale="locale">
        <router-view />
    </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import locale from 'element-plus/es/locale/lang/en';
</script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
