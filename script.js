// ==========================================
// MOTOR DE ÁUDIO (SÍNTESE DIRETA DO NAVEGADOR)
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let isAudioEnabled = true;

const SoundEngine = {
    init: function() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    },
    playTone: function(freq, type, duration, vol = 0.05) {
        if (!isAudioEnabled || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    },
    type: () => SoundEngine.playTone(800, 'square', 0.05, 0.01), 
    click: () => SoundEngine.playTone(400, 'sine', 0.1, 0.05),   
    success: () => { 
        SoundEngine.playTone(440, 'sine', 0.1, 0.1);
        setTimeout(() => SoundEngine.playTone(554, 'sine', 0.1, 0.1), 100);
        setTimeout(() => SoundEngine.playTone(659, 'sine', 0.3, 0.1), 200);
    },
    error: () => { 
        SoundEngine.playTone(150, 'sawtooth', 0.3, 0.1);
        setTimeout(() => SoundEngine.playTone(100, 'sawtooth', 0.4, 0.15), 150);
    },
    alarm: () => { 
        SoundEngine.playTone(600, 'square', 0.3, 0.05);
        setTimeout(() => SoundEngine.playTone(800, 'square', 0.3, 0.05), 300);
    },
    gameover: () => { 
        SoundEngine.playTone(200, 'sawtooth', 1.0, 0.2);
        setTimeout(() => SoundEngine.playTone(100, 'sawtooth', 1.5, 0.2), 200);
    }
};

// BANCO DE DADOS - DIRETRIZES DO IFCE
const questionsData = [
    {
        title: "Falha de Setor: Quantização",
        text: "O cabeamento primário de cobre acusa corrente de 8,0 A. Sendo a carga elementar |e| = 1,6 x 10^-19 C, defina o tipo de portador e a quantidade de cargas por segundo que devemos estabilizar:",
        options: [
            "A) Prótons; 4,0 x 10^19 partículas/s",
            "B) Elétrons; 5,0 x 10^19 elétrons/s",
            "C) Prótons; 5,0 x 10^19 partículas/s",
            "D) Elétrons; 4,0 x 10^19 elétrons/s"
        ],
        correctAnswer: 1,
        explanation: "Em condutores metálicos, a corrente flui exclusivamente por elétrons livres. Usando I = Q/t, Q = 8,0 C. Pela quantização (Q = n*e), n = 8,0 / (1,6 x 10^-19) = 5,0 x 10^19 elétrons.",
        schematic: "TENSÃO: NOMINAL | CARGA: DESCONHECIDA"
    },
    {
        title: "Falha de Setor: Dimensionamento Térmico",
        text: "O aquecedor de fluido em 110V está consumindo 3200W (modo inverno). Para evitar desarme intempestivo e incêndio, qual o disjuntor de proteção mínimo comercial a ser configurado?",
        options: [
            "A) 20 A",
            "B) 23 A",
            "C) 25 A",
            "D) 30 A"
        ],
        correctAnswer: 3,
        explanation: "Pela relação de Potência (P = U * I), 3200 = 110 * I -> I ≈ 29,09 A. Por razões de engenharia e segurança, arredonda-se para o disjuntor superior imediato: 30 A.",
        schematic: "P = 3200W | U = 110V"
    },
    {
        title: "Falha de Setor: Diagnóstico de Risco",
        text: "Relatórios mostram duas anomalias. I: Rompimento de isolação ligando Fase direto ao Neutro. II: Múltiplas máquinas pesadas ligadas em um único barramento paralelo. Físicamente, I e II configuram:",
        options: [
            "A) Ambos curto-circuitos.",
            "B) Sobrecarga na I e curto-circuito na II.",
            "C) Curto-circuito na I e sobrecarga na II.",
            "D) Ambas sobrecargas."
        ],
        correctAnswer: 2,
        explanation: "Contato direto fase/neutro zera a resistência (R->0), gerando corrente altíssima imediata (Curto-circuito). Já a adição de aparelhos em paralelo diminui a resistência equivalente aos poucos, causando superaquecimento (Sobrecarga).",
        schematic: "ANOMALIA I: FASE->NEUTRO | ANOMALIA II: R_eq ↓"
    },
    {
        title: "Falha de Setor: Calibração Ôhmica",
        text: "Um resistor de controle operava sob 20V gerando 4A. A nova diretriz exige que a corrente seja limitada a 3A. Qual tensão devemos aplicar aos terminais deste mesmo componente?",
        options: [
            "A) 5 V",
            "B) 12 V",
            "C) 15 V",
            "D) 60 V"
        ],
        correctAnswer: 2,
        explanation: "Pela 1ª Lei de Ohm (U=R*I), a resistência do componente é R = 20/4 = 5Ω. Sendo constante (ôhmico), para passar 3A a nova tensão deve ser U = 5 * 3 = 15V.",
        schematic: "U_inicial = 20V | I_inicial = 4A"
    },
    {
        title: "Falha de Setor: Conversão Térmica",
        text: "Precisamos alocar energia apenas para componentes que operam puramente via Efeito Joule. Selecione o grupo de hardware válido:",
        options: [
            "A) Chuveiro elétrico, geladeira, ventilador.",
            "B) Secador, ferro de solda, aquecedor, torradeira.",
            "C) Lâmpada de LED, motor elétrico, CPU principal.",
            "D) Ar-condicionado, bombas hidráulicas."
        ],
        correctAnswer: 1,
        explanation: "Sistemas como ventilação e refrigeração envolvem motores (energia mecânica). O grupo B converte energia elétrica quase integralmente em calor útil via resistência (Efeito Joule puro).",
        schematic: "FILTRO: EFEITO JOULE 100%"
    },
    {
        title: "Falha de Setor: Biossegurança Humana",
        text: "A equipe de resgate relata fio desencapado de 220V no chão. Considerando resistência da pele seca (~100.000 Ω) vs botas molhadas (~1.000 Ω), o impacto de corrente nos agentes seria, respectivamente:",
        options: [
            "A) 220 A e 22 A",
            "B) 2,2 mA e 220 mA",
            "C) 220 mA e 2,2 mA",
            "D) 22 mA e 220 mA"
        ],
        correctAnswer: 1,
        explanation: "Pele Seca: I = 220/100000 = 0,0022A (2,2mA - formigamento). Pele Molhada: I = 220/1000 = 0,22A (220mA - risco severo de fibrilação cardíaca e óbito).",
        schematic: "R_Seco = 100kΩ | R_Molhado = 1kΩ"
    },
    {
        title: "Falha de Setor: Colapso do Gerador",
        text: "Uma bateria química de backup (12V, r=0,1Ω) entrou em colapso total (U=0). Calcule a corrente de curto-circuito e a potência térmica que está derretendo o núcleo internamente:",
        options: [
            "A) 12 A e 144 W",
            "B) 120 A e 1.440 W",
            "C) 1.200 A e 14.400 W",
            "D) 1,2 A e 14,4 W"
        ],
        correctAnswer: 1,
        explanation: "Sem ddp externa, I = E/r -> 12/0,1 = 120A. O calor interno é a potência dissipada na resistência própria: P = r * I^2 -> 0,1 * 120^2 = 1.440W.",
        schematic: "E = 12V | r_interna = 0,1Ω | Curto-Circuito"
    },
    {
        title: "Falha de Setor: Reversão Analógica",
        text: "O software de decodificação travou. Para consertar, você deve mapear as grandezas elétricas usando analogia hidráulica (Bomba, Cano Fino, Vazão de água), respectivamente:",
        options: [
            "A) Bomba=Resistor; Cano=Bateria; Vazão=Tensão.",
            "B) Bomba=Bateria; Cano=Resistência; Vazão=Corrente.",
            "C) Bomba=Corrente; Cano=Interruptor; Vazão=Potencial.",
            "D) Bomba=Condutor; Cano=DDP; Vazão=Resistividade."
        ],
        correctAnswer: 1,
        explanation: "A bomba gera a pressão que empurra a água (Bateria/Tensão). O cano mais fino dificulta a passagem física (Resistência elétrica). A quantidade de fluxo de água no tubo representa a taxa de Corrente.",
        schematic: "SISTEMA DE TRADUÇÃO ANALÓGICA ATIVO"
    },
    {
        title: "Falha de Setor: Limite Térmico de Cabeamento",
        text: "O condutor de salvaguarda possui 0,5 Ω e seu polímero isolante suporta no máximo a dissipação de 72 W de calor antes de derreter. Qual a corrente máxima tolerada na malha?",
        options: [
            "A) 3 A",
            "B) 6 A",
            "C) 12 A",
            "D) 15 A"
        ],
        correctAnswer: 2,
        explanation: "Aplicando Efeito Joule (P = R * I^2), temos 72 = 0,5 * I^2. Logo, I^2 = 144. Extraindo a raiz quadrada, a corrente máxima que o condutor suporta é 12A.",
        schematic: "R_Fio = 0,5Ω | Limite_P = 72W"
    },
    {
        title: "Falha de Setor: Pico de Demanda",
        text: "Temos energia limitada. Analise o consumo e aponte qual hardware estabelece o MAIOR fluxo de corrente (I): Resfriador (360W/120V), Forno Industrial (2520W/120V) ou Bomba D'água (4400W/220V)?",
        options: [
            "A) Resfriador (Geladeira)",
            "B) Forno Industrial (Ferro)",
            "C) Motores Axiais (Ar-Condicionado)",
            "D) Bomba D'água (Chuveiro)"
        ],
        correctAnswer: 1,
        explanation: "O fluxo de corrente é I = P/U. Resfriador=3A. Bomba(4400/220)=20A. O Forno, por operar em 120V sob 2520W, puxa a carga máxima de 21A, sendo o componente mais estressante para a rede de corrente.",
        schematic: "COMPARADOR DE FLUXO (I = P/U)"
    }
];

// VARIÁVEIS DO SISTEMA
let questions = [];
let currentQuestionIndex = 0;
let restoredCount = 0;
let integrity = 100;
let timeRemaining = 300; 
let timerInterval;
let typingTimeout;

// REFERÊNCIAS DO DOM - GERAIS
const startScreen = document.getElementById('start-screen');
const gameUI = document.getElementById('game-ui');
const startBtn = document.getElementById('start-btn');
const timerDisplay = document.getElementById('timer-display');
const integrityText = document.getElementById('integrity-text');
const integrityBarFill = document.getElementById('integrity-bar-fill');
const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const feedbackPanel = document.getElementById('feedback-panel');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const facilityMap = document.getElementById('facility-map');

// REFERÊNCIAS DO DOM - PAINEL ESQUERDO
const circuitPanelTitle = document.getElementById('circuit-panel-title');
const circuitWrapper = document.getElementById('circuit-wrapper');
const powerSourceBox = document.getElementById('power-source');
const powerVal = document.getElementById('power-val');
const componentSlot = document.getElementById('component-slot');
const compStatus = document.getElementById('comp-status');
const compMeter = document.getElementById('comp-meter');
const circuitLog = document.getElementById('circuit-log');
const wires = document.querySelectorAll('.wire');

// REFERÊNCIAS DOS MODAIS E ÁUDIO
const endgameModal = document.getElementById('endgame-modal');
const modalContentBox = document.getElementById('modal-content-box');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalRestored = document.getElementById('modal-restored');
const restartBtn = document.getElementById('restart-btn');

const manualModal = document.getElementById('manual-modal');
const openManualSideBtn = document.getElementById('open-manual-side-btn');
const closeManualBtn = document.getElementById('close-manual-btn');

const audioToggleBtn = document.getElementById('audio-toggle-btn');

// CONTROLES DE ÁUDIO E MANUAL
audioToggleBtn.onclick = () => {
    isAudioEnabled = !isAudioEnabled;
    audioToggleBtn.innerHTML = isAudioEnabled ? "🔊 ÁUDIO ON" : "🔇 ÁUDIO OFF";
    audioToggleBtn.style.color = isAudioEnabled ? "var(--neon-cyan)" : "#777";
    SoundEngine.click();
};

const openManualAction = () => { SoundEngine.click(); manualModal.classList.remove('hidden'); };
openManualSideBtn.onclick = openManualAction;
closeManualBtn.onclick = () => { SoundEngine.click(); manualModal.classList.add('hidden'); };

// SHUFFLE
function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// INICIALIZAR MAPA
function initMap() {
    facilityMap.innerHTML = '';
    for(let i=1; i<=10; i++) {
        const node = document.createElement('div');
        node.className = 'map-node';
        node.textContent = i;
        node.id = `node-${i}`;
        facilityMap.appendChild(node);
    }
}

// INICIAR JOGO
startBtn.onclick = startGame;
restartBtn.onclick = startGame;

function startGame() {
    SoundEngine.init(); 
    SoundEngine.click();
    
    startScreen.classList.add('hidden');
    endgameModal.classList.add('hidden');
    manualModal.classList.add('hidden');
    gameUI.classList.remove('hidden');
    
    integrityBarFill.style.background = "var(--neon-green)";
    integrityBarFill.style.boxShadow = "0 0 10px var(--neon-green)";
    
    currentQuestionIndex = 0;
    restoredCount = 0;
    integrity = 100;
    timeRemaining = 300;
    questions = shuffleArray(questionsData);
    
    updateIntegrityUI();
    initMap();
    startTimer();
    loadQuestion();
}

// TIMER
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 60 && timeRemaining > 0) {
            timerDisplay.classList.add('danger');
            if(timeRemaining % 10 === 0) SoundEngine.alarm();
        } else {
            timerDisplay.classList.remove('danger');
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            triggerModal("timeout");
        }
    }, 1000);
}

function updateTimerDisplay() {
    const m = Math.floor(Math.max(0, timeRemaining) / 60);
    const s = Math.max(0, timeRemaining) % 60;
    timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// CARREGAR PROTOCOLO (PERGUNTA)
function loadQuestion() {
    clearTimeout(typingTimeout);
    const q = questions[currentQuestionIndex];
    
    questionTitle.textContent = `>>> SETOR ${currentQuestionIndex + 1} | ${q.title}`;
    optionsGrid.innerHTML = '';
    optionsGrid.classList.add('hidden');
    feedbackPanel.classList.add('hidden');
    
    circuitPanelTitle.textContent = `DIAGRAMA: ${q.schematic}`;
    circuitWrapper.className = 'circuit-wrapper';
    
    powerSourceBox.className = 'power-source';
    powerVal.textContent = "VERIFICANDO...";
    powerVal.style.color = "#777";
    
    componentSlot.className = 'component offline';
    compStatus.textContent = 'STATUS: AGUARDANDO REPARO';
    compMeter.className = 'meter-bar hidden';
    
    circuitLog.className = 'circuit-log-text';
    circuitLog.innerHTML = `>_ LENDO DADOS DO SETOR ${currentQuestionIndex + 1}...<br>>_ INICIANDO VARREDURA TÉRMICA.<br>>_ AGUARDANDO PARÂMETROS OPERACIONAIS.`;
    
    wires.forEach(wire => wire.classList.remove('flow'));

    document.querySelectorAll('.map-node').forEach(n => n.classList.remove('active'));
    document.getElementById(`node-${currentQuestionIndex + 1}`).classList.add('active');

    questionText.textContent = '';
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < q.text.length) {
            questionText.textContent += q.text.charAt(charIndex);
            if(charIndex % 3 === 0) SoundEngine.type(); 
            charIndex++;
            typingTimeout = setTimeout(typeWriter, 15);
        } else {
            showOptions(q);
        }
    }
    typeWriter();
}

function showOptions(q) {
    optionsGrid.classList.remove('hidden');
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => {
            SoundEngine.click();
            checkAnswer(index, btn);
        };
        optionsGrid.appendChild(btn);
    });
}

// VALIDAR RESPOSTA
function checkAnswer(selectedIndex, btnElement) {
    const q = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correctAnswer;
    
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);

    feedbackPanel.classList.remove('hidden', 'success', 'error');

    if (isCorrect) {
        btnElement.classList.add('correct');
        handleSuccess(q.explanation);
    } else {
        btnElement.classList.add('wrong');
        buttons[q.correctAnswer].classList.add('correct');
        handleError(q.explanation);
    }
}

// ====== SUCESSO ======
function handleSuccess(explanation) {
    SoundEngine.success();
    restoredCount++;
    document.getElementById(`node-${currentQuestionIndex + 1}`).classList.add('restored');
    
    feedbackPanel.classList.add('success');
    feedbackTitle.innerHTML = "🟢 PARÂMETROS ACEITOS";
    feedbackTitle.style.color = "var(--neon-green)";
    feedbackText.innerHTML = `Setor normalizado.<br><br>>_ ${explanation}`;

    circuitWrapper.classList.add('success-mode');
    
    powerSourceBox.classList.add('success');
    powerVal.textContent = "CARGA MÁXIMA";
    powerVal.style.color = "var(--neon-green)";
    
    componentSlot.className = 'component online';
    compStatus.textContent = 'STATUS: OPERANTE';
    
    compMeter.classList.remove('hidden');
    compMeter.className = 'meter-bar success';
    
    circuitLog.className = 'circuit-log-text';
    circuitLog.innerHTML = `>_ CORRENTE ESTABILIZADA.<br>>_ DDP CONSTANTE.<br>>_ SINCRONIZAÇÃO: 100%<br>>_ SETOR SALVO.`;
    
    wires.forEach(wire => wire.classList.add('flow'));
}

// ====== ERRO ======
function handleError(explanation) {
    SoundEngine.error();
    integrity -= 25;
    updateIntegrityUI();
    
    feedbackPanel.classList.add('error');
    feedbackTitle.innerHTML = "🔴 AVISO DE SOBRECARGA";
    feedbackTitle.style.color = "var(--neon-red)";
    feedbackText.innerHTML = `Pico de tensão detectado. Redução de integridade.<br>Correção lógica exigida pelo sistema:<br><br>>_ ${explanation}`;

    circuitWrapper.classList.add('error-mode');
    
    powerSourceBox.classList.add('error');
    powerVal.textContent = "SOBRECARGA";
    powerVal.style.color = "var(--neon-red)";

    componentSlot.className = 'component burnt';
    compStatus.textContent = 'STATUS: CURTO-CIRCUITO';
    
    compMeter.classList.remove('hidden');
    compMeter.className = 'meter-bar error';
    
    circuitLog.className = 'circuit-log-text error-log';
    circuitLog.innerHTML = `>_ ALERTA: ANOMALIA TÉRMICA!<br>>_ RISCO DE INCÊNDIO (EFEITO JOULE).<br>>_ BLOQUEIO DE SEGURANÇA ATIVADO NA REDE.`;

    if (integrity <= 0) {
        clearInterval(timerInterval);
        setTimeout(() => triggerModal("collapse"), 1800);
    }
}

function updateIntegrityUI() {
    integrityText.textContent = `${Math.max(0, integrity)}%`;
    integrityBarFill.style.width = `${Math.max(0, integrity)}%`;
    
    if (integrity <= 50 && integrity > 25) {
        integrityBarFill.style.background = "var(--warning-yellow)";
        integrityBarFill.style.boxShadow = "0 0 10px var(--warning-yellow)";
    }
    if (integrity <= 25) {
        integrityBarFill.style.background = "var(--neon-red)";
        integrityBarFill.style.boxShadow = "0 0 10px var(--neon-red)";
    }
}

// PRÓXIMO SETOR
nextBtn.onclick = () => {
    SoundEngine.click();
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length && integrity > 0) {
        loadQuestion();
    } else if (integrity > 0) {
        clearInterval(timerInterval);
        triggerModal("victory");
    }
};

// TELINHA MODAL - FIM DE JOGO
function triggerModal(type) {
    endgameModal.classList.remove('hidden');
    endgameModal.classList.add('screen-glitch');
    
    modalContentBox.className = 'modal-content';
    modalIcon.className = 'modal-icon';

    if (type === "timeout") {
        SoundEngine.gameover();
        modalIcon.textContent = "⏳";
        modalIcon.classList.add('warning-pulse');
        modalTitle.textContent = "TEMPO ESGOTADO";
        modalTitle.style.color = "var(--warning-yellow)";
        modalDesc.textContent = "O gerador reserva esgotou sua carga. A instalação elétrica sofreu um blecaute total antes que você pudesse terminar.";
    
    } else if (type === "collapse") {
        SoundEngine.gameover();
        modalContentBox.classList.add('failed');
        modalIcon.textContent = "💥";
        modalIcon.classList.add('error-pulse');
        modalTitle.textContent = "COLAPSO ESTRUTURAL";
        modalTitle.style.color = "var(--neon-red)";
        modalDesc.textContent = "Múltiplos curtos-circuitos danificaram irremediavelmente a rede. A integridade chegou a 0% e o sistema foi destruído.";
    
    } else if (type === "victory") {
        SoundEngine.success();
        modalContentBox.classList.add('victory');
        modalIcon.textContent = "🏆";
        modalIcon.classList.add('success-pulse');
        modalTitle.textContent = "SISTEMA SALVO";
        modalTitle.style.color = "var(--neon-green)";
        modalDesc.innerHTML = `Operação impecável, Engenheiro. Energia restabelecida na base.<br>Integridade: ${integrity}% | Restante: ${timerDisplay.textContent}`;
    }

    modalRestored.textContent = `Setores Restaurados: ${restoredCount}/10`;
}