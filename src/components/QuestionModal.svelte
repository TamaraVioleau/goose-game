<script lang="ts" context="module">
  export interface QuestionData {
    category: string;
    question: string;
    choices: string[];
    answer: string;
    explanation: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let visible: boolean;
  export let questionData: QuestionData | null = null;

  const dispatch = createEventDispatcher();

  let selected: string = '';
  let validated = false;
  let resultMessage = '';

  const close = () => {
    visible = false;
    selected = '';
    validated = false;
    resultMessage = '';
    dispatch('close');
  };

  const validate = () => {
    if (!questionData) return;
    validated = true;
    resultMessage =
      selected === questionData.answer ? 'Bonne réponse !' : 'Mauvaise réponse !';
  };
</script>

{#if visible && questionData}
<div class="overlay" on:click={close}>
  <div class="modal" on:click|stopPropagation>
    <h2>{questionData.category}</h2>
    <p>{questionData.question}</p>

    <form>
      {#each questionData.choices as choice}
        <label class="choice">
          <input type="radio" bind:group={selected} value={choice} disabled={validated} />
          {choice}
        </label>
      {/each}
    </form>

    {#if !validated}
      <button on:click={validate} disabled={selected === ''}>Valider</button>
    {:else}
      <p class="result">{resultMessage}</p>
      <p class="explanation">{questionData.explanation}</p>
    {/if}

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
  .choice {
    display: block;
    margin-bottom: 8px;
  }
  .result {
    font-weight: bold;
    margin-top: 10px;
  }
  .explanation {
    font-style: italic;
    margin-top: 4px;
  }
</style>
