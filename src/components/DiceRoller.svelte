<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let showModal = false;
  let die1 = 1;
  let die2 = 1;

  function openModal() {
    roll();
    showModal = true;
  }

  function roll() {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    dispatch('rolled', { total: die1 + die2 });
  }
</script>

<button class="dice-button" on:click={openModal}>
  🎲
</button>

{#if showModal}
  <div class="overlay" on:click={() => (showModal = false)}>
    <div class="modal" on:click|stopPropagation>
      <div class="dice">{die1}</div>
      <div class="dice">{die2}</div>
      <button on:click={() => (showModal = false)}>Ok</button>
    </div>
  </div>
{/if}

<style>
  .dice-button {
    position: fixed;
    top: 10px;
    right: 10px;
    font-size: 32px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .dice {
    font-size: 40px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
