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
  import { fade, scale } from 'svelte/transition';

  export let visible: boolean;
  export let questionData: QuestionData | null = null;

  const dispatch = createEventDispatcher();

  let selected: string = '';
  let validated = false;
  let resultMessage = '';
  let wasCorrect = false;
  let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '_');
  }
  function getCategoryColor(name?: string) {
    if (!name) return '#3B82F6';
    const key = normalize(name);
    const map: Record<string, string> = {
      hygiene: '#EF4444',
      securite: '#6B21A8',
      accessibilite: '#3B82F6',
      accueil_client: '#F59E0B',
      accueil: '#F59E0B',
      allergenes: '#10B981'
    };
    return map[key] ?? '#3B82F6';
  }
  $: categoryColor = getCategoryColor(questionData?.category);

  const close = () => {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    visible = false;
    selected = '';
    validated = false;
    resultMessage = '';
    dispatch('close');
  };

  const validate = () => {
    if (!questionData) return;
    validated = true;
    wasCorrect = selected === questionData.answer;
    resultMessage = wasCorrect ? 'Bonne réponse !' : 'Mauvaise réponse !';
    dispatch('answered', { correct: wasCorrect });
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(() => close(), 1200);
  };

  function handleChoice(choice: string) {
    if (validated) return;
    selected = choice;
    validate();
  }
</script>

{#if visible && questionData}
<div class="overlay" role="presentation" transition:fade={{ duration: 250 }}>
  <div
    class="modal" tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-labelledby="qm-title"
    aria-describedby="qm-question"
    on:click|stopPropagation
    style={`--cat-color: ${categoryColor}`}
    transition:scale={{ duration: 250, start: 0.95 }}
  >
    <h2 id="qm-title" class="category-title">{questionData.category}</h2>

    <div id="qm-question" class="question-card">
      {questionData.question}
    </div>

    <div class="choices" role="group" aria-label="Choix de réponse">
      {#each questionData.choices as choice, i}
        <button
          type="button"
          class="choice-btn"
          on:click={() => handleChoice(choice)}
          disabled={validated}
        >
          <span class="choice-tag" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
          <span class="choice-text">{choice}</span>
        </button>
      {/each}
    </div>

    {#if validated}
      <p class="result" role="status">{resultMessage}</p>
    {/if}
  </div>
</div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    width: min(92vw, 560px);
    background: linear-gradient(180deg, #ffffff, #f7fbff);
    padding: 20px 22px;
    border-radius: 18px;
    box-shadow: 0 18px 48px rgba(0,0,0,0.22);
    border: 1px solid rgba(215, 227, 242, 0.8);
  }

  .category-title {
    margin: 0 0 10px 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: #0b2b4a;
    padding: 6px 10px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,1));
    box-shadow: inset 0 0 0 1px #d7e3f2;
  }

  .question-card {
    position: relative;
    margin: 8px 0 14px 0;
    padding: 14px 16px;
    background: linear-gradient(180deg, rgba(230,243,255,0.85), #ffffff);
    border-radius: 14px;
    border: 2px solid var(--cat-color);
    color: #0b2b4a;
    box-shadow: 0 10px 24px rgba(0,0,0,0.12);
  }

  .choices {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 6px;
  }

  .choice-btn {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 999px;
    background: #0b2b4a;
    color: #ffffff;
    border: 2px solid #ffffff;
    box-shadow: 0 8px 18px rgba(0,0,0,0.18);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }
  .choice-btn:hover:not(:disabled), .choice-btn:focus-visible:not(:disabled) {
    outline: none;
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(0,0,0,0.22);
    background: #0f3559;
  }
  .choice-btn:disabled {
    opacity: 0.85;
    cursor: default;
  }

  .choice-tag {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    color: #1b2430;
    background: linear-gradient(135deg, #ffd66e, #f59e0b);
    box-shadow: inset 0 0 0 2px rgba(255,255,255,0.85), 0 3px 8px rgba(0,0,0,0.18);
  }
  .choice-text { text-align: left; }

  .result {
    margin-top: 12px;
    font-weight: 800;
    color: #0b2b4a;
  }

  @media (prefers-reduced-motion: no-preference) {
    .choice-btn { will-change: transform; }
  }
</style>

