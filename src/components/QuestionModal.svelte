<script lang="ts">
  export let visible: boolean;
  export let question: string = '';
  const close = () => {
    visible = false;
    dispatch('close');
  };
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

{#if visible}
<div class="overlay" on:click={close}>
  <div class="modal" on:click|stopPropagation>
    <p>{question}</p>
    <button on:click={close}>Fermer</button>
  </div>
</div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 300px;
  }
</style>
