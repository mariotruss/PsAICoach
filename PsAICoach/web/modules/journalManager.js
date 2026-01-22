// Journal Manager Module
import { SecureStorage } from './secureStorage.js';

export class JournalManager {
  constructor() {
    this.storage = new SecureStorage('psycoach-journal-key');
    this.storageKey = 'psycoach-journal-encrypted';
    
    this.prompts = [
      "What is one moment today that brought you a sense of calm?",
      "Describe a challenge you faced today. How did you respond?",
      "Name three things you appreciate about yourself right now.",
      "What is a supportive message you wish you could hear today?",
      "What emotion is asking for attention today?",
      "What boundary did you set or wish you had set?",
      "Describe a small victory from today, no matter how small.",
      "What pattern are you noticing in your thoughts or feelings?",
      "What do you need to let go of today?",
      "Who or what made you feel supported recently?"
    ];
  }

  async init() {
    // Ensure encryption key is ready
    await this.storage.initKey();
  }

  getRandomPrompt() {
    return this.prompts[Math.floor(Math.random() * this.prompts.length)];
  }

  async saveEntry(text) {
    const entries = await this.loadEntries() || [];
    
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      text,
      mood: null // Could be extended to capture mood
    };
    
    entries.push(newEntry);
    await this.storage.saveSecure(this.storageKey, entries);
    
    return newEntry;
  }

  async loadEntries() {
    return await this.storage.loadSecure(this.storageKey);
  }

  async getRecentEntries(limit = 5) {
    const entries = await this.loadEntries();
    if (!entries) return [];
    
    return entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  async deleteEntry(id) {
    const entries = await this.loadEntries();
    if (!entries) return false;
    
    const filtered = entries.filter(entry => entry.id !== id);
    await this.storage.saveSecure(this.storageKey, filtered);
    
    return true;
  }

  async exportEntries() {
    const entries = await this.loadEntries();
    if (!entries || entries.length === 0) {
      return "No journal entries to export.";
    }
    
    let text = "# PsyCoach Journal Export\n\n";
    text += `Exported: ${new Date().toLocaleString()}\n\n`;
    text += "---\n\n";
    
    entries.forEach(entry => {
      const date = new Date(entry.date).toLocaleString();
      text += `## ${date}\n\n`;
      text += `${entry.text}\n\n`;
      text += "---\n\n";
    });
    
    return text;
  }
}

