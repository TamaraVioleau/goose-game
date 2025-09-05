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

<button class="dice-button" on:click={openModal} aria-label="Lancer les dés">
  🎲
</button>

{#if showModal}
  <div class="overlay">
    <div class="modal">
      {#if !showResultText}
        <div class="dice">{getChar(die1)}</div>
        <div class="dice">{getChar(die2)}</div>
        <p class="result-text">VOTRE LANCER : {result}</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .dice-button {
    position: absolute;
    right: 20px;
    bottom: 20px;
    font-size: 28px;
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #0b2b4a;
    background: linear-gradient(135deg, #ffffff, #e6f3ff);
    box-shadow: 0 8px 20px rgba(0,0,0,0.18);
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    animation: pulse 1.6s ease-in-out infinite;
  }

  .dice-button:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 14px 30px rgba(0,0,0,0.22);
    background: linear-gradient(135deg, #ffffff, #d9ecff);
  }

  .dice-button:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2) inset;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
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
    background: linear-gradient(180deg, #ffffff, #f5f9ff);
    padding: 20px 24px;
    border-radius: 14px;
    display: flex;
    gap: 12px;
    align-items: center;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  }

  .dice {
    font-size: 40px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(160deg, #ffffff, #eef5ff);
    box-shadow: inset 0 0 0 1px #dce7f3, 0 4px 12px rgba(0,0,0,0.12);
  }

  .result-text {
    font-size: 20px;
    font-weight: 700;
    color: #0b2b4a;
    margin-left: 4px;
  }
</style>


