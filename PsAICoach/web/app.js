// Main Application Entry Point - Companion UI
import { PsyCoachAgent } from './modules/agent.js';
import { JournalManager } from './modules/journalManager.js';
import { UIUtils } from './modules/uiUtils.js';
import { mockData } from './data.js';

// DOM Elements
const dom = {
  // Navigation
  navBtns: document.querySelectorAll('.nav-btn'),
  sections: document.querySelectorAll('.companion-section'),
  
  // Conversation
  conversationForm: document.getElementById('conversation-form'),
  conversationInput: document.getElementById('conversation-input'),
  conversationLog: document.getElementById('conversation-log'),
  
  // Capture Buttons
  capturePhoto: document.getElementById('capture-photo'),
  captureVideo: document.getElementById('capture-video'),
  voiceToggle: document.getElementById('voice-toggle'),
  
  // Camera Modal
  cameraModal: document.getElementById('camera-modal'),
  cameraTitle: document.getElementById('camera-title'),
  cameraPreview: document.getElementById('camera-preview'),
  cameraCanvas: document.getElementById('camera-canvas'),
  cameraCapture: document.getElementById('camera-capture'),
  cameraSwitch: document.getElementById('camera-switch'),
  cameraClose: document.querySelector('.camera-close'),
  arOverlay: document.getElementById('ar-overlay'),
  arTimestamp: document.querySelector('.ar-timestamp'),
  capturedMedia: document.getElementById('captured-media'),
  capturedImage: document.getElementById('captured-image'),
  saveMedia: document.getElementById('save-media'),
  retakeMedia: document.getElementById('retake-media'),
  
  // Journal
  journalPrompt: document.getElementById('journal-prompt'),
  journalSave: document.getElementById('journal-save'),
  journalResponse: document.getElementById('journal-response'),
  journalFeedback: document.getElementById('journal-feedback'),
  momentsList: document.getElementById('moments-list'),
  moodChart: document.getElementById('mood-chart'),
  
  // Tools
  realityCheckCard: document.getElementById('reality-check-card'),
  groundingCard: document.getElementById('grounding-card'),
  cbtCard: document.getElementById('cbt-card'),
  moodCard: document.getElementById('mood-card'),
  
  // Tool Modals
  realityModal: document.getElementById('reality-modal'),
  groundingModal: document.getElementById('grounding-modal'),
  cbtModal: document.getElementById('cbt-modal'),
  realityForm: document.getElementById('reality-form'),
  realityScenario: document.getElementById('reality-scenario'),
  realityResult: document.getElementById('reality-result'),
  distortionsList: document.getElementById('distortions-list'),
  reframesList: document.getElementById('reframes-list'),
  groundingList: document.getElementById('grounding-list'),
  
  // Insights
  moodSummary: document.getElementById('mood-summary'),
  highlightList: document.getElementById('highlight-list'),
  
  // Crisis
  crisisBanner: document.getElementById('crisis-banner'),
  crisisClose: document.querySelector('.crisis-close')
};

// Initialize Agent and Managers
const agent = new PsyCoachAgent();
const journalManager = new JournalManager();

// Camera state
let cameraStream = null;
let currentCamera = 'user'; // 'user' or 'environment'
let cameraMode = 'photo'; // 'photo' or 'video'

// Voice state
let isVoiceActive = false;

// Initialize the app
async function init() {
  await journalManager.init();
  
  // Setup navigation
  setupNavigation();
  
  // Setup conversation
  setupConversation();
  
  // Setup capture buttons
  setupCaptureButtons();
  
  // Setup camera
  setupCamera();
  
  // Setup journal
  setupJournal();
  
  // Setup tools
  setupTools();
  
  // Setup insights
  setupInsights();
  
  // Setup crisis banner
  setupCrisisBanner();
  
  // Welcome message
  if (!localStorage.getItem('psycoach-welcomed')) {
    setTimeout(() => {
      pushMessage(
        "Hi! I'm PsAICoSys, your companion for managing psychosis. I can help with reality checks, grounding, and support. How are you feeling today?",
        'bot'
      );
      localStorage.setItem('psycoach-welcomed', 'true');
    }, 500);
  }
}

// ============================================
// NAVIGATION
// ============================================
function setupNavigation() {
  dom.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSection = btn.dataset.section;
      
      // Update nav buttons
      dom.navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update sections
      dom.sections.forEach(section => {
        if (section.id === targetSection) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
      
      // Refresh icons after section change
      setTimeout(() => window.refreshIcons(), 50);
    });
  });
}

// ============================================
// CONVERSATION
// ============================================
function setupConversation() {
  dom.conversationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = dom.conversationInput.value.trim();
    if (!text) return;

    // Add user message
    pushMessage(text, 'user');
    dom.conversationInput.value = '';
    dom.conversationInput.style.height = 'auto';
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
      // Process message through agent
      const response = await agent.processMessage(text);
      
      // Remove typing indicator
      typingIndicator.remove();

      // Handle crisis
      if (response.isCrisis) {
        showCrisisBanner(response.resources);
        pushMessage(response.content, 'bot', 'crisis');
        return;
      }

      // Handle elevated concern
      if (response.elevated) {
        pushMessage(response.content, 'bot', 'warning');
        return;
      }

      // Normal response
      pushMessage(response.content, 'bot');

    } catch (error) {
      typingIndicator.remove();
      console.error('Conversation error:', error);
      pushMessage(
        "I'm having trouble processing that. Could you rephrase?",
        'bot'
      );
    }
  });

  // Auto-resize textarea
  dom.conversationInput.addEventListener('input', () => {
    dom.conversationInput.style.height = 'auto';
    dom.conversationInput.style.height = Math.min(dom.conversationInput.scrollHeight, 120) + 'px';
  });
}

function pushMessage(text, sender, type = 'normal') {
  const li = document.createElement('li');
  li.className = `message ${sender} ${type !== 'normal' ? 'message-' + type : ''}`;
  
  const messageContent = document.createElement('span');
  messageContent.className = 'message-content';
  messageContent.textContent = text;
  
  const messageTime = document.createElement('time');
  messageTime.textContent = UIUtils.timestamp();
  
  li.appendChild(messageContent);
  li.appendChild(messageTime);
  
  dom.conversationLog.appendChild(li);
  
  // Scroll to bottom
  dom.conversationLog.scrollTop = dom.conversationLog.scrollHeight;
  
  // Also scroll the container
  setTimeout(() => {
    const container = document.querySelector('.conversation-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, 100);
}

function showTypingIndicator() {
  const li = document.createElement('li');
  li.className = 'message bot typing-indicator';
  li.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
  dom.conversationLog.appendChild(li);
  
  // Scroll to bottom
  setTimeout(() => {
    const container = document.querySelector('.conversation-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, 50);
  
  return li;
}

// ============================================
// CAPTURE BUTTONS
// ============================================
function setupCaptureButtons() {
  // Photo capture
  if (dom.capturePhoto) {
    dom.capturePhoto.addEventListener('click', () => {
      cameraMode = 'photo';
      openCamera();
    });
  }
  
  // Video capture (with AR overlay)
  if (dom.captureVideo) {
    dom.captureVideo.addEventListener('click', () => {
      cameraMode = 'video';
      openCamera(true); // with AR overlay
    });
  }
  
  // Voice toggle
  if (dom.voiceToggle) {
    dom.voiceToggle.addEventListener('click', toggleVoice);
  }
}

function toggleVoice() {
  isVoiceActive = !isVoiceActive;
  dom.voiceToggle.classList.toggle('active', isVoiceActive);
  
  if (isVoiceActive) {
    // Start voice recognition (placeholder - would use Web Speech API)
    UIUtils.showNotification('Voice input active - speak now', 'info');
    
    // Simulate voice recognition
    setTimeout(() => {
      isVoiceActive = false;
      dom.voiceToggle.classList.remove('active');
      UIUtils.showNotification('Voice input stopped', 'info');
    }, 5000);
  } else {
    UIUtils.showNotification('Voice input stopped', 'info');
  }
}

// ============================================
// CAMERA
// ============================================
function setupCamera() {
  // Close camera
  if (dom.cameraClose) {
    dom.cameraClose.addEventListener('click', closeCamera);
  }
  
  // Capture button
  if (dom.cameraCapture) {
    dom.cameraCapture.addEventListener('click', captureImage);
  }
  
  // Switch camera
  if (dom.cameraSwitch) {
    dom.cameraSwitch.addEventListener('click', switchCamera);
  }
  
  // Retake
  if (dom.retakeMedia) {
    dom.retakeMedia.addEventListener('click', () => {
      dom.capturedMedia.hidden = true;
      dom.cameraPreview.hidden = false;
      dom.cameraCapture.hidden = false;
      dom.cameraSwitch.hidden = false;
    });
  }
  
  // Save and share with PsyCoach
  if (dom.saveMedia) {
    dom.saveMedia.addEventListener('click', async () => {
      const imageData = dom.capturedImage.src;
      
      // Add to conversation
      pushMessage('I captured this moment. Can you help me validate what I saw?', 'user');
      
      const typingIndicator = showTypingIndicator();
      
      // Simulate AI response about the image
      setTimeout(() => {
        typingIndicator.remove();
        pushMessage(
          "Thank you for sharing that. Looking at the image with the AR overlay, we can see the timestamp and grid reference. What do you notice? Does the image match what you perceived in the moment?",
          'bot'
        );
      }, 1500);
      
      UIUtils.showNotification('Moment saved and shared', 'success');
      closeCamera();
    });
  }
}

async function openCamera(withAR = false) {
  try {
    // Request camera access
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentCamera },
      audio: false
    });
    
    // Set stream to video element
    dom.cameraPreview.srcObject = cameraStream;
    
    // Update title
    dom.cameraTitle.textContent = cameraMode === 'photo' ? 'Capture Moment' : 'Reality Check Video';
    
    // Show AR overlay if video mode
    if (withAR && dom.arOverlay) {
      dom.arOverlay.hidden = false;
      updateARTimestamp();
      setInterval(updateARTimestamp, 1000);
    } else if (dom.arOverlay) {
      dom.arOverlay.hidden = true;
    }
    
    // Show modal
    dom.cameraModal.hidden = false;
    dom.capturedMedia.hidden = true;
    dom.cameraPreview.hidden = false;
    dom.cameraCapture.hidden = false;
    dom.cameraSwitch.hidden = false;
    
    // Refresh icons
    setTimeout(() => window.refreshIcons(), 50);
    
  } catch (error) {
    console.error('Camera access error:', error);
    UIUtils.showNotification('Camera access denied', 'error');
  }
}

function closeCamera() {
  // Stop camera stream
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  
  // Hide modal
  dom.cameraModal.hidden = true;
  dom.capturedMedia.hidden = true;
  
  // Hide AR overlay
  if (dom.arOverlay) {
    dom.arOverlay.hidden = true;
  }
}

async function switchCamera() {
  currentCamera = currentCamera === 'user' ? 'environment' : 'user';
  
  // Close current stream
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
  }
  
  // Reopen with new camera
  await openCamera(cameraMode === 'video');
}

function captureImage() {
  const video = dom.cameraPreview;
  const canvas = dom.cameraCanvas;
  const context = canvas.getContext('2d');
  
  // Set canvas size to video size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Draw video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // If AR overlay is active, draw it on the canvas too
  if (!dom.arOverlay.hidden) {
    // Draw AR grid effect
    context.strokeStyle = 'rgba(0, 217, 255, 0.3)';
    context.lineWidth = 1;
    const gridSize = 50;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }
    
    // Add timestamp
    const timestamp = new Date().toLocaleString();
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(canvas.width - 200, canvas.height - 40, 190, 30);
    context.fillStyle = 'white';
    context.font = '14px Inter, sans-serif';
    context.fillText(timestamp, canvas.width - 195, canvas.height - 18);
    
    // Add "Reality Check" indicator
    context.fillStyle = 'rgba(16, 185, 129, 0.9)';
    context.fillRect(canvas.width / 2 - 90, 20, 180, 36);
    context.fillStyle = 'white';
    context.font = 'bold 16px Inter, sans-serif';
    context.fillText('✓ PsAICoSys Reality Check', canvas.width / 2 - 85, 44);
  }
  
  // Convert to image
  const imageData = canvas.toDataURL('image/png');
  dom.capturedImage.src = imageData;
  
  // Show captured image
  dom.cameraPreview.hidden = true;
  dom.cameraCapture.hidden = true;
  dom.cameraSwitch.hidden = true;
  dom.capturedMedia.hidden = false;
}

function updateARTimestamp() {
  if (dom.arTimestamp) {
    const now = new Date();
    dom.arTimestamp.textContent = now.toLocaleTimeString();
  }
}

// ============================================
// JOURNAL
// ============================================
function setupJournal() {
  // Display random prompt
  if (dom.journalPrompt) {
    dom.journalPrompt.textContent = journalManager.getRandomPrompt();
  }

  // Save journal entry
  if (dom.journalSave) {
    dom.journalSave.addEventListener('click', async () => {
      const response = dom.journalResponse.value.trim();
      
      if (!response) {
        dom.journalFeedback.textContent = 'Write something to save your reflection.';
        dom.journalFeedback.style.color = 'var(--text-muted)';
        return;
      }

      try {
        await journalManager.saveEntry(response);
        dom.journalResponse.value = '';
        dom.journalFeedback.textContent = '✓ Saved securely on your device';
        dom.journalFeedback.style.color = 'var(--success)';
        
        UIUtils.showNotification('Journal entry saved', 'success');
        
        setTimeout(() => {
          dom.journalFeedback.textContent = '';
        }, 3000);
        
      } catch (error) {
        console.error('Journal save error:', error);
        dom.journalFeedback.textContent = 'Error saving entry';
        dom.journalFeedback.style.color = 'var(--error)';
      }
    });
  }

  // Render notable moments
  if (dom.momentsList) {
    mockData.notableMoments.forEach(moment => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${moment.title}:</strong> ${moment.detail}`;
      dom.momentsList.appendChild(li);
    });
  }

  // Render mood chart
  if (dom.moodChart) {
    renderMoodChart();
  }
}

function renderMoodChart() {
  new Chart(dom.moodChart, {
    type: 'line',
    data: {
      labels: mockData.moodTrend.map(({ date }) => 
        new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
      ),
      datasets: [{
        label: 'Mood (0-10)',
        data: mockData.moodTrend.map(({ score }) => score),
        tension: 0.4,
        borderColor: 'rgba(81, 104, 246, 1)',
        backgroundColor: 'rgba(81, 104, 246, 0.18)',
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(81, 104, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(31, 41, 51, 0.95)',
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 }
        }
      },
      scales: {
        y: {
          suggestedMin: 0,
          suggestedMax: 10,
          ticks: {
            stepSize: 2
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  });
}

// ============================================
// TOOLS
// ============================================
function setupTools() {
  // Tool card clicks
  if (dom.realityCheckCard) {
    dom.realityCheckCard.addEventListener('click', () => openToolModal(dom.realityModal));
  }
  
  if (dom.groundingCard) {
    dom.groundingCard.addEventListener('click', () => {
      openToolModal(dom.groundingModal);
      renderGroundingTechniques();
    });
  }
  
  if (dom.cbtCard) {
    dom.cbtCard.addEventListener('click', () => {
      openToolModal(dom.cbtModal);
      renderCBTContent();
    });
  }
  
  if (dom.moodCard) {
    dom.moodCard.addEventListener('click', () => {
      UIUtils.showNotification('Mood tracker coming soon!', 'info');
    });
  }
  
  // Reality check form
  if (dom.realityForm) {
    dom.realityForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const text = dom.realityScenario.value.trim();
      if (!text) return;

      try {
        // Use agent's reality check tool
        const result = await agent.executeRealityCheck(text);
        
        dom.realityResult.innerHTML = `
          <h4>Observation</h4>
          <p>${result.checklist.intro}</p>
          <h4>Reality Testing Steps</h4>
          <ol>${result.checklist.steps.map(step => `<li>${step}</li>`).join('')}</ol>
          <div class="intensity-check" style="margin-top: 1rem; padding: 1rem; background: var(--surface-elevated); border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
            <strong>Intensity Check:</strong> Rate the distress now (0-10), then again after grounding.
          </div>
        `;
        
        dom.realityScenario.value = '';
        
      } catch (error) {
        console.error('Reality check error:', error);
        dom.realityResult.innerHTML = `
          <p>Let's walk through what you notice with open curiosity.</p>
        `;
      }
    });
  }
  
  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      closeToolModal(btn.closest('.tool-modal'));
    });
  });
}

function openToolModal(modal) {
  if (modal) {
    modal.hidden = false;
    setTimeout(() => window.refreshIcons(), 50);
  }
}

function closeToolModal(modal) {
  if (modal) {
    modal.hidden = true;
  }
}

function renderGroundingTechniques() {
  if (!dom.groundingList || dom.groundingList.children.length > 0) return;
  
  UIUtils.renderCardList(
    mockData.grounding,
    dom.groundingList,
    item => `
      <h4>${item.title}</h4>
      <p>${item.detail}</p>
    `
  );
}

function renderCBTContent() {
  if (!dom.distortionsList || dom.distortionsList.children.length > 0) return;
  
  UIUtils.renderCardList(
    mockData.distortions,
    dom.distortionsList,
    item => `
      <h4>${item.name}</h4>
      <p style="color: var(--text-muted); font-size: 0.875rem; margin: 0.5rem 0;"><em>Example:</em> ${item.example}</p>
      <p style="margin: 0.5rem 0; padding-top: 0.5rem; border-top: 1px solid var(--border-light);"><strong>Try:</strong> ${item.reframe}</p>
    `
  );
  
  UIUtils.renderCardList(
    mockData.reframes,
    dom.reframesList,
    item => `
      <h4>${item.title}</h4>
      <ol style="margin: 0.5rem 0 0; padding-left: 1.5rem;">${item.steps.map(step => `<li style="margin: 0.25rem 0;">${step}</li>`).join('')}</ol>
    `
  );
}

// ============================================
// INSIGHTS
// ============================================
function setupInsights() {
  if (dom.moodSummary) {
    UIUtils.renderCardList(
      mockData.therapist.moodSummary,
      dom.moodSummary,
      item => `
        <h4 style="margin: 0 0 0.25rem; font-size: 1rem; font-weight: 600;">${item.label}</h4>
        <p class="metric-value" style="font-size: 1.5rem; color: var(--primary); margin: 0.25rem 0; font-weight: 700;"><strong>${item.value}</strong></p>
        <p class="metric-trend" style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">${item.trend}</p>
      `
    );
  }

  if (dom.highlightList) {
    UIUtils.renderCardList(
      mockData.therapist.highlights,
      dom.highlightList,
      item => `
        <h4>${item.title}</h4>
        <p>${item.detail}</p>
      `
    );
  }
}

// ============================================
// CRISIS BANNER
// ============================================
function setupCrisisBanner() {
  if (dom.crisisClose) {
    dom.crisisClose.addEventListener('click', () => {
      dom.crisisBanner.hidden = true;
    });
  }
}

function showCrisisBanner(resources) {
  if (dom.crisisBanner) {
    dom.crisisBanner.hidden = false;
  }
}

// ============================================
// LISTEN FOR STORAGE EVENTS
// ============================================
window.addEventListener('storage', (event) => {
  if (event.key?.startsWith('psycoach-journal')) {
    UIUtils.showNotification('Journal updated in another tab', 'info');
  }
});

// ============================================
// ICON REFRESH HELPER
// ============================================
window.refreshIcons = function() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
};

// ============================================
// INITIALIZE APP
// ============================================
init();

// Initialize icons after a brief delay
setTimeout(() => {
  window.refreshIcons();
}, 100);
