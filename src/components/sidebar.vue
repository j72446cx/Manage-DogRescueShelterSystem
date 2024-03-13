<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-sub-menu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                                v-permiss="item.permiss"
                            >
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';

const items = [
    {
        icon: 'Odometer',
        index: '/dashboard',
        title: 'Dashboard',
        permiss: '1',
    },
    {
        icon: 'List',
        index: '1',
        title: 'Tables',
        permiss: '2',
        subs: [
            {
                index: '/table',
                title: 'Dog Table',
                permiss: '2',
            },
            {
                index: '/staff_table',
                title: 'Staff Table',
                permiss: '2',
            },
            // {
            //     index: '/export',
            //     title: '导出Excel',
            //     permiss: '2',
            // },
        ],
    },
  {
    icon: 'Plus',
    index: '3',
    title: 'Forms',
    permiss: '4',
    subs: [
      {
        index: '/form',
        title: 'Dog Registration',
        permiss: '5',
      },
      {
        index: 'new_staff',
        title: 'Staff Registration',
        permiss: '5'
      },
      {
        index: '/formGrooming',
        title: 'Grooming Schedule',
        permiss: '5'
      },
      {
        index: '/formExercise',
        title: 'Exercise Schedule',
        permiss: '5'
      },
      {
        index: '/formMedication',
        title: 'Medication Schedule',
        permiss: '5'
      }
    ],
  },
    {
        icon: 'Message',
        index: '/tabs',
        title: 'Message Center',
        permiss: '3',
    },
    {
        icon: 'Calendar',
        index: '/icon',
        title: 'Calendar',
        permiss: '10',
    },
    {
        icon: 'Tickets',
        index: '/charts',
        title: 'Applications',
        permiss: '11',
    },
    // {
    //     icon: 'Warning',
    //     index: '/permission',
    //     title: 'Permission Control',
    //     permiss: '13',
    // }
    // ,
    // {
    //     icon: 'CoffeeCup',
    //     index: '/donate',
    //     title: '支持作者',
    //     permiss: '14',
    // },
];

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
