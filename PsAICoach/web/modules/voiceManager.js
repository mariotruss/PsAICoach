// Voice Manager - Handles speech recognition and synthesis
export class VoiceManager {
  constructor(config = {}) {
    this.onTranscript = config.onTranscript || (() => {});
    this.onError = config.onError || (() => {});
    this.onStart = config.onStart || (() => {});
    this.onEnd = config.onEnd || (() => {});
    
    // Speech Recognition
    this.recognition = null;
    this.isListening = false;
    this.initSpeechRecognition();
    
    // Speech Synthesis
    this.synthesis = window.speechSynthesis;
    this.isSpeaking = false;
    this.currentUtterance = null;
    
    // Voice settings
    this.voiceSettings = {
      rate: 0.95,
      pitch: 1.0,
      volume: 1.0,
      voice: null // Will be set to best available voice
    };
    
    this.loadVoiceSettings();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStart();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      this.onTranscript({
        final: finalTranscript,
        interim: interimTranscript,
        isFinal: finalTranscript.length > 0
      });
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      this.onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onEnd();
    };
  }

  startListening() {
    if (!this.recognition) {
      this.onError('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start listening:', error);
      this.onError(error.message);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  async speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (this.isSpeaking) {
        this.synthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply settings
      utterance.rate = options.rate || this.voiceSettings.rate;
      utterance.pitch = options.pitch || this.voiceSettings.pitch;
      utterance.volume = options.volume || this.voiceSettings.volume;
      
      // Select voice
      const voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a natural-sounding voice
        const preferredVoice = voices.find(v => 
          v.name.includes('Samantha') || 
          v.name.includes('Google UK English Female') ||
          v.name.includes('Natural') ||
          v.lang.startsWith('en')
        ) || voices[0];
        
        utterance.voice = options.voice || this.voiceSettings.voice || preferredVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentUtterance = utterance;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        reject(event.error);
      };

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  pauseSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  resumeSpeaking() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  getAvailableVoices() {
    return this.synthesis.getVoices().filter(voice => voice.lang.startsWith('en'));
  }

  setVoiceSettings(settings) {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
    localStorage.setItem('psycoach-voice-settings', JSON.stringify(this.voiceSettings));
  }

  loadVoiceSettings() {
    const saved = localStorage.getItem('psycoach-voice-settings');
    if (saved) {
      try {
        this.voiceSettings = { ...this.voiceSettings, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Failed to load voice settings:', error);
      }
    }
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition) && !!window.speechSynthesis;
  }

  getStatus() {
    return {
      supported: this.isSupported(),
      listening: this.isListening,
      speaking: this.isSpeaking
    };
  }
}

