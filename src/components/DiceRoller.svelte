<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let showModal = false;
  let rolling = false;
  let die1 = 1;
  let die2 = 1;
  let rollInterval: ReturnType<typeof setInterval>;

  const diceChars = ['\u2680','\u2681','\u2682','\u2683','\u2684','\u2685'];
  const getChar = (n: number) => diceChars[n - 1];

  function openModal() {
    showModal = true;
    rolling = true;
    rollInterval = setInterval(() => {
      die1 = Math.floor(Math.random() * 6) + 1;
      die2 = Math.floor(Math.random() * 6) + 1;
    }, 100);
    setTimeout(() => {
      clearInterval(rollInterval);
      die1 = Math.floor(Math.random() * 6) + 1;
      die2 = Math.floor(Math.random() * 6) + 1;
      rolling = false;
      dispatch('rolled', { total: die1 + die2 });
      setTimeout(() => {
        showModal = false;
      }, 3000);
    }, 2000);
  }
</script>

<button class="dice-button" on:click={openModal}>
  🎲
</button>

{#if showModal}
  <div class="overlay">
    <div class="modal">
      <div class="dice" class:rolling={rolling}>{getChar(die1)}</div>
      <div class="dice" class:rolling={rolling}>{getChar(die2)}</div>
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

  .rolling {
    animation: spin 0.5s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
