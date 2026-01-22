// Voice-First Application
import { PsyCoachAgent } from './modules/agent.js';
import { VoiceManager } from './modules/voiceManager.js';
import { ConversationFlow } from './modules/conversationFlow.js';

// DOM Elements
const dom = {
  voiceOrb: document.getElementById('voice-orb'),
  orbIcon: document.getElementById('orb-icon'),
  mainVoiceBtn: document.getElementById('main-voice-btn'),
  muteBtn: document.getElementById('mute-btn'),
  settingsBtn: document.getElementById('settings-btn'),
  transcriptContainer: document.getElementById('transcript-container'),
  transcriptLabel: document.getElementById('transcript-label'),
  transcriptText: document.getElementById('transcript-text'),
  actionCards: document.getElementById('action-cards'),
  statusText: document.getElementById('status-text'),
  navTabs: document.querySelectorAll('.nav-tab'),
  settingsModal: document.getElementById('settings-modal'),
  voiceSelect: document.getElementById('voice-select'),
  rateSlider: document.getElementById('rate-slider'),
  pitchSlider: document.getElementById('pitch-slider'),
  rateValue: document.getElementById('rate-value'),
  pitchValue: document.getElementById('pitch-value')
};

// Initialize managers
const agent = new PsyCoachAgent();
const conversationFlow = new ConversationFlow();
let voiceManager;
let isMuted = false;
let currentView = 'voice';

// Initialize app
async function init() {
  // Initialize voice manager
  voiceManager = new VoiceManager({
    onTranscript: handleTranscript,
    onError: handleVoiceError,
    onStart: handleVoiceStart,
    onEnd: handleVoiceEnd
  });

  // Check if voice is supported
  if (!voiceManager.isSupported()) {
    showError('Voice features are not supported in this browser. Please use Chrome, Safari, or Edge.');
    return;
  }

  // Setup event listeners
  setupEventListeners();

  // Load voice settings
  loadVoiceSettings();

  // Start initial flow
  startConversation();
}

function setupEventListeners() {
  // Voice orb - main interaction
  dom.voiceOrb.addEventListener('click', toggleVoice);
  dom.mainVoiceBtn.addEventListener('click', toggleVoice);

  // Mute button
  dom.muteBtn.addEventListener('click', toggleMute);

  // Settings button
  dom.settingsBtn.addEventListener('click', openSettings);

  // Navigation tabs
  dom.navTabs.forEach(tab => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });

  // Voice settings
  if (dom.rateSlider) {
    dom.rateSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      dom.rateValue.textContent = value.toFixed(2) + 'x';
      voiceManager.setVoiceSettings({ rate: value });
    });
  }

  if (dom.pitchSlider) {
    dom.pitchSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      dom.pitchValue.textContent = value.toFixed(1);
      voiceManager.setVoiceSettings({ pitch: value });
    });
  }

  // Load available voices
  if (window.speechSynthesis) {
    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = populateVoiceList;
    populateVoiceList();
  }
}

function populateVoiceList() {
  const voices = voiceManager.getAvailableVoices();
  if (voices.length === 0) return;

  dom.voiceSelect.innerHTML = voices.map(voice => 
    `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
  ).join('');

  dom.voiceSelect.addEventListener('change', (e) => {
    const selectedVoice = voices.find(v => v.name === e.target.value);
    voiceManager.setVoiceSettings({ voice: selectedVoice });
  });
}

function toggleVoice() {
  const status = voiceManager.getStatus();

  if (status.listening) {
    stopListening();
  } else if (status.speaking) {
    voiceManager.stopSpeaking();
    updateOrbState('idle');
  } else {
    startListening();
  }
}

function startListening() {
  const started = voiceManager.startListening();
  if (started) {
    updateOrbState('listening');
    dom.transcriptLabel.textContent = 'Listening...';
    dom.statusText.textContent = 'I\'m listening...';
    dom.statusText.classList.add('active');
  }
}

function stopListening() {
  voiceManager.stopListening();
  updateOrbState('idle');
}

function handleVoiceStart() {
  updateOrbState('listening');
}

function handleVoiceEnd() {
  updateOrbState('idle');
  dom.statusText.classList.remove('active');
}

async function handleTranscript({ final, interim, isFinal }) {
  if (isFinal && final) {
    // Final transcript received
    dom.transcriptText.textContent = final;
    dom.transcriptLabel.textContent = 'You said:';
    
    // Process the message
    await processUserMessage(final);
  } else if (interim) {
    // Show interim results
    dom.transcriptText.textContent = interim;
    dom.transcriptText.classList.add('interim');
  }
}

function handleVoiceError(error) {
  console.error('Voice error:', error);
  dom.statusText.textContent = 'Voice error: ' + error;
  updateOrbState('idle');
}

async function processUserMessage(message) {
  try {
    // Show processing state
    updateOrbState('thinking');
    dom.statusText.textContent = 'Thinking...';

    // Process through agent
    const response = await agent.processMessage(message);

    // Speak the response
    if (!isMuted) {
      await speakResponse(response.content);
    }

    // Update UI
    dom.transcriptLabel.textContent = 'PsyCoach says:';
    dom.transcriptText.textContent = response.content;
    dom.transcriptText.classList.remove('interim');

    // Show options if available
    if (conversationFlow.currentFlow && conversationFlow.currentFlow.options) {
      showActionOptions(conversationFlow.currentFlow.options);
    }

    // Update status
    dom.statusText.textContent = 'Ready to listen';

  } catch (error) {
    console.error('Processing error:', error);
    showError('Sorry, I had trouble processing that. Please try again.');
  }
}

async function speakResponse(text) {
  updateOrbState('speaking');
  dom.statusText.textContent = 'Speaking...';
  dom.statusText.classList.add('active');

  try {
    await voiceManager.speak(text);
  } catch (error) {
    console.error('Speech error:', error);
  } finally {
    updateOrbState('idle');
    dom.statusText.classList.remove('active');
    dom.statusText.textContent = 'Ready to listen';
  }
}

function updateOrbState(state) {
  const orb = dom.voiceOrb;
  orb.classList.remove('listening', 'speaking', 'thinking');

  const icons = {
    idle: '🎙️',
    listening: '👂',
    speaking: '🗣️',
    thinking: '🤔'
  };

  if (state !== 'idle') {
    orb.classList.add(state);
  }

  dom.orbIcon.textContent = icons[state] || icons.idle;
}

function showActionOptions(options) {
  dom.actionCards.innerHTML = '';

  options.forEach((option, index) => {
    const card = document.createElement('button');
    card.className = 'action-card';
    card.innerHTML = `
      <div class="action-card-icon">💬</div>
      <div class="action-card-content">
        <div class="action-card-title">${option.text}</div>
      </div>
    `;
    
    card.addEventListener('click', async () => {
      await handleOptionSelect(index);
    });

    dom.actionCards.appendChild(card);
  });
}

async function handleOptionSelect(index) {
  const flow = conversationFlow.getNextFlow(index);
  
  if (flow) {
    const message = flow.message;
    
    // Update UI
    dom.transcriptLabel.textContent = 'PsyCoach says:';
    dom.transcriptText.textContent = message;
    
    // Speak the message
    if (!isMuted) {
      await speakResponse(message);
    }

    // Show options
    if (flow.options) {
      showActionOptions(flow.options);
    } else {
      dom.actionCards.innerHTML = '';
    }
  }
}

async function startConversation() {
  const flow = conversationFlow.startFlow();
  const welcomeMessage = flow.message;

  // Display welcome message
  dom.transcriptLabel.textContent = 'PsyCoach says:';
  dom.transcriptText.textContent = welcomeMessage;

  // Speak welcome message
  if (!isMuted) {
    setTimeout(async () => {
      await speakResponse(welcomeMessage);
      
      // Show options after speaking
      if (flow.options) {
        showActionOptions(flow.options);
      }
    }, 1000);
  } else {
    if (flow.options) {
      showActionOptions(flow.options);
    }
  }
}

function toggleMute() {
  isMuted = !isMuted;
  dom.muteBtn.innerHTML = isMuted ? '<span>🔇</span>' : '<span>🔊</span>';
  dom.muteBtn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
  
  if (isMuted) {
    voiceManager.stopSpeaking();
  }
}

function openSettings() {
  if (dom.settingsModal) {
    dom.settingsModal.style.display = 'flex';
  }
}

function closeSettings() {
  if (dom.settingsModal) {
    dom.settingsModal.style.display = 'none';
  }
}

function loadVoiceSettings() {
  const settings = voiceManager.voiceSettings;
  
  if (dom.rateSlider) {
    dom.rateSlider.value = settings.rate;
    dom.rateValue.textContent = settings.rate.toFixed(2) + 'x';
  }
  
  if (dom.pitchSlider) {
    dom.pitchSlider.value = settings.pitch;
    dom.pitchValue.textContent = settings.pitch.toFixed(1);
  }
}

function switchView(view) {
  currentView = view;
  
  // Update tabs
  dom.navTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.view === view);
  });

  // Update interface
  if (view === 'voice') {
    // Show voice interface
    dom.transcriptContainer.style.display = 'block';
    dom.actionCards.style.display = 'grid';
  } else {
    // Show other views (to be implemented)
    dom.statusText.textContent = `${view} view - Coming soon`;
  }
}

function showError(message) {
  dom.transcriptLabel.textContent = 'Error';
  dom.transcriptText.textContent = message;
  dom.statusText.textContent = message;
}

// Global functions for modal
window.closeSettings = closeSettings;

// Initialize when DOM is ready
init();

