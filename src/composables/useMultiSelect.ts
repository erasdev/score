import { reactive } from 'vue';

const state = reactive({
  activeId: null as symbol | null
});

export function useMultiSelect() {
  const instanceId = Symbol();

  const isActive = () => state.activeId === instanceId;
  
  const activate = () => {
    state.activeId = instanceId;
  };

  const deactivate = () => {
    state.activeId = null;
  };

  return {
    instanceId,
    isActive,
    activate,
    deactivate,
  };
} 