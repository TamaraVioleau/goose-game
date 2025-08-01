<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let showModal = false;
  let showResultText = false;
  let result = 0;
  let die1 = 1;
  let die2 = 1;
  let rollInterval: ReturnType<typeof setInterval>;

  const diceChars = ['\u2680','\u2681','\u2682','\u2683','\u2684','\u2685'];
  const getChar = (n: number) => diceChars[n - 1];

  function openModal() {
    showModal = true;
    showResultText = false;
    rollInterval = setInterval(() => {
      die1 = Math.floor(Math.random() * 6) + 1;
      die2 = Math.floor(Math.random() * 6) + 1;
    }, 100);
    setTimeout(() => {
      clearInterval(rollInterval);
      die1 = Math.floor(Math.random() * 6) + 1;
      die2 = Math.floor(Math.random() * 6) + 1;
      result = die1 + die2;
      dispatch('rolled', { total: result });
      setTimeout(() => {
        showResultText = true;
        setTimeout(() => {
          showModal = false;
          showResultText = false;
        }, 3000);
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
      {#if !showResultText}
        <div class="dice">{getChar(die1)}</div>
        <div class="dice">{getChar(die2)}</div>
      {:else}
        <p class="result-text">VOTRE LANCER : {result}</p>
      {/if}
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

  .result-text {
    font-size: 24px;
    font-weight: bold;
  }
</style>
