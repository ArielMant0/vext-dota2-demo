<template>
    <div class="d-flex flex-column align-center">
    <div class="mt-2 mb-2">
        <v-btn v-for="(role, idx) in roles"
            :class="[idx > 0 ? 'ml-1' : '']"
            :color="roleFilters.includes(role) ? 'primary' : 'default'"
            @click="toggleHighlightByRole(role)">{{ role }}</v-btn>
    </div>

    <div class="d-flex">
        <div class="d-flex flex-column align-center ma-1" style="width: 25%">
            <div class="d-flex align-center">
                <v-img :src="getAttributeSrc('Strength')" width="30" max-width="30" class="mr-1"/>
                Strength Heroes
            </div>
            <HeroGrid :data="heroesSTR" :roles="roleFilters" :width="width" :color="colorSTR" @click="onClick"/>
        </div>
        <div class="d-flex flex-column align-center ma-1" style="width: 25%">
            <div class="d-flex align-center">
                <v-img :src="getAttributeSrc('Agility')" width="30" max-width="30" class="mr-1"/>
                Agility Heroes
            </div>
            <HeroGrid :data="heroesAGI" :roles="roleFilters" :width="width" :color="colorAGI" @click="onClick"/>
        </div>
        <div class="d-flex flex-column align-center ma-1" style="width: 25%">
            <div class="d-flex align-center">
                <v-img :src="getAttributeSrc('Intelligence')" width="30" max-width="30" class="mr-1"/>
                Intelligence Heroes
            </div>
            <HeroGrid :data="heroesINT" :roles="roleFilters"  :width="width" :color="colorINT" @click="onClick"/>
        </div>
        <div class="d-flex flex-column align-center ma-1" style="width: 25%">
            <div class="d-flex align-center">
                <v-img :src="getAttributeSrc('Universal')" width="30" max-width="30" class="mr-1"/>
                Universal Heroes
            </div>
            <HeroGrid :data="heroesUNI" :roles="roleFilters" :width="width" :color="colorUNI" @click="onClick"/>
        </div>
    </div>
    </div>
</template>

<script setup>
    import HeroGrid from '@/components/HeroGrid.vue'
    import { useApp } from '@/store/app'
    import { storeToRefs } from 'pinia'
    import { getAttributeSrc } from '@/use/utils'
    import { reactive } from 'vue';

    const app = useApp();
    const {
        heroesSTR, heroesAGI, heroesINT, heroesUNI,
        colorSTR, colorAGI, colorINT, colorUNI,
        roles
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

    const roleFilters = reactive([])

    function isHighlighted(hero) {
        return roleFilters.length === 0 || roleFilters.every(d => hero.roles.includes(d))
    }

    function toggleHighlightByRole(role) {
        const idx = roleFilters.indexOf(role);
        if (idx >= 0) {
            roleFilters.splice(idx, 1);
        } else {
            roleFilters.push(role);
        }
        app.highlightHeroBy(isHighlighted);
    }

</script>