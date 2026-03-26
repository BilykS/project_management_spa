import { ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export function useDraggableList<T>(source: ComputedRef<T[]> | Ref<T[]>): Ref<T[]> {
  const local = ref<T[]>([]) as Ref<T[]>
  watch(source, (val) => { local.value = [...val] }, { immediate: true })
  return local
}
