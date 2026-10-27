// ============================================================================
// STACK MASTER: LIFO ARENA (v2.0)
// Complete Data Structure Game Engine for Stack Concepts
// Computer Science Fundamentals & Interactive Algorithms
// ============================================================================

// Global Audio Engine Helper (shares AudioContext if available)
let smAudioCtx = null;
let smAudioEnabled = true;

function smGetAudioContext() {
  if (!smAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      smAudioCtx = new AudioContextClass();
    }
  }
  if (smAudioCtx && smAudioCtx.state === 'suspended') {
    smAudioCtx.resume();
  }
  return smAudioCtx;
}

function smPlayTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
  if (!smAudioEnabled) return;
  try {
    const ctx = smGetAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(gainVal, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context may be restricted before user interaction
  }
}

function smPlayPushSound() {
  smPlayTone(380, 'sine', 0.12, 0.12);
  setTimeout(() => smPlayTone(520, 'sine', 0.14, 0.1), 60);
}

function smPlayPopSound() {
  smPlayTone(600, 'triangle', 0.1, 0.12);
  setTimeout(() => smPlayTone(350, 'triangle', 0.15, 0.1), 70);
}

function smPlayPeekSound() {
  smPlayTone(900, 'sine', 0.2, 0.1);
}

function smPlayErrorSound() {
  smPlayTone(160, 'sawtooth', 0.28, 0.18);
}

function smPlaySuccessSound() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    setTimeout(() => smPlayTone(freq, 'sine', 0.22, 0.12), idx * 90);
  });
}

// ----------------------------------------------------------------------------
// Stack Master Global Navigation & State
// ----------------------------------------------------------------------------
let smCurrentLevel = 1;

function smSwitchLevel(lvl) {
  smCurrentLevel = lvl;

  // Update nav buttons
  for (let i = 1; i <= 7; i++) {
    const btn = document.getElementById(`sm-nav-lvl${i}`);
    const sec = document.getElementById(`sm-level-${i}`);
    if (btn && sec) {
      if (i === lvl) {
        btn.className = 'w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between bg-violet-600 text-white font-bold border border-violet-400 shadow-md';
        sec.classList.remove('hidden');
      } else {
        btn.className = 'w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium';
        sec.classList.add('hidden');
      }
    }
  }

  smUpdateTopStatCards(lvl);

  if (lvl === 1) smRenderL1();
  else if (lvl === 2) smInitL2();
  else if (lvl === 3) smInitL3();
  else if (lvl === 4) smInitL4();
  else if (lvl === 5) smInitL5();
  else if (lvl === 6) smInitL6();
  else if (lvl === 7) smInitL7Quiz();

  showToast(`Switched to Stack Level ${lvl}`, 'info');
  if (window.lucide) window.lucide.createIcons();
}

function smResetCurrentLevel() {
  if (smCurrentLevel === 1) smResetL1();
  else if (smCurrentLevel === 2) smResetL2();
  else if (smCurrentLevel === 3) smResetL3();
  else if (smCurrentLevel === 4) smResetL4();
  else if (smCurrentLevel === 5) smResetL5();
  else if (smCurrentLevel === 6) smResetL6();
  else if (smCurrentLevel === 7) smInitL7Quiz();
  showToast(`Stack Level ${smCurrentLevel} Reset`, 'info');
  if (window.lucide) window.lucide.createIcons();
}

function smUpdateTopStatCards(lvl) {
  const card1Val = document.getElementById('sm-top-card1-val');
  const card1Sub = document.getElementById('sm-top-card1-sub');
  const card1Foot = document.getElementById('sm-top-card1-foot');

  const card2Val = document.getElementById('sm-top-card2-val');
  const card2Sub = document.getElementById('sm-top-card2-sub');
  const card2Foot = document.getElementById('sm-top-card2-foot');

  const card3Val = document.getElementById('sm-top-card3-val');
  const card3Sub = document.getElementById('sm-top-card3-sub');
  const card3Foot = document.getElementById('sm-top-card3-foot');

  if (lvl === 1) {
    if (card1Val) card1Val.innerText = `${smStack.length} / ${smL1Capacity}`;
    if (card1Sub) card1Sub.innerText = `Top Pointer: ${smStack.length - 1}`;
    if (card1Foot) card1Foot.innerHTML = `Mode: <strong class="text-violet-400 font-bold">${smL1Dynamic ? 'Dynamic Linked' : 'Fixed Array (Max=6)'}</strong>`;

    if (card2Val) card2Val.innerText = 'O(1)';
    if (card2Sub) card2Sub.innerText = 'Push, Pop & Peek';
    if (card2Foot) card2Foot.innerText = 'Constant Time Operations';

    if (card3Val) card3Val.innerText = 'LIFO';
    if (card3Sub) card3Sub.innerText = 'Last-In, First-Out';
    if (card3Foot) card3Foot.innerHTML = 'Pointer: <strong class="text-amber-400 font-bold">TOP only</strong>';
  } else if (lvl === 2) {
    if (card1Val) card1Val.innerText = 'POLISH';
    if (card1Sub) card1Sub.innerText = 'Postfix & Infix Engine';
    if (card1Foot) card1Foot.innerHTML = 'Module: <strong class="text-violet-400 font-bold">Expression Evaluator</strong>';

    if (card2Val) card2Val.innerText = 'O(N)';
    if (card2Sub) card2Sub.innerText = 'Single Pass Scan';
    if (card2Foot) card2Foot.innerText = 'Left-to-Right Iteration';

    if (card3Val) card3Val.innerText = 'OPERANDS';
    if (card3Sub) card3Sub.innerText = 'Stack Stores Numbers';
    if (card3Foot) card3Foot.innerHTML = 'Operators: <strong class="text-emerald-400 font-bold">Pop 2 & Evaluate</strong>';
  } else if (lvl === 3) {
    if (card1Val) card1Val.innerText = 'SYNTAX';
    if (card1Sub) card1Sub.innerText = 'Bracket Validator';
    if (card1Foot) card1Foot.innerHTML = 'Pairs: <strong class="text-violet-400 font-bold">(), {}, []</strong>';

    if (card2Val) card2Val.innerText = 'O(N)';
    if (card2Sub) card2Sub.innerText = 'Time & O(N) Space';
    if (card2Foot) card2Foot.innerText = 'LIFO Nested Check';

    if (card3Val) card3Val.innerText = 'BALANCED';
    if (card3Sub) card3Sub.innerText = 'Stack Empty at End';
    if (card3Foot) card3Foot.innerHTML = 'Status: <strong class="text-emerald-400 font-bold">Sentinel Active</strong>';
  } else if (lvl === 4) {
    if (card1Val) card1Val.innerText = smL4Mode.toUpperCase();
    if (card1Sub) card1Sub.innerText = smL4Mode === 'nge' ? 'Next Greater Element' : 'Previous Greater Element';
    if (card1Foot) card1Foot.innerHTML = 'Stack: <strong class="text-violet-400 font-bold">Monotonic Decreasing</strong>';

    if (card2Val) card2Val.innerText = 'O(N)';
    if (card2Sub) card2Sub.innerText = 'Linear Time vs O(N²)';
    if (card2Foot) card2Foot.innerText = 'Each item pushed/popped once';

    if (card3Val) card3Val.innerText = '-1';
    if (card3Sub) card3Sub.innerText = 'Fallback when none exists';
    if (card3Foot) card3Foot.innerHTML = 'Complexity: <strong class="text-amber-400 font-bold">Optimal DS</strong>';
  } else if (lvl === 5) {
    if (card1Val) card1Val.innerText = 'TRANSFORM';
    if (card1Sub) card1Sub.innerText = 'Reversal & Radix Lab';
    if (card1Foot) card1Foot.innerHTML = 'Applications: <strong class="text-violet-400 font-bold">Reversal & Radix</strong>';

    if (card2Val) card2Val.innerText = 'O(N)';
    if (card2Sub) card2Sub.innerText = 'String & Remainder Stack';
    if (card2Foot) card2Foot.innerText = 'Push all then pop';

    if (card3Val) card3Val.innerText = 'RADIX';
    if (card3Sub) card3Sub.innerText = 'Base 2, 8, & 16';
    if (card3Foot) card3Foot.innerHTML = 'Remainders: <strong class="text-cyan-400 font-bold">Popped in Reverse</strong>';
  } else if (lvl === 6) {
    if (card1Val) card1Val.innerText = 'DYNAMIC';
    if (card1Sub) card1Sub.innerText = 'Linked List & Recursion';
    if (card1Foot) card1Foot.innerHTML = 'Pointers: <strong class="text-violet-400 font-bold">[data | next*]</strong>';

    if (card2Val) card2Val.innerText = 'O(1)';
    if (card2Sub) card2Sub.innerText = 'Dynamic Node Allocation';
    if (card2Foot) card2Foot.innerText = 'No Static Overflow Limit';

    if (card3Val) card3Val.innerText = 'FRAMES';
    if (card3Sub) card3Sub.innerText = 'Call Stack Execution';
    if (card3Foot) card3Foot.innerHTML = 'Activation: <strong class="text-emerald-400 font-bold">Push Call / Pop Return</strong>';
  } else if (lvl === 7) {
    if (card1Val) card1Val.innerText = '❤️'.repeat(smQuizLives) || '💀';
    if (card1Sub) card1Sub.innerText = `${smQuizLives} Lives Remaining`;
    if (card1Foot) card1Foot.innerHTML = `Question: <strong class="text-violet-400 font-bold">${smQuizIdx + 1} / ${smQuizQuestions.length}</strong>`;

    if (card2Val) card2Val.innerText = `${smQuizScore}`;
    if (card2Sub) card2Sub.innerText = 'Total Points Earned';
    if (card2Foot) card2Foot.innerText = 'Target: 800 PTS';

    if (card3Val) card3Val.innerText = `🔥 x${smQuizStreak}`;
    if (card3Sub) card3Sub.innerText = 'Streak Multiplier';
    if (card3Foot) card3Foot.innerHTML = `Bonus: <strong class="text-amber-400 font-bold">+${smQuizStreak * 25} PTS</strong>`;
  }
}

// ============================================================================
// LEVEL 1: LIFO CAFETERIA (CORE STACK FUNDAMENTALS)
// ============================================================================
let smStack = [];
const smL1Capacity = 6;
let smL1Dynamic = false;
let smL1OpsCount = 0;
let smPlateCounter = 1;

const smPlateLibrary = [
  { name: 'Pancake Stack', icon: '🥞', color: 'from-amber-400 to-amber-600 border-amber-300' },
  { name: 'Pizza Margherita', icon: '🍕', color: 'from-rose-500 to-red-700 border-rose-300' },
  { name: 'Berry Velvet Cake', icon: '🍰', color: 'from-pink-500 to-rose-600 border-pink-300' },
  { name: 'Supreme Burger', icon: '🍔', color: 'from-orange-500 to-amber-700 border-orange-300' },
  { name: 'Glazed Donut', icon: '🍩', color: 'from-purple-500 to-indigo-600 border-purple-300' },
  { name: 'Tokyo Sushi Roll', icon: '🍣', color: 'from-emerald-500 to-teal-700 border-emerald-300' },
  { name: 'Crispy Taco', icon: '🌮', color: 'from-yellow-500 to-amber-600 border-yellow-300' }
];

function smResetL1() {
  smStack = [
    { id: 1, name: 'Pancake Stack', icon: '🥞', val: 10, color: 'from-amber-400 to-amber-600 border-amber-300' },
    { id: 2, name: 'Pizza Margherita', icon: '🍕', val: 25, color: 'from-rose-500 to-red-700 border-rose-300' },
    { id: 3, name: 'Supreme Burger', icon: '🍔', val: 40, color: 'from-orange-500 to-amber-700 border-orange-300' }
  ];
  smPlateCounter = 4;
  smL1OpsCount = 0;
  smRenderL1();
}

function smToggleL1Mode() {
  smL1Dynamic = !smL1Dynamic;
  const badge = document.getElementById('sm-mode-badge');
  if (badge) {
    badge.innerText = smL1Dynamic ? 'DYNAMIC LINKED LIST (NO LIMIT)' : 'FIXED SIZE ARRAY (MAX = 6)';
    badge.className = smL1Dynamic
      ? 'px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-900/60 text-purple-300 border border-purple-500'
      : 'px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-900/60 text-amber-300 border border-amber-500';
  }
  showToast(smL1Dynamic ? 'Switched to Dynamic Stack (Heap Memory)' : 'Switched to Fixed Size Array (Max: 6)', 'info');
  smRenderL1();
}

function smPushL1(customVal = null) {
  // Check Stack Overflow
  if (!smL1Dynamic && smStack.length >= smL1Capacity) {
    smPlayErrorSound();
    smTriggerL1Alarm('overflow');
    showToast('⚠️ STACK OVERFLOW: Capacity reached (top == N - 1)! Cannot push more elements into fixed array.', 'error');
    smHighlightCCode('overflow');
    return;
  }

  const randomPlate = smPlateLibrary[Math.floor(Math.random() * smPlateLibrary.length)];
  const inputEl = document.getElementById('sm-push-input');
  const val = customVal !== null ? customVal : (inputEl && inputEl.value.trim() ? inputEl.value.trim() : Math.floor(Math.random() * 90 + 10));
  if (inputEl) inputEl.value = '';

  const newPlate = {
    id: smPlateCounter++,
    name: randomPlate.name,
    icon: randomPlate.icon,
    val: val,
    color: randomPlate.color
  };

  smStack.push(newPlate);
  smL1OpsCount++;
  smPlayPushSound();
  showToast(`PUSH: Added "${newPlate.icon} ${newPlate.name} (${val})" onto TOP (Index [${smStack.length - 1}])`, 'success');
  smHighlightCCode('push');

  smCheckL1Win();
  smRenderL1();
}

function smPopL1() {
  // Check Stack Underflow
  if (smStack.length === 0) {
    smPlayErrorSound();
    smTriggerL1Alarm('underflow');
    showToast('⚠️ STACK UNDERFLOW: Stack is empty (top == -1)! Cannot pop from an empty stack.', 'error');
    smHighlightCCode('underflow');
    return;
  }

  smPlayPopSound();
  const popped = smStack.pop();
  smL1OpsCount++;
  showToast(`POP: Removed "${popped.icon} ${popped.name} (${popped.val})" from TOP (New Top: [${smStack.length - 1}])`, 'info');
  smHighlightCCode('pop');

  smCheckL1Win();
  smRenderL1();
}

function smPeekL1() {
  if (smStack.length === 0) {
    smPlayErrorSound();
    showToast('Stack is empty! Nothing to peek (top == -1).', 'error');
    return;
  }

  smPlayPeekSound();
  const topItem = smStack[smStack.length - 1];
  showToast(`🔍 PEEK: Topmost item is "${topItem.icon} ${topItem.name}" (Val: ${topItem.val}) at Index [${smStack.length - 1}]`, 'info');

  const topEl = document.getElementById(`sm-plate-${smStack.length - 1}`);
  if (topEl) {
    topEl.classList.add('ring-4', 'ring-amber-300', 'scale-105');
    setTimeout(() => topEl.classList.remove('ring-4', 'ring-amber-300', 'scale-105'), 1400);
  }
}

function smOnPlateClick(index) {
  const topIdx = smStack.length - 1;
  if (index === topIdx) {
    smPopL1();
  } else {
    // LIFO Violation!
    smPlayErrorSound();
    const clickedItem = smStack[index];
    const topItem = smStack[topIdx];

    const modal = document.getElementById('sm-lifo-modal');
    const msg = document.getElementById('sm-lifo-modal-msg');
    if (modal && msg) {
      msg.innerHTML = `
        You clicked <strong class="text-rose-400 font-bold">${clickedItem.icon} ${clickedItem.name}</strong> at <strong>Index [${index}]</strong>, but <strong class="text-amber-300 font-bold">${topItem.icon} ${topItem.name}</strong> is currently at the <strong>TOP (Index [${topIdx}])</strong>!
        <br><br>
        <span class="text-xs text-amber-200 font-mono font-bold">
          Rule: A Stack follows strict LIFO (Last-In, First-Out). Elements can ONLY be inserted or removed from the TOP. Attempting to pull an item from the middle or bottom would collapse the stack!
        </span>
      `;
      modal.classList.remove('hidden');
    }

    const clickedEl = document.getElementById(`sm-plate-${index}`);
    if (clickedEl) {
      clickedEl.classList.add('shake-error');
      setTimeout(() => clickedEl.classList.remove('shake-error'), 450);
    }
  }
}

function smCloseLifoModal() {
  const modal = document.getElementById('sm-lifo-modal');
  if (modal) modal.classList.add('hidden');
}

function smTriggerL1Alarm(type) {
  const chamber = document.getElementById('sm-stack-chamber');
  if (!chamber) return;
  chamber.classList.add('border-rose-500', 'shake-error');
  setTimeout(() => chamber.classList.remove('border-rose-500', 'shake-error'), 500);
}

function smHighlightCCode(action) {
  ['push-1', 'push-2', 'pop-1', 'pop-2'].forEach(id => {
    const el = document.getElementById(`sm-code-${id}`);
    if (el) el.classList.remove('bg-violet-900/80', 'text-amber-300');
  });

  if (action === 'overflow') {
    const el = document.getElementById('sm-code-push-1');
    if (el) el.classList.add('bg-rose-900/80', 'text-rose-200');
  } else if (action === 'push') {
    const el = document.getElementById('sm-code-push-2');
    if (el) el.classList.add('bg-violet-900/80', 'text-amber-300');
  } else if (action === 'underflow') {
    const el = document.getElementById('sm-code-pop-1');
    if (el) el.classList.add('bg-rose-900/80', 'text-rose-200');
  } else if (action === 'pop') {
    const el = document.getElementById('sm-code-pop-2');
    if (el) el.classList.add('bg-violet-900/80', 'text-amber-300');
  }
}

function smRenderL1() {
  if (smCurrentLevel === 1) smUpdateTopStatCards(1);

  const size = smStack.length;
  const topIdx = size - 1;

  // Header Counters
  const progText = document.getElementById('sm-l1-progress');
  if (progText) progText.innerText = `${smL1OpsCount} / 5`;

  const topText = document.getElementById('sm-l1-top-display');
  if (topText) topText.innerText = topIdx >= 0 ? `top = ${topIdx}` : 'top = -1 (EMPTY)';

  const sizeText = document.getElementById('sm-l1-size-display');
  if (sizeText) sizeText.innerText = `${size} ${smL1Dynamic ? 'items' : `/ ${smL1Capacity}`}`;

  // Top Pointer Arrow
  const arrowEl = document.getElementById('sm-top-pointer-arrow');
  const arrowLabel = document.getElementById('sm-top-pointer-label');

  if (arrowEl && arrowLabel) {
    if (size === 0) {
      arrowEl.style.bottom = '12px';
      arrowLabel.innerText = 'TOP: -1 (Stack Empty)';
      arrowLabel.className = 'text-[11px] font-mono font-black text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-600/50';
    } else {
      const bottomOffset = 18 + topIdx * 54;
      arrowEl.style.bottom = `${bottomOffset}px`;
      arrowLabel.innerText = `TOP ➔ [Index ${topIdx}]`;
      arrowLabel.className = 'text-[11px] font-mono font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/50';
    }
  }

  // Render Plates Container (plates stack vertically from bottom to top)
  const container = document.getElementById('sm-plates-container');
  if (!container) return;
  container.innerHTML = '';

  if (size === 0) {
    container.innerHTML = `
      <div class="h-44 flex flex-col items-center justify-center text-center p-4">
        <span class="text-3xl opacity-30 mb-2">🥞</span>
        <span class="text-xs font-mono font-bold text-zinc-500">Stack Chamber is Empty (top == -1)</span>
        <span class="text-[11px] text-zinc-600 mt-1">Click "PUSH" below or choose a plate to begin!</span>
      </div>
    `;
    return;
  }

  // Render plates in reverse DOM order or with flex-col-reverse
  smStack.forEach((plate, idx) => {
    const isTop = idx === topIdx;
    const plateEl = document.createElement('div');
    plateEl.id = `sm-plate-${idx}`;
    plateEl.onclick = () => smOnPlateClick(idx);
    plateEl.title = isTop ? 'TOP PLATE - Click to POP!' : `Plate [Index ${idx}] - Cannot access non-top plate!`;

    plateEl.className = `w-full h-12 rounded-xl bg-gradient-to-r ${plate.color} text-white px-4 flex items-center justify-between border-2 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] queue-item-enter ${isTop ? 'ring-2 ring-amber-300 shadow-amber-500/20' : 'opacity-90'}`;

    plateEl.innerHTML = `
      <div class="flex items-center space-x-2.5">
        <span class="text-xl">${plate.icon}</span>
        <div>
          <span class="text-xs font-black tracking-wide block">${plate.name}</span>
          <span class="text-[10px] font-mono text-white/80">Value: ${plate.val}</span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${isTop ? 'bg-amber-400 text-slate-950 shadow' : 'bg-black/30 text-white'}">
          [${idx}] ${isTop ? '★ TOP' : ''}
        </span>
      </div>
    `;

    container.appendChild(plateEl);
  });
}

function smCheckL1Win() {
  if (smL1OpsCount >= 5) {
    smPlaySuccessSound();
    smShowVictoryModal('LEVEL 1 COMPLETE!', 'You have mastered core Stack operations (PUSH, POP, PEEK) and LIFO order!', 2);
  }
}

// ============================================================================
// LEVEL 2: POLISH NOTATION & POSTFIX LAB (EXPRESSION EVALUATOR & CONVERTER)
// Postfix Evaluation & Conversion Engine
// ============================================================================
let smL2Tab = 'eval'; // 'eval' or 'convert'
let smL2Tokens = [];
let smL2Idx = 0;
let smL2OperandStack = [];
let smL2History = [];
let smL2Timer = null;

const smL2Presets = [
  { name: '"2 3 1 * + 9 -" (Result: -4)', expr: '2 3 1 * + 9 -', expected: -4 },
  { name: '"6 5 2 3 + 8 * + 3 + *" (Result: 288)', expr: '6 5 2 3 + 8 * + 3 + *', expected: 288 },
  { name: 'Classic Arithmetic: "5 4 + 3 2 * -"', expr: '5 4 + 3 2 * -', expected: 3 },
  { name: 'Exponent & Division: "8 2 / 3 2 ^ +"', expr: '8 2 / 3 2 ^ +', expected: 13 }
];

function smInitL2() {
  smL2LoadPreset(0);
}

function smResetL2() {
  if (smL2Timer) clearInterval(smL2Timer);
  smL2Timer = null;
  const select = document.getElementById('sm-postfix-preset');
  const idx = select ? parseInt(select.value) || 0 : 0;
  smL2LoadPreset(idx);
}

function smSwitchL2Tab(tab) {
  smL2Tab = tab;
  const evalSec = document.getElementById('sm-l2-eval-section');
  const convSec = document.getElementById('sm-l2-conv-section');
  const btnEval = document.getElementById('sm-tab-eval-btn');
  const btnConv = document.getElementById('sm-tab-conv-btn');

  if (tab === 'eval') {
    if (evalSec) evalSec.classList.remove('hidden');
    if (convSec) convSec.classList.add('hidden');
    if (btnEval) btnEval.className = 'px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs shadow';
    if (btnConv) btnConv.className = 'px-4 py-2 rounded-xl text-zinc-400 hover:text-white font-bold text-xs';
    smResetL2();
  } else {
    if (evalSec) evalSec.classList.add('hidden');
    if (convSec) convSec.classList.remove('hidden');
    if (btnEval) btnEval.className = 'px-4 py-2 rounded-xl text-zinc-400 hover:text-white font-bold text-xs';
    if (btnConv) btnConv.className = 'px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs shadow';
    smInitL2Convert();
  }
}

function smL2LoadPreset(idx) {
  if (smL2Timer) clearInterval(smL2Timer);
  smL2Timer = null;

  const preset = smL2Presets[idx] || smL2Presets[0];
  const input = document.getElementById('sm-postfix-input');
  if (input) input.value = preset.expr;

  smL2Tokens = preset.expr.trim().split(/\s+/);
  smL2Idx = 0;
  smL2OperandStack = [];
  smL2History = [];

  smRenderL2Eval();
}

function smL2ApplyCustom() {
  const input = document.getElementById('sm-postfix-input');
  if (!input || !input.value.trim()) return;

  if (smL2Timer) clearInterval(smL2Timer);
  smL2Timer = null;

  smL2Tokens = input.value.trim().split(/\s+/);
  smL2Idx = 0;
  smL2OperandStack = [];
  smL2History = [];

  showToast(`Loaded Postfix Expression: "${input.value.trim()}"`, 'info');
  smRenderL2Eval();
}

function smL2Step() {
  if (smL2Idx >= smL2Tokens.length) {
    if (smL2Timer) clearInterval(smL2Timer);
    smL2Timer = null;
    showToast('Postfix evaluation complete!', 'success');
    return;
  }

  const token = smL2Tokens[smL2Idx];
  const isOperator = ['+', '-', '*', '/', '^'].includes(token);

  if (!isOperator) {
    // Operand: push to stack
    const num = parseFloat(token);
    if (isNaN(num)) {
      showToast(`Invalid token: "${token}" is neither number nor operator!`, 'error');
      return;
    }
    smL2OperandStack.push(num);
    smPlayPushSound();
    smL2History.unshift({
      step: smL2Idx + 1,
      token: token,
      type: 'Operand',
      action: `Push ${num} into stack`,
      stackSnap: [...smL2OperandStack]
    });
  } else {
    // Operator: pop 2 operands and calculate
    if (smL2OperandStack.length < 2) {
      smPlayErrorSound();
      showToast(`Syntax Error: Operator "${token}" encountered, but stack has less than 2 operands!`, 'error');
      if (smL2Timer) clearInterval(smL2Timer);
      smL2Timer = null;
      return;
    }

    const opA = smL2OperandStack.pop(); // top element (right operand)
    const opB = smL2OperandStack.pop(); // element below top (left operand)
    let res = 0;

    if (token === '+') res = opB + opA;
    else if (token === '-') res = opB - opA;
    else if (token === '*') res = opB * opA;
    else if (token === '/') res = opA !== 0 ? Math.floor(opB / opA) : 0;
    else if (token === '^') res = Math.pow(opB, opA);

    smL2OperandStack.push(res);
    smPlayTone(520, 'triangle', 0.15, 0.12);

    smL2History.unshift({
      step: smL2Idx + 1,
      token: token,
      type: 'Operator',
      action: `Pop ${opA} and ${opB} ➔ Compute ${opB} ${token} ${opA} = ${res} ➔ Push ${res}`,
      stackSnap: [...smL2OperandStack]
    });
  }

  smL2Idx++;
  smRenderL2Eval();

  if (smL2Idx >= smL2Tokens.length) {
    if (smL2Timer) clearInterval(smL2Timer);
    smL2Timer = null;
    smPlaySuccessSound();
    const finalAnswer = smL2OperandStack[smL2OperandStack.length - 1];
    showToast(`🎉 Final Result: ${finalAnswer}`, 'success');
  }
}

function smL2AutoPlay() {
  if (smL2Timer) {
    clearInterval(smL2Timer);
    smL2Timer = null;
    const playBtn = document.getElementById('sm-postfix-play-btn');
    if (playBtn) playBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i><span>Auto Play</span>';
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  if (smL2Idx >= smL2Tokens.length) {
    smResetL2();
  }

  const playBtn = document.getElementById('sm-postfix-play-btn');
  if (playBtn) playBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4"></i><span>Pause</span>';
  if (window.lucide) window.lucide.createIcons();

  smL2Timer = setInterval(() => {
    if (smL2Idx >= smL2Tokens.length) {
      clearInterval(smL2Timer);
      smL2Timer = null;
      if (playBtn) playBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i><span>Auto Play</span>';
      if (window.lucide) window.lucide.createIcons();
    } else {
      smL2Step();
    }
  }, 900);
}

function smRenderL2Eval() {
  // Render tokens stream
  const tokenContainer = document.getElementById('sm-l2-tokens-stream');
  if (tokenContainer) {
    tokenContainer.innerHTML = '';
    smL2Tokens.forEach((tok, i) => {
      const isPast = i < smL2Idx;
      const isCurrent = i === smL2Idx;
      const el = document.createElement('div');
      el.className = `px-3.5 py-2 rounded-xl font-mono text-sm font-black transition-all ${
        isCurrent
          ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg ring-2 ring-amber-300'
          : isPast
          ? 'bg-violet-950/50 text-zinc-400 border border-violet-800/40 line-through'
          : 'bg-zinc-800 text-white border border-zinc-700'
      }`;
      el.innerText = tok;
      tokenContainer.appendChild(el);
    });
  }

  // Render Operand Stack
  const stackContainer = document.getElementById('sm-l2-operand-stack');
  if (stackContainer) {
    stackContainer.innerHTML = '';
    if (smL2OperandStack.length === 0) {
      stackContainer.innerHTML = `<span class="text-xs text-zinc-500 font-mono italic my-auto">Operand Stack Empty</span>`;
    } else {
      smL2OperandStack.forEach((val, i) => {
        const isTop = i === smL2OperandStack.length - 1;
        const el = document.createElement('div');
        el.className = `w-full py-2.5 px-4 rounded-xl font-mono font-black text-center shadow-md transition-all queue-item-enter ${
          isTop
            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-2 border-amber-300 scale-[1.02]'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-violet-400'
        }`;
        el.innerHTML = `<span>${val}</span> ${isTop ? '<span class="text-[10px] ml-2 font-bold px-1.5 py-0.5 rounded bg-black/30 text-amber-200">TOP</span>' : ''}`;
        stackContainer.appendChild(el);
      });
    }
  }

  // Result display
  const resultEl = document.getElementById('sm-l2-result-display');
  if (resultEl) {
    if (smL2Idx >= smL2Tokens.length && smL2OperandStack.length > 0) {
      resultEl.innerText = `${smL2OperandStack[smL2OperandStack.length - 1]}`;
      resultEl.className = 'text-3xl font-black font-mono text-emerald-400';
    } else {
      resultEl.innerText = smL2OperandStack.length > 0 ? `${smL2OperandStack[smL2OperandStack.length - 1]}` : '--';
      resultEl.className = 'text-3xl font-black font-mono text-amber-300';
    }
  }

  // Render Log Table
  const tableBody = document.getElementById('sm-l2-log-body');
  if (tableBody) {
    tableBody.innerHTML = '';
    smL2History.forEach(item => {
      const row = document.createElement('tr');
      row.className = 'border-b border-zinc-800 text-xs font-mono';
      row.innerHTML = `
        <td class="py-2 px-3 text-zinc-400">#${item.step}</td>
        <td class="py-2 px-3 font-bold ${item.type === 'Operator' ? 'text-rose-400' : 'text-emerald-400'}">${item.token}</td>
        <td class="py-2 px-3 text-white">${item.action}</td>
        <td class="py-2 px-3 text-amber-300 font-bold">[${item.stackSnap.join(', ')}]</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// Infix to Postfix Converter
let smL2ConvTokens = [];
let smL2ConvIdx = 0;
let smL2ConvOpStack = [];
let smL2ConvOutput = [];
let smL2ConvHistory = [];

function smInitL2Convert() {
  const defaultInfix = 'M * J - ( N + D ) / F * W + Z';
  const input = document.getElementById('sm-infix-input');
  if (input) input.value = defaultInfix;
  smL2LoadInfix();
}

function smL2Precedence(op) {
  if (op === '^') return 3;
  if (op === '*' || op === '/') return 2;
  if (op === '+' || op === '-') return 1;
  return 0;
}

function smL2LoadInfix() {
  const input = document.getElementById('sm-infix-input');
  const expr = input ? input.value.trim() : 'M * J - ( N + D ) / F * W + Z';
  // tokenize with spaces or single characters
  smL2ConvTokens = expr.replace(/\s+/g, '').split('');
  smL2ConvIdx = 0;
  smL2ConvOpStack = [];
  smL2ConvOutput = [];
  smL2ConvHistory = [];
  smRenderL2Convert();
}

function smL2StepConvert() {
  if (smL2ConvIdx >= smL2ConvTokens.length) {
    // Pop remaining operators
    if (smL2ConvOpStack.length > 0) {
      const op = smL2ConvOpStack.pop();
      smL2ConvOutput.push(op);
      smPlayPopSound();
      smL2ConvHistory.unshift({
        char: 'END',
        opStack: [...smL2ConvOpStack],
        postfix: smL2ConvOutput.join(' ')
      });
      smRenderL2Convert();
      return;
    }
    smPlaySuccessSound();
    showToast(`Conversion Complete! Postfix: ${smL2ConvOutput.join(' ')}`, 'success');
    return;
  }

  const ch = smL2ConvTokens[smL2ConvIdx];

  if (/[a-zA-Z0-9]/.test(ch)) {
    // Operand: add directly to output
    smL2ConvOutput.push(ch);
    smPlayTone(600, 'sine', 0.1, 0.08);
  } else if (ch === '(') {
    smL2ConvOpStack.push(ch);
    smPlayPushSound();
  } else if (ch === ')') {
    while (smL2ConvOpStack.length > 0 && smL2ConvOpStack[smL2ConvOpStack.length - 1] !== '(') {
      smL2ConvOutput.push(smL2ConvOpStack.pop());
    }
    if (smL2ConvOpStack.length > 0 && smL2ConvOpStack[smL2ConvOpStack.length - 1] === '(') {
      smL2ConvOpStack.pop(); // discard '('
    }
    smPlayTone(400, 'triangle', 0.1, 0.1);
  } else if (['+', '-', '*', '/', '^'].includes(ch)) {
    while (
      smL2ConvOpStack.length > 0 &&
      smL2ConvOpStack[smL2ConvOpStack.length - 1] !== '(' &&
      smL2Precedence(smL2ConvOpStack[smL2ConvOpStack.length - 1]) >= smL2Precedence(ch)
    ) {
      smL2ConvOutput.push(smL2ConvOpStack.pop());
    }
    smL2ConvOpStack.push(ch);
    smPlayPushSound();
  }

  smL2ConvHistory.unshift({
    char: ch,
    opStack: [...smL2ConvOpStack],
    postfix: smL2ConvOutput.join(' ')
  });

  smL2ConvIdx++;
  smRenderL2Convert();
}

function smRenderL2Convert() {
  const outEl = document.getElementById('sm-conv-postfix-out');
  if (outEl) outEl.innerText = smL2ConvOutput.length > 0 ? smL2ConvOutput.join(' ') : '--';

  const opStackEl = document.getElementById('sm-conv-op-stack');
  if (opStackEl) {
    opStackEl.innerHTML = '';
    if (smL2ConvOpStack.length === 0) {
      opStackEl.innerHTML = `<span class="text-xs text-zinc-500 font-mono italic my-auto">Operator Stack Empty</span>`;
    } else {
      smL2ConvOpStack.forEach((op, i) => {
        const isTop = i === smL2ConvOpStack.length - 1;
        const el = document.createElement('div');
        el.className = `py-2 px-3 rounded-lg font-mono font-bold text-center ${
          isTop ? 'bg-amber-400 text-slate-950 shadow' : 'bg-zinc-800 text-white'
        }`;
        el.innerText = `${op} ${isTop ? '(TOP)' : ''}`;
        opStackEl.appendChild(el);
      });
    }
  }

  const tableBody = document.getElementById('sm-conv-table-body');
  if (tableBody) {
    tableBody.innerHTML = '';
    smL2ConvHistory.forEach(item => {
      const row = document.createElement('tr');
      row.className = 'border-b border-zinc-800 text-xs font-mono';
      row.innerHTML = `
        <td class="py-2 px-3 font-bold text-amber-300">${item.char}</td>
        <td class="py-2 px-3 text-cyan-300 font-bold">${item.opStack.join(' ') || 'Empty'}</td>
        <td class="py-2 px-3 text-white">${item.postfix}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// ============================================================================
// LEVEL 3: SYNTAX SENTINEL (BALANCED PARENTHESES & BRACKETS)
// Syntax Sentinel: Balanced Parentheses & Brackets
// ============================================================================
let smL3Expression = '({[]})';
let smL3Chars = [];
let smL3Idx = 0;
let smL3Stack = [];
let smL3History = [];
let smL3Status = 'RUNNING'; // 'RUNNING', 'BALANCED', 'UNBALANCED'
let smL3ErrorMsg = '';

const smL3Presets = [
  { name: 'Standard Valid: "({[]})"', expr: '({[]})' },
  { name: 'Complex Valid: "[()]{}{[()()]()}"', expr: '[()]{}{[()()]()}' },
  { name: 'Mismatched Types: "[(])"', expr: '[(])' },
  { name: 'Unclosed Left Bracket: "((())"', expr: '((())' },
  { name: 'Premature Closing: "}{]"', expr: '}{]' },
  { name: 'Code Snippet: "if(arr[i] == (x + 1)) { return true; }"', expr: 'if(arr[i] == (x + 1)) { return true; }' }
];

function smInitL3() {
  smL3LoadPreset(0);
}

function smResetL3() {
  const select = document.getElementById('sm-bracket-preset');
  const idx = select ? parseInt(select.value) || 0 : 0;
  smL3LoadPreset(idx);
}

function smL3LoadPreset(idx) {
  const preset = smL3Presets[idx] || smL3Presets[0];
  const input = document.getElementById('sm-bracket-input');
  if (input) input.value = preset.expr;

  smL3Expression = preset.expr;
  smL3Chars = preset.expr.split('');
  smL3Idx = 0;
  smL3Stack = [];
  smL3History = [];
  smL3Status = 'READY';
  smL3ErrorMsg = '';

  smRenderL3();
}

function smL3ApplyCustom() {
  const input = document.getElementById('sm-bracket-input');
  if (!input || !input.value.trim()) return;

  smL3Expression = input.value.trim();
  smL3Chars = smL3Expression.split('');
  smL3Idx = 0;
  smL3Stack = [];
  smL3History = [];
  smL3Status = 'READY';
  smL3ErrorMsg = '';

  showToast(`Loaded Bracket Expression: "${smL3Expression}"`, 'info');
  smRenderL3();
}

function smL3Step() {
  if (smL3Status === 'BALANCED' || smL3Status === 'UNBALANCED') {
    showToast(`Evaluation already concluded: ${smL3Status}`, 'info');
    return;
  }

  if (smL3Idx >= smL3Chars.length) {
    // End of string reached
    if (smL3Stack.length === 0) {
      smL3Status = 'BALANCED';
      smPlaySuccessSound();
      showToast('🎉 Expression is completely BALANCED!', 'success');
      smL3History.unshift({
        idx: 'END',
        char: 'EOF',
        stackSnap: 'Empty',
        action: 'Stack is empty ➔ Balanced expression!'
      });
    } else {
      smL3Status = 'UNBALANCED';
      smL3ErrorMsg = `Stack still contains ${smL3Stack.length} unclosed opening bracket(s): "${smL3Stack.join(', ')}"`;
      smPlayErrorSound();
      showToast(`⚠️ UNBALANCED: ${smL3ErrorMsg}`, 'error');
      smL3History.unshift({
        idx: 'END',
        char: 'EOF',
        stackSnap: `[${smL3Stack.join(', ')}]`,
        action: `Unbalanced! ${smL3ErrorMsg}`
      });
    }
    smRenderL3();
    return;
  }

  const ch = smL3Chars[smL3Idx];
  const isOpening = ['(', '{', '['].includes(ch);
  const isClosing = [')', '}', ']'].includes(ch);

  if (isOpening) {
    smL3Stack.push(ch);
    smPlayPushSound();
    smL3History.unshift({
      idx: smL3Idx,
      char: ch,
      stackSnap: `[${smL3Stack.join(', ')}]`,
      action: `Opening bracket "${ch}" ➔ Push to stack`
    });
    smL3Idx++;
  } else if (isClosing) {
    if (smL3Stack.length === 0) {
      smL3Status = 'UNBALANCED';
      smL3ErrorMsg = `Closing bracket "${ch}" encountered at Pos [${smL3Idx}] but stack is empty!`;
      smPlayErrorSound();
      smL3History.unshift({
        idx: smL3Idx,
        char: ch,
        stackSnap: 'Empty',
        action: `Underflow error: No opening bracket exists for "${ch}"`
      });
    } else {
      const top = smL3Stack[smL3Stack.length - 1];
      const matches =
        (ch === ')' && top === '(') ||
        (ch === '}' && top === '{') ||
        (ch === ']' && top === '[');

      if (matches) {
        smL3Stack.pop();
        smPlayTone(620, 'triangle', 0.1, 0.1);
        smL3History.unshift({
          idx: smL3Idx,
          char: ch,
          stackSnap: smL3Stack.length > 0 ? `[${smL3Stack.join(', ')}]` : 'Empty',
          action: `Closing bracket "${ch}" matches TOP "${top}" ➔ Pop!`
        });
        smL3Idx++;
      } else {
        smL3Status = 'UNBALANCED';
        smL3ErrorMsg = `Mismatched brackets: Expected closing pair for "${top}", but encountered "${ch}" at Pos [${smL3Idx}]!`;
        smPlayErrorSound();
        smL3History.unshift({
          idx: smL3Idx,
          char: ch,
          stackSnap: `[${smL3Stack.join(', ')}]`,
          action: `Mismatch: "${top}" does not pair with "${ch}"`
        });
      }
    }
  } else {
    // Ignore non-bracket characters
    smL3Idx++;
  }

  smRenderL3();
}

function smL3RunAll() {
  while (smL3Status !== 'BALANCED' && smL3Status !== 'UNBALANCED' && smL3Idx <= smL3Chars.length) {
    smL3Step();
  }
}

function smRenderL3() {
  // Render character stream
  const streamEl = document.getElementById('sm-l3-stream');
  if (streamEl) {
    streamEl.innerHTML = '';
    smL3Chars.forEach((c, i) => {
      const isPast = i < smL3Idx;
      const isCur = i === smL3Idx;
      const el = document.createElement('div');
      el.className = `w-8 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-base transition-all ${
        isCur
          ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg ring-2 ring-amber-300'
          : isPast
          ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
          : 'bg-zinc-900 text-white border border-zinc-800'
      }`;
      el.innerText = c;
      streamEl.appendChild(el);
    });
  }

  // Render Stack
  const stackEl = document.getElementById('sm-l3-stack');
  if (stackEl) {
    stackEl.innerHTML = '';
    if (smL3Stack.length === 0) {
      stackEl.innerHTML = `<span class="text-xs text-zinc-500 font-mono italic my-auto">Bracket Stack Empty</span>`;
    } else {
      smL3Stack.forEach((b, i) => {
        const isTop = i === smL3Stack.length - 1;
        const el = document.createElement('div');
        el.className = `w-full py-2 px-4 rounded-xl font-mono text-lg font-black text-center shadow-md transition-all queue-item-enter ${
          isTop
            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-2 border-amber-300'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-violet-400'
        }`;
        el.innerText = b;
        stackEl.appendChild(el);
      });
    }
  }

  // Status Badge
  const statusEl = document.getElementById('sm-l3-status-badge');
  if (statusEl) {
    if (smL3Status === 'BALANCED') {
      statusEl.innerText = 'VALID: BALANCED ✅';
      statusEl.className = 'px-4 py-1.5 rounded-full text-xs font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500';
    } else if (smL3Status === 'UNBALANCED') {
      statusEl.innerText = 'ERROR: UNBALANCED ❌';
      statusEl.className = 'px-4 py-1.5 rounded-full text-xs font-mono font-black bg-rose-500/20 text-rose-300 border border-rose-500';
    } else {
      statusEl.innerText = 'SCANNING IN PROGRESS ⚡';
      statusEl.className = 'px-4 py-1.5 rounded-full text-xs font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500';
    }
  }

  // Execution Trace Table (Stack | Expression | Action)
  const tableBody = document.getElementById('sm-l3-log-body');
  if (tableBody) {
    tableBody.innerHTML = '';
    smL3History.forEach(item => {
      const row = document.createElement('tr');
      row.className = 'border-b border-zinc-800 text-xs font-mono';
      row.innerHTML = `
        <td class="py-2 px-3 text-amber-300 font-bold">${item.stackSnap}</td>
        <td class="py-2 px-3 font-bold text-white">${item.char}</td>
        <td class="py-2 px-3 ${item.action.includes('Mismatch') || item.action.includes('Underflow') ? 'text-rose-400 font-bold' : 'text-zinc-300'}">${item.action}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// ============================================================================
// LEVEL 4: MONOTONIC MOUNTAIN (NEXT GREATER & PREVIOUS GREATER ELEMENT)
// Monotonic Stack: Next Greater & Previous Greater Element
// ============================================================================
let smL4Mode = 'nge'; // 'nge' or 'pge'
let smL4Array = [1, 3, 2, 4];
let smL4Results = [];
let smL4Idx = 0;
let smL4MonotonicStack = []; // stores indices or values
let smL4History = [];

const smL4Presets = [
  { name: 'Example 1 (NGE): [1, 3, 2, 4]', arr: [1, 3, 2, 4], mode: 'nge' },
  { name: 'Example 2 (NGE): [6, 8, 0, 1, 3]', arr: [6, 8, 0, 1, 3], mode: 'nge' },
  { name: 'Example 1 (PGE): [10, 4, 2, 20, 40, 12]', arr: [10, 4, 2, 20, 40, 12], mode: 'pge' },
  { name: 'Example 2 (PGE): [10, 20, 30, 40]', arr: [10, 20, 30, 40], mode: 'pge' }
];

function smInitL4() {
  smL4LoadPreset(0);
}

function smResetL4() {
  const select = document.getElementById('sm-l4-preset');
  const idx = select ? parseInt(select.value) || 0 : 0;
  smL4LoadPreset(idx);
}

function smSwitchL4Mode(mode) {
  smL4Mode = mode;
  const btnNge = document.getElementById('sm-btn-mode-nge');
  const btnPge = document.getElementById('sm-btn-mode-pge');
  if (btnNge) btnNge.className = mode === 'nge' ? 'px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs shadow' : 'px-4 py-2 rounded-xl text-zinc-400 hover:text-white font-bold text-xs';
  if (btnPge) btnPge.className = mode === 'pge' ? 'px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs shadow' : 'px-4 py-2 rounded-xl text-zinc-400 hover:text-white font-bold text-xs';

  smResetL4();
}

function smL4LoadPreset(idx) {
  const preset = smL4Presets[idx] || smL4Presets[0];
  smL4Mode = preset.mode;
  smL4Array = [...preset.arr];

  const input = document.getElementById('sm-l4-input');
  if (input) input.value = smL4Array.join(', ');

  smSwitchL4Mode(smL4Mode);
  smL4SetupSimulation();
}

function smL4ApplyCustom() {
  const input = document.getElementById('sm-l4-input');
  if (!input || !input.value.trim()) return;

  const parsed = input.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  if (parsed.length === 0) {
    showToast('Invalid array elements! Please enter numbers separated by commas.', 'error');
    return;
  }

  smL4Array = parsed;
  smL4SetupSimulation();
}

function smL4SetupSimulation() {
  smL4Results = new Array(smL4Array.length).fill(null);
  smL4MonotonicStack = [];
  smL4History = [];

  // For NGE, iterate from right to left (index N-1 down to 0)
  // For PGE, iterate from left to right (index 0 up to N-1)
  smL4Idx = smL4Mode === 'nge' ? smL4Array.length - 1 : 0;

  smRenderL4();
}

function smL4Step() {
  const isFinished = smL4Mode === 'nge' ? smL4Idx < 0 : smL4Idx >= smL4Array.length;
  if (isFinished) {
    smPlaySuccessSound();
    showToast(`Monotonic ${smL4Mode.toUpperCase()} calculation finished!`, 'success');
    return;
  }

  const currentVal = smL4Array[smL4Idx];

  // Pop all elements smaller than or equal to currentVal
  while (smL4MonotonicStack.length > 0 && smL4MonotonicStack[smL4MonotonicStack.length - 1] <= currentVal) {
    const popped = smL4MonotonicStack.pop();
    smL4History.unshift({
      idx: smL4Idx,
      val: currentVal,
      action: `Popped ${popped} from stack (${popped} <= ${currentVal})`
    });
  }

  // Answer is stack top (or -1 if empty)
  const ans = smL4MonotonicStack.length > 0 ? smL4MonotonicStack[smL4MonotonicStack.length - 1] : -1;
  smL4Results[smL4Idx] = ans;

  smL4History.unshift({
    idx: smL4Idx,
    val: currentVal,
    action: `Answer for arr[${smL4Idx}]=${currentVal} is ${ans} ➔ Push ${currentVal} into stack`
  });

  // Push currentVal to stack
  smL4MonotonicStack.push(currentVal);
  smPlayTone(480, 'sine', 0.1, 0.1);

  // Advance index
  if (smL4Mode === 'nge') smL4Idx--;
  else smL4Idx++;

  smRenderL4();
}

function smL4RunAll() {
  while (!(smL4Mode === 'nge' ? smL4Idx < 0 : smL4Idx >= smL4Array.length)) {
    smL4Step();
  }
}

function smRenderL4() {
  // Render Mountain Bar Visualizer
  const chartContainer = document.getElementById('sm-l4-bars-container');
  if (chartContainer) {
    chartContainer.innerHTML = '';
    const maxVal = Math.max(...smL4Array, 10);

    smL4Array.forEach((val, i) => {
      const isCur = i === smL4Idx;
      const heightPercent = Math.max(20, Math.min(100, (val / maxVal) * 100));
      const resVal = smL4Results[i];

      const barWrap = document.createElement('div');
      barWrap.className = 'flex flex-col items-center justify-end h-56 flex-1 min-w-[50px] max-w-[80px] group relative';

      barWrap.innerHTML = `
        <div class="text-[10px] font-mono font-bold text-amber-300 mb-1">${resVal !== null ? `Ans: ${resVal}` : '?'}</div>
        <div style="height: ${heightPercent}%;" class="w-full rounded-2xl flex flex-col justify-between items-center p-1.5 shadow-lg transition-all duration-300 ${
          isCur
            ? 'bg-gradient-to-t from-amber-500 to-amber-300 ring-4 ring-amber-300/80 shadow-amber-500/50'
            : resVal !== null
            ? 'bg-gradient-to-t from-violet-700 to-purple-500 border border-violet-400'
            : 'bg-zinc-800 border border-zinc-700'
        }">
          <span class="text-xs font-black text-slate-950 font-mono mt-0.5">${val}</span>
        </div>
        <span class="text-[10px] font-mono text-zinc-500 mt-2 font-bold">[${i}]</span>
      `;
      chartContainer.appendChild(barWrap);
    });
  }

  // Result Array display
  const resEl = document.getElementById('sm-l4-result-array');
  if (resEl) {
    resEl.innerHTML = `[${smL4Results.map(r => r !== null ? `<strong class="text-amber-300">${r}</strong>` : '<span class="text-zinc-600">?</span>').join(', ')}]`;
  }

  // Render Monotonic Stack
  const stackEl = document.getElementById('sm-l4-mono-stack');
  if (stackEl) {
    stackEl.innerHTML = '';
    if (smL4MonotonicStack.length === 0) {
      stackEl.innerHTML = `<span class="text-xs text-zinc-500 font-mono italic my-auto">Monotonic Stack Empty</span>`;
    } else {
      smL4MonotonicStack.forEach((v, idx) => {
        const isTop = idx === smL4MonotonicStack.length - 1;
        const el = document.createElement('div');
        el.className = `w-full py-2 px-3 rounded-xl font-mono font-black text-center shadow-md ${
          isTop ? 'bg-amber-400 text-slate-950 border-2 border-amber-300' : 'bg-zinc-800 text-white border border-zinc-700'
        }`;
        el.innerText = `${v} ${isTop ? '(TOP)' : ''}`;
        stackEl.appendChild(el);
      });
    }
  }

  // Render Log Table
  const tableBody = document.getElementById('sm-l4-log-body');
  if (tableBody) {
    tableBody.innerHTML = '';
    smL4History.forEach(item => {
      const row = document.createElement('tr');
      row.className = 'border-b border-zinc-800 text-xs font-mono';
      row.innerHTML = `
        <td class="py-2 px-3 text-amber-300 font-bold">arr[${item.idx}] = ${item.val}</td>
        <td class="py-2 px-3 text-white">${item.action}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// ============================================================================
// LEVEL 5: STRING & BASE TRANSFORMER (REVERSAL & RADIX LAB)
// String Reversal & Radix Base Conversion
// ============================================================================
let smL5String = 'STACK';
let smL5Chars = [];
let smL5PushIdx = 0;
let smL5Stack = [];
let smL5Reversed = '';
let smL5Phase = 'push'; // 'push' or 'pop' or 'done'

// Radix Conversion
let smL5DecNum = 29;
let smL5RadixBase = 2; // 2 (binary), 8 (octal), 16 (hex)
let smL5RemainderStack = [];
let smL5RadixSteps = [];
let smL5ConvertedStr = '';

function smInitL5() {
  smResetL5();
}

function smResetL5() {
  smL5String = 'STACK';
  const strInput = document.getElementById('sm-str-input');
  if (strInput) strInput.value = smL5String;
  smL5LoadString();

  smL5DecNum = 29;
  const decInput = document.getElementById('sm-dec-input');
  if (decInput) decInput.value = smL5DecNum;
  smL5ConvertRadix();
}

function smL5LoadString() {
  const input = document.getElementById('sm-str-input');
  smL5String = input ? input.value.trim().toUpperCase() : 'STACK';
  smL5Chars = smL5String.split('');
  smL5PushIdx = 0;
  smL5Stack = [];
  smL5Reversed = '';
  smL5Phase = 'push';
  smRenderL5String();
}

function smL5StepString() {
  if (smL5Phase === 'push') {
    if (smL5PushIdx < smL5Chars.length) {
      const ch = smL5Chars[smL5PushIdx++];
      smL5Stack.push(ch);
      smPlayPushSound();
      if (smL5PushIdx >= smL5Chars.length) {
        smL5Phase = 'pop';
        showToast('All characters pushed! Now popping from TOP to reverse string.', 'info');
      }
    }
  } else if (smL5Phase === 'pop') {
    if (smL5Stack.length > 0) {
      const popped = smL5Stack.pop();
      smL5Reversed += popped;
      smPlayPopSound();
      if (smL5Stack.length === 0) {
        smL5Phase = 'done';
        smPlaySuccessSound();
        showToast(`String successfully reversed: "${smL5Reversed}"`, 'success');
      }
    }
  }
  smRenderL5String();
}

function smL5RunAllString() {
  while (smL5Phase !== 'done') {
    smL5StepString();
  }
}

function smRenderL5String() {
  const stackEl = document.getElementById('sm-l5-str-stack');
  if (stackEl) {
    stackEl.innerHTML = '';
    if (smL5Stack.length === 0) {
      stackEl.innerHTML = `<span class="text-xs text-zinc-500 font-mono italic my-auto">Character Stack Empty</span>`;
    } else {
      smL5Stack.forEach((ch, idx) => {
        const isTop = idx === smL5Stack.length - 1;
        const el = document.createElement('div');
        el.className = `w-full py-2 rounded-xl text-center font-mono font-black text-sm shadow ${
          isTop ? 'bg-amber-400 text-slate-950 border border-amber-300' : 'bg-violet-600 text-white'
        }`;
        el.innerText = ch;
        stackEl.appendChild(el);
      });
    }
  }

  const outEl = document.getElementById('sm-l5-rev-out');
  if (outEl) outEl.innerText = smL5Reversed || '--';

  const phaseEl = document.getElementById('sm-l5-phase-badge');
  if (phaseEl) {
    if (smL5Phase === 'push') phaseEl.innerText = 'PHASE 1: PUSHING CHARACTERS ➔';
    else if (smL5Phase === 'pop') phaseEl.innerText = 'PHASE 2: POPPING IN REVERSE ➔';
    else phaseEl.innerText = 'COMPLETE: REVERSED ✅';
  }
}

// Radix base conversion
function smL5ConvertRadix() {
  const input = document.getElementById('sm-dec-input');
  const baseSelect = document.getElementById('sm-radix-select');

  smL5DecNum = input ? parseInt(input.value) || 0 : 29;
  smL5RadixBase = baseSelect ? parseInt(baseSelect.value) || 2 : 2;

  smL5RemainderStack = [];
  smL5RadixSteps = [];

  let temp = smL5DecNum;
  const hexMap = '0123456789ABCDEF';

  if (temp === 0) {
    smL5RemainderStack.push('0');
    smL5RadixSteps.push({ n: 0, quotient: 0, rem: '0' });
  } else {
    while (temp > 0) {
      const rem = temp % smL5RadixBase;
      const quot = Math.floor(temp / smL5RadixBase);
      const remChar = hexMap[rem];
      smL5RemainderStack.push(remChar);
      smL5RadixSteps.push({ n: temp, quotient: quot, rem: remChar });
      temp = quot;
    }
  }

  // Pop from stack to get final converted representation
  smL5ConvertedStr = [...smL5RemainderStack].reverse().join('');
  smRenderL5Radix();
}

function smRenderL5Radix() {
  const resultEl = document.getElementById('sm-l5-radix-result');
  if (resultEl) resultEl.innerText = smL5ConvertedStr;

  const stackEl = document.getElementById('sm-l5-radix-stack');
  if (stackEl) {
    stackEl.innerHTML = '';
    smL5RemainderStack.forEach((r, idx) => {
      const isTop = idx === smL5RemainderStack.length - 1;
      const el = document.createElement('div');
      el.className = `w-full py-1.5 rounded-lg text-center font-mono font-black text-xs ${
        isTop ? 'bg-amber-400 text-slate-950' : 'bg-zinc-800 text-white'
      }`;
      el.innerText = r;
      stackEl.appendChild(el);
    });
  }

  const tableBody = document.getElementById('sm-l5-radix-table');
  if (tableBody) {
    tableBody.innerHTML = '';
    smL5RadixSteps.forEach(step => {
      const row = document.createElement('tr');
      row.className = 'border-b border-zinc-800 text-xs font-mono';
      row.innerHTML = `
        <td class="py-1.5 px-3 text-white">${step.n} ÷ ${smL5RadixBase}</td>
        <td class="py-1.5 px-3 text-zinc-400">${step.quotient}</td>
        <td class="py-1.5 px-3 text-amber-300 font-bold">${step.rem} (Push)</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// ============================================================================
// LEVEL 6: DYNAMIC HEAP & CALL STACK RECURSION
// Dynamic Heap Stack & Call Stack Recursion
// ============================================================================
let smL6Nodes = []; // Linked list nodes { id, val, nextId }
let smL6NodeCounter = 1;

// Recursion Call Stack State
let smL6RecTarget = 4;
let smL6RecFrames = [];
let smL6RecPhase = 'call'; // 'call', 'unwind', 'done'
let smL6RecStep = 0;

function smInitL6() {
  smResetL6();
}

function smResetL6() {
  smL6Nodes = [
    { id: 1, val: 'Node #1', next: null },
    { id: 2, val: 'Node #2', next: 1 },
    { id: 3, val: 'Node #3', next: 2 }
  ];
  smL6NodeCounter = 4;
  smRenderL6Linked();

  smL6ResetRecursion();
}

function smL6PushLinked() {
  const valInput = document.getElementById('sm-l6-input');
  const val = valInput && valInput.value.trim() ? valInput.value.trim() : `Node #${smL6NodeCounter}`;
  if (valInput) valInput.value = '';

  const oldTopId = smL6Nodes.length > 0 ? smL6Nodes[smL6Nodes.length - 1].id : null;
  const newNode = {
    id: smL6NodeCounter++,
    val: val,
    next: oldTopId
  };

  smL6Nodes.push(newNode);
  smPlayPushSound();
  showToast(`Allocated dynamic node [id:${newNode.id}, val:${val}] on heap. new->next points to previous top!`, 'success');
  smRenderL6Linked();
}

function smL6PopLinked() {
  if (smL6Nodes.length === 0) {
    smPlayErrorSound();
    showToast('Dynamic stack is empty (top == NULL)! Cannot pop.', 'error');
    return;
  }

  smPlayPopSound();
  const popped = smL6Nodes.pop();
  showToast(`Freed dynamic node [id:${popped.id}, val:${popped.val}] from heap memory. top = top->next!`, 'info');
  smRenderL6Linked();
}

function smRenderL6Linked() {
  const container = document.getElementById('sm-l6-nodes-container');
  if (!container) return;
  container.innerHTML = '';

  if (smL6Nodes.length === 0) {
    container.innerHTML = `<span class="text-xs text-zinc-500 font-mono italic my-auto">Dynamic Heap Stack Empty (top == NULL)</span>`;
    return;
  }

  // Render from top to bottom
  for (let i = smL6Nodes.length - 1; i >= 0; i--) {
    const node = smL6Nodes[i];
    const isTop = i === smL6Nodes.length - 1;

    const nodeWrap = document.createElement('div');
    nodeWrap.className = 'flex flex-col items-center w-full queue-item-enter';

    nodeWrap.innerHTML = `
      <div class="w-full p-3 rounded-2xl flex items-center justify-between border-2 shadow-lg transition-all ${
        isTop
          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-amber-300 text-white ring-2 ring-amber-300'
          : 'bg-zinc-800 border-zinc-700 text-zinc-200'
      }">
        <div class="flex items-center space-x-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isTop ? 'bg-amber-400 text-slate-950' : 'bg-zinc-700 text-zinc-300'}">
            ${isTop ? '★ TOP' : 'NODE'}
          </span>
          <span class="font-extrabold text-sm">${node.val}</span>
        </div>
        <div class="flex items-center space-x-2 text-xs font-mono">
          <span class="text-zinc-400">next ➔</span>
          <span class="px-2 py-0.5 rounded bg-black/40 text-amber-300 font-bold">${node.next !== null ? `Node #${node.next}` : 'NULL'}</span>
        </div>
      </div>
      ${i > 0 ? '<div class="text-amber-400 text-xs font-mono py-1 select-none">↓ (pointer link)</div>' : '<div class="text-zinc-600 text-xs font-mono py-1 select-none">↓ NULL (End of Stack)</div>'}
    `;

    container.appendChild(nodeWrap);
  }
}

// Recursion Call Stack Simulator
function smL6ResetRecursion() {
  smL6RecTarget = 4;
  smL6RecFrames = [];
  smL6RecPhase = 'call';
  smL6RecStep = 0;
  smRenderL6Recursion();
}

function smL6StepRecursion() {
  if (smL6RecPhase === 'call') {
    const currentN = smL6RecTarget - smL6RecFrames.length;
    if (currentN >= 1) {
      smL6RecFrames.push({ n: currentN, retVal: null });
      smPlayPushSound();
      showToast(`CALL: factorial(${currentN}) pushed to Call Stack!`, 'info');
      if (currentN === 1) {
        smL6RecPhase = 'unwind';
        showToast('Base case reached: factorial(1) returns 1! Now unwinding Call Stack.', 'success');
      }
    }
  } else if (smL6RecPhase === 'unwind') {
    if (smL6RecFrames.length > 0) {
      const topFrame = smL6RecFrames[smL6RecFrames.length - 1];
      if (topFrame.retVal === null) {
        if (topFrame.n === 1) topFrame.retVal = 1;
        else {
          // Computed from previous return
          const subRet = smL6RecFrames[smL6RecFrames.length - 2] ? smL6RecFrames[smL6RecFrames.length - 2].retVal : 1;
          topFrame.retVal = topFrame.n * (subRet || 1);
        }
        smPlayTone(600, 'triangle', 0.12, 0.1);
      } else {
        const popped = smL6RecFrames.pop();
        smPlayPopSound();
        showToast(`RETURN: factorial(${popped.n}) = ${popped.retVal} popped from Call Stack`, 'info');
        if (smL6RecFrames.length === 0) {
          smL6RecPhase = 'done';
          smPlaySuccessSound();
          showToast(`Recursion complete! Final result = ${popped.retVal}`, 'success');
        }
      }
    }
  }
  smRenderL6Recursion();
}

function smRenderL6Recursion() {
  const container = document.getElementById('sm-l6-callstack-container');
  if (!container) return;
  container.innerHTML = '';

  if (smL6RecFrames.length === 0) {
    container.innerHTML = `<span class="text-xs text-zinc-500 font-mono italic my-auto">Call Stack Empty (Execution Halted)</span>`;
    return;
  }

  for (let i = smL6RecFrames.length - 1; i >= 0; i--) {
    const frame = smL6RecFrames[i];
    const isTop = i === smL6RecFrames.length - 1;
    const el = document.createElement('div');
    el.className = `w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono shadow ${
      isTop
        ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
        : 'bg-zinc-800 text-zinc-200 border-zinc-700 font-medium'
    }`;
    el.innerHTML = `
      <span>factorial(${frame.n})</span>
      <span>${frame.retVal !== null ? `Returns: ${frame.retVal}` : 'Waiting for child call...'}</span>
    `;
    container.appendChild(el);
  }
}

// ============================================================================
// LEVEL 7: STACK ARCADE BOSS QUIZ & CHEATSHEET
// Comprehensive Stack Mastery Assessment
// ============================================================================
let smQuizIdx = 0;
let smQuizScore = 0;
let smQuizStreak = 0;
let smQuizLives = 3;
let smQuizAnswered = false;

const smQuizQuestions = [
  {
    q: 'What fundamental ordering principle does a Stack data structure follow?',
    opts: [
      'LIFO (Last-In, First-Out)',
      'FIFO (First-In, First-Out)',
      'LILO (Last-In, Last-Out)',
      'Random Direct Access'
    ],
    ans: 0,
    exp: 'A Stack strictly follows the LIFO (Last-In-First-Out) principle, meaning the last element added is the first one removed.'
  },
  {
    q: 'Which pointer is used to perform both insertions (push) and deletions (pop) in a stack?',
    opts: [
      'FRONT pointer',
      'REAR pointer',
      'TOP pointer',
      'ROOT pointer'
    ],
    ans: 2,
    exp: 'A Stack contains only one pointer TOP pointing to the topmost element. Both push and pop occur at the TOP.'
  },
  {
    q: 'What error condition occurs when attempting to push into a full fixed-size stack where (top == N - 1)?',
    opts: [
      'Stack Underflow',
      'Stack Overflow',
      'Segmentation Fault',
      'Null Pointer Exception'
    ],
    ans: 1,
    exp: 'Pushing onto a full stack triggers "Stack Overflow", while popping from an empty stack (top == -1) causes "Stack Underflow".'
  },
  {
    q: 'Evaluate the postfix expression "2 3 1 * + 9 -". What is the final result?',
    opts: [
      '-4',
      '14',
      '0',
      '6'
    ],
    ans: 0,
    exp: 'Step-by-step: 3*1=3, then 2+3=5, then 5-9 = -4.'
  },
  {
    q: 'Given the array [1, 3, 2, 4], what is the Next Greater Element (NGE) for element 3?',
    opts: [
      '1',
      '2',
      '4',
      '-1'
    ],
    ans: 2,
    exp: 'The first element to the right of 3 strictly greater than 3 is 4.'
  },
  {
    q: 'In checking for balanced parentheses using a stack, what action is taken when an opening bracket is scanned?',
    opts: [
      'It is evaluated immediately',
      'It is pushed onto the stack',
      'It pops the top element',
      'It causes syntax underflow'
    ],
    ans: 1,
    exp: 'If an opening bracket is encountered, it is pushed onto the stack. A closing bracket checks and pops the matching top bracket.'
  },
  {
    q: 'How does a stack facilitate string reversal?',
    opts: [
      'By sorting characters alphabetically',
      'By pushing all characters in order, then popping them one by one',
      'By swapping characters with a temporary queue',
      'By hashing characters into buckets'
    ],
    ans: 1,
    exp: 'Push all characters of the string into stack, then pop every character one by one to yield the exact reverse.'
  },
  {
    q: 'In a Linked List implementation of a stack, what two components does each node contain?',
    opts: [
      'key and value',
      'info (data) and next (pointer to next node)',
      'front and rear',
      'left child and right child'
    ],
    ans: 1,
    exp: 'Each node in the stack should contain two parts: info (user data) and next (address of the next element in the stack).'
  }
];

function smInitL7Quiz() {
  smQuizIdx = 0;
  smQuizScore = 0;
  smQuizStreak = 0;
  smQuizLives = 3;
  smQuizAnswered = false;

  const cardCont = document.getElementById('sm-quiz-card-container');
  const resCont = document.getElementById('sm-quiz-results-container');
  if (cardCont) cardCont.classList.remove('hidden');
  if (resCont) resCont.classList.add('hidden');

  smLoadQuizQuestion();
}

function smLoadQuizQuestion() {
  if (smQuizIdx >= smQuizQuestions.length || smQuizLives <= 0) {
    smShowQuizResults();
    return;
  }

  smQuizAnswered = false;
  const qObj = smQuizQuestions[smQuizIdx];

  const qNum = document.getElementById('sm-quiz-q-num');
  const qText = document.getElementById('sm-quiz-question-text');
  const optsContainer = document.getElementById('sm-quiz-options-container');
  const nextBtn = document.getElementById('sm-quiz-next-btn');

  if (qNum) qNum.innerText = `Question ${smQuizIdx + 1} of ${smQuizQuestions.length}`;
  if (qText) qText.innerText = qObj.q;
  if (nextBtn) nextBtn.classList.add('hidden');

  if (optsContainer) {
    optsContainer.innerHTML = '';
    qObj.opts.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-left text-sm font-semibold text-white border border-zinc-700 transition flex items-center justify-between group shadow-sm';
      btn.innerHTML = `
        <span class="flex items-center space-x-3">
          <span class="w-7 h-7 rounded-lg bg-zinc-900 text-zinc-300 font-mono font-bold flex items-center justify-center text-xs group-hover:bg-violet-600 group-hover:text-white transition">
            ${['A', 'B', 'C', 'D'][idx]}
          </span>
          <span>${opt}</span>
        </span>
        <span id="sm-opt-icon-${idx}" class="text-sm"></span>
      `;
      btn.onclick = () => smAnswerQuiz(idx);
      optsContainer.appendChild(btn);
    });
  }

  smUpdateTopStatCards(7);
}

function smAnswerQuiz(selectedIdx) {
  if (smQuizAnswered) return;
  smQuizAnswered = true;

  const qObj = smQuizQuestions[smQuizIdx];
  const isCorrect = selectedIdx === qObj.ans;

  if (isCorrect) {
    smQuizScore += 100 + smQuizStreak * 25;
    smQuizStreak++;
    smPlaySuccessSound();
    showToast(`Correct! +${100 + (smQuizStreak - 1) * 25} PTS`, 'success');
  } else {
    smQuizStreak = 0;
    smQuizLives--;
    smPlayErrorSound();
    showToast(`Incorrect! The correct answer was: ${qObj.opts[qObj.ans]}`, 'error');
  }

  // Highlight choices
  const optsContainer = document.getElementById('sm-quiz-options-container');
  if (optsContainer) {
    const buttons = optsContainer.querySelectorAll('button');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === qObj.ans) {
        btn.className = 'w-full p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-left text-sm font-bold text-emerald-200 transition flex items-center justify-between shadow';
      } else if (idx === selectedIdx && !isCorrect) {
        btn.className = 'w-full p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-left text-sm font-bold text-rose-200 transition flex items-center justify-between shadow';
      } else {
        btn.className = 'w-full p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left text-sm font-medium text-zinc-500 opacity-60';
      }
    });
  }

  const nextBtn = document.getElementById('sm-quiz-next-btn');
  if (nextBtn) nextBtn.classList.remove('hidden');

  smUpdateTopStatCards(7);
}

function smNextQuizQuestion() {
  smQuizIdx++;
  smLoadQuizQuestion();
}

function smShowQuizResults() {
  smPlaySuccessSound();
  if (typeof triggerConfetti === 'function') triggerConfetti();

  const cardCont = document.getElementById('sm-quiz-card-container');
  const resCont = document.getElementById('sm-quiz-results-container');
  if (cardCont) cardCont.classList.add('hidden');
  if (resCont) resCont.classList.remove('hidden');

  const scoreEl = document.getElementById('sm-final-score');
  if (scoreEl) scoreEl.innerText = `${smQuizScore} PTS`;

  const accEl = document.getElementById('sm-final-acc');
  const accuracy = Math.round((smQuizScore / (smQuizQuestions.length * 100)) * 100);
  if (accEl) accEl.innerText = `${Math.min(100, accuracy)}%`;
}

function smToggleCheatsheet() {
  const modal = document.getElementById('sm-cheatsheet-modal');
  if (modal) modal.classList.toggle('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function smShowVictoryModal(title, subtitle, nextLvl = 2) {
  const modal = document.getElementById('sm-victory-modal');
  const titleEl = document.getElementById('sm-victory-title');
  const subEl = document.getElementById('sm-victory-subtitle');
  const btn = document.getElementById('sm-victory-action-btn');

  if (titleEl) titleEl.innerText = title;
  if (subEl) subEl.innerText = subtitle;
  if (btn) {
    btn.onclick = () => {
      if (modal) modal.classList.add('hidden');
      smSwitchLevel(nextLvl);
    };
  }
  if (modal) modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function smCloseVictoryModal() {
  const modal = document.getElementById('sm-victory-modal');
  if (modal) modal.classList.add('hidden');
}

// ----------------------------------------------------------------------------
// Top-Level Game Switcher & Landing Navigation
// ----------------------------------------------------------------------------
function returnToLanding() {
  const landing = document.getElementById('landing-hub');
  const queueApp = document.getElementById('queue-app-container');
  const stackApp = document.getElementById('stack-app-container');

  if (landing) landing.classList.remove('hidden');
  if (queueApp) queueApp.classList.add('hidden');
  if (stackApp) stackApp.classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) window.lucide.createIcons();
}

function launchStackGame() {
  const landing = document.getElementById('landing-hub');
  const queueApp = document.getElementById('queue-app-container');
  const stackApp = document.getElementById('stack-app-container');

  if (landing) landing.classList.add('hidden');
  if (queueApp) queueApp.classList.add('hidden');
  if (stackApp) stackApp.classList.remove('hidden');

  smSwitchLevel(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) window.lucide.createIcons();
}

function launchQueueGame() {
  const landing = document.getElementById('landing-hub');
  const queueApp = document.getElementById('queue-app-container');
  const stackApp = document.getElementById('stack-app-container');

  if (landing) landing.classList.add('hidden');
  if (stackApp) stackApp.classList.add('hidden');
  if (queueApp) queueApp.classList.remove('hidden');

  if (typeof switchLevel === 'function') switchLevel(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) window.lucide.createIcons();
}


// ----------------------------------------------------------------------------
// Stack Concept Guide Modal Controls
// ----------------------------------------------------------------------------
function smOpenConceptModal(tab = null) {
  const targetTab = tab !== null ? tab : smCurrentLevel;
  const modal = document.getElementById('sm-concept-modal');
  if (modal) modal.classList.remove('hidden');
  smSwitchConceptTab(targetTab);
  if (window.lucide) window.lucide.createIcons();
}

function smCloseConceptModal() {
  const modal = document.getElementById('sm-concept-modal');
  if (modal) modal.classList.add('hidden');
}

function smSwitchConceptTab(tab) {
  for (let i = 1; i <= 7; i++) {
    const btn = document.getElementById(`sm-concept-tab-${i}`);
    const content = document.getElementById(`sm-concept-content-${i}`);
    if (btn && content) {
      if (i === tab) {
        btn.className = 'flex-1 py-2 px-3 rounded-xl bg-violet-600 text-white font-bold whitespace-nowrap shadow-sm text-xs transition';
        content.classList.remove('hidden');
      } else {
        btn.className = 'flex-1 py-2 px-3 rounded-xl text-zinc-400 hover:text-white whitespace-nowrap text-xs transition';
        content.classList.add('hidden');
      }
    }
  }
  if (window.lucide) window.lucide.createIcons();
}
