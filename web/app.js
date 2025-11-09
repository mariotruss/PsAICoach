const dom = {
  tabs: document.querySelectorAll('.tab'),
  panels: document.querySelectorAll('.panel'),
  conversationForm: document.getElementById('conversation-form'),
  conversationInput: document.getElementById('conversation-input'),
  conversationLog: document.getElementById('conversation-log'),
  insightText: document.getElementById('insight-text'),
  journalPrompt: document.getElementById('journal-prompt'),
  journalSave: document.getElementById('journal-save'),
  journalResponse: document.getElementById('journal-response'),
  journalFeedback: document.getElementById('journal-feedback'),
  momentsList: document.getElementById('moments-list'),
  moodChart: document.getElementById('mood-chart'),
  distortionsList: document.getElementById('distortions-list'),
  reframesList: document.getElementById('reframes-list'),
  experimentsList: document.getElementById('experiments-list'),
  realityForm: document.getElementById('reality-form'),
  realityScenario: document.getElementById('reality-scenario'),
  realityResult: document.getElementById('reality-result'),
  groundingList: document.getElementById('grounding-list'),
  moodSummary: document.getElementById('mood-summary'),
  highlightList: document.getElementById('highlight-list'),
  alertsList: document.getElementById('alerts-list')
};

dom.tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    dom.tabs.forEach(btn => {
      const isActive = btn === tab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    dom.panels.forEach(panel => {
      panel.classList.toggle('active', panel.id === tab.dataset.target);
    });
  });
});

const timestamp = () => {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date());
};

const pushMessage = (text, sender) => {
  const li = document.createElement('li');
  li.className = `message ${sender}`;
  li.innerHTML = `<span>${text}</span><time>${timestamp()}</time>`;
  dom.conversationLog.appendChild(li);
  dom.conversationLog.scrollTop = dom.conversationLog.scrollHeight;
};

const detectCrisis = text => {
  return crisisPhrases.some(phrase => text.toLowerCase().includes(phrase));
};

const generateResponse = text => {
  if (detectCrisis(text)) {
    return {
      reply:
        "I'm so glad you told me. Your safety matters most. I'm contacting your support plan now — please reach out to your trusted person or call emergency services if you are in immediate danger.",
      insight: "Triggering the crisis plan can include deep breathing, contacting a support, or visiting the nearest emergency department."
    };
  }

  const tailored = supportiveResponses.find(item => item.matcher.test(text));

  const reply = tailored
    ? tailored.reply
    : "Thank you for sharing. What would feeling supported in this moment look like for you?";

  const insight = reflectivePrompts[Math.floor(Math.random() * reflectivePrompts.length)];

  return { reply, insight };
};

dom.conversationForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = dom.conversationInput.value.trim();
  if (!text) return;

  pushMessage(text, 'user');
  dom.conversationInput.value = '';

  const { reply, insight } = generateResponse(text);

  setTimeout(() => {
    pushMessage(reply, 'bot');
    dom.insightText.textContent = insight;
  }, 400);
});

const randomPrompt = () => {
  const index = Math.floor(Math.random() * mockData.prompts.length);
  return mockData.prompts[index];
};

dom.journalPrompt.textContent = randomPrompt();

dom.journalSave.addEventListener('click', () => {
  const response = dom.journalResponse.value.trim();
  if (!response) {
    dom.journalFeedback.textContent = 'Feel free to jot down even a sentence — every reflection counts.';
    return;
  }

  const stored = JSON.parse(localStorage.getItem('psycoach-journal') || '[]');
  stored.push({
    date: new Date().toISOString(),
    text: response
  });
  localStorage.setItem('psycoach-journal', JSON.stringify(stored));

  dom.journalResponse.value = '';
  dom.journalFeedback.textContent = 'Saved securely on your device.';
  setTimeout(() => (dom.journalFeedback.textContent = ''), 3000);
});

mockData.notableMoments.forEach(moment => {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${moment.title}:</strong> ${moment.detail}`;
  dom.momentsList.appendChild(li);
});

new Chart(dom.moodChart, {
  type: 'line',
  data: {
    labels: mockData.moodTrend.map(({ date }) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Mood (0-10)',
        data: mockData.moodTrend.map(({ score }) => score),
        tension: 0.4,
        borderColor: 'rgba(81, 104, 246, 1)',
        backgroundColor: 'rgba(81, 104, 246, 0.18)',
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 10
      }
    }
  }
});

const renderCardList = (items, container, formatter) => {
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = formatter(item);
    container.appendChild(li);
  });
};

renderCardList(
  mockData.distortions,
  dom.distortionsList,
  item => `<h4>${item.name}</h4><p>${item.example}</p><p><strong>Try:</strong> ${item.reframe}</p>`
);

renderCardList(
  mockData.reframes,
  dom.reframesList,
  item => `<h4>${item.title}</h4><ol>${item.steps.map(step => `<li>${step}</li>`).join('')}</ol>`
);

renderCardList(
  mockData.experiments,
  dom.experimentsList,
  item => `<h4>${item.title}</h4><p>${item.description}</p>`
);

renderCardList(
  mockData.grounding,
  dom.groundingList,
  item => `<h4>${item.title}</h4><p>${item.detail}</p>`
);

renderCardList(
  mockData.therapist.moodSummary,
  dom.moodSummary,
  item => `<h4>${item.label}</h4><p><strong>${item.value}</strong></p><p>${item.trend}</p>`
);

renderCardList(
  mockData.therapist.highlights,
  dom.highlightList,
  item => `<h4>${item.title}</h4><p>${item.detail}</p>`
);

renderCardList(
  mockData.therapist.alerts,
  dom.alertsList,
  item => `<h4>${item.title}</h4><p>${item.detail}</p>`
);

const evaluateScenario = text => {
  const match = realityChecks.find(item => item.matcher.test(text));
  const summary = match ? match.summary : "Let's walk through what you notice with open curiosity.";

  return {
    summary,
    checklist: [
      'Describe the evidence for and against what you noticed.',
      'Check with a trusted person if possible.',
      'Engage a grounding skill for two minutes and re-evaluate the intensity.',
      'Note the time of day, sleep quality, and medication adherence.'
    ]
  };
};

dom.realityForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = dom.realityScenario.value.trim();
  if (!text) return;

  const result = evaluateScenario(text);

  dom.realityResult.innerHTML = `
    <h4>Observation</h4>
    <p>${result.summary}</p>
    <h4>Reality Testing Steps</h4>
    <ol>${result.checklist.map(step => `<li>${step}</li>`).join('')}</ol>
    <p><strong>Intensity check:</strong> Rate the distress now and again after grounding.</p>
  `;

  dom.realityScenario.value = '';
});

if (!localStorage.getItem('psycoach-setup')) {
  pushMessage('Welcome back. What feels most present for you today?', 'bot');
  dom.insightText.textContent = randomPrompt();
  localStorage.setItem('psycoach-setup', 'true');
}

window.addEventListener('storage', event => {
  if (event.key === 'psycoach-journal') {
    dom.journalFeedback.textContent = 'Journal updated on another tab.';
  }
});
