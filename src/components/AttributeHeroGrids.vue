<template>
    <div class="d-flex">
        <div class="d-flex flex-column align-center ma-1" style="width: 25%">
            <div class="d-flex align-center">
                <v-img :src="getAttributeSrc('Strength')" width="30" max-width="30" class="mr-1"/>
                Strength Heroes
            </div>
            <HeroGrid :data="heroesSTR" :width="width" :color="colorSTR" @click="onClick"/>
        </div>
        <div class="d-flex flex-column align-center ma-1" style="width: 25%">
            <div class="d-flex align-center">
                <v-img :src="getAttributeSrc('Agility')" width="30" max-width="30" class="mr-1"/>
                Agility Heroes
            </div>
            <HeroGrid :data="heroesAGI" :width="width" :color="colorAGI" @click="onClick"/>
        </div>
        <div class="d-flex flex-column align-center ma-1" style="width: 25%">
            <div class="d-flex align-center">
                <v-img :src="getAttributeSrc('Intelligence')" width="30" max-width="30" class="mr-1"/>
                Intelligence Heroes
            </div>
            <HeroGrid :data="heroesINT" :width="width" :color="colorINT" @click="onClick"/>
        </div>
        <div class="d-flex flex-column align-center ma-1" style="width: 25%">
            <div class="d-flex align-center">
                <v-img :src="getAttributeSrc('Universal')" width="30" max-width="30" class="mr-1"/>
                Universal Heroes
            </div>
            <HeroGrid :data="heroesUNI" :width="width" :color="colorUNI" @click="onClick"/>
        </div>
    </div>
</template>

<script setup>
    import HeroGrid from '@/components/HeroGrid.vue'
    import { useApp } from '@/store/app'
    import { storeToRefs } from 'pinia'
    import { getAttributeSrc } from '@/use/utils'

    const app = useApp();
    const {
        heroesSTR, heroesAGI, heroesINT, heroesUNI,
        colorSTR, colorAGI, colorINT, colorUNI
    } = storeToRefs(app);

    const props = defineProps({
        width: {
            type: Number,
            default: 150
        }
    })
    const emit = defineEmits(["click"]);

    function onClick(item) {
        emit("click", item);
    }

</script>