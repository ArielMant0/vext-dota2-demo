<template>
    <div class="d-flex flex-column align-center ma-6">
        <div class="text-h5">{{ title }}</div>
        <div class="text-subtitle-1">{{ description }}</div>
    </div>
</template>

<script setup>

    const props = defineProps({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
    })
</script>