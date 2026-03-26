<template>
  <div class="toolbar">
    <div class="toolbar__filters">
      <input
        :value="searchValue"
        class="filter-input"
        type="search"
        :placeholder="searchPlaceholder"
        @input="emit('update:searchValue', ($event.target as HTMLInputElement).value)"
      />
      <div class="select-wrapper">
        <select
          :value="statusValue"
          class="filter-select"
          @change="onStatusChange"
        >
          <option value="">Всі статуси</option>
          <option v-for="s in statusOptions" :key="s.value" :value="s.value">
            {{ s.label }}
          </option>
        </select>
        <ChevronDown :size="14" class="select-wrapper__icon" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

interface StatusOption {
  value: string
  label: string
}

const props = defineProps<{
  searchValue:       string
  statusValue:       string
  searchPlaceholder: string
  statusOptions:     StatusOption[]
}>()

const emit = defineEmits<{
  'update:searchValue': [value: string]
  'update:statusValue': [value: string]
}>()

function onStatusChange(e: Event): void {
  const select = e.target as HTMLSelectElement
  emit('update:statusValue', select.value)
  select.blur()
}
</script>

<style scoped lang="scss">
.toolbar {
  @include flex-between;
  gap: $spacing-4;
  flex-wrap: wrap;

  &__filters {
    @include flex-start;
    gap: $spacing-3;
    flex: 1;
    min-width: 0;
  }
}

.filter-input,
.filter-select {
  padding: $spacing-2 $spacing-3;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  color: $color-text-primary;
  background: $color-bg-primary;
  outline: none;
  transition: border-color $transition-fast, box-shadow $transition-fast;

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.12);
  }
}

.filter-input  { width: 220px; }
.filter-select {
  width: 150px;
  cursor: pointer;
  appearance: none;
  padding-right: $spacing-8;
}

.select-wrapper {
  position: relative;

  &__icon {
    position: absolute;
    right: $spacing-3;
    top: 50%;
    transform: translateY(-50%);
    color: $color-text-muted;
    pointer-events: none;
    transition: transform $transition-fast;
  }

  &:focus-within &__icon {
    transform: translateY(-50%) rotate(180deg);
  }
}
</style>
