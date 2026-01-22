// Secure Storage Module - Handles encrypted localStorage operations
export class SecureStorage {
  constructor(keyName = 'psycoach-key') {
    this.keyName = keyName;
    this.initKey();
  }

  async initKey() {
    let keyData = localStorage.getItem(this.keyName);
    
    if (!keyData) {
      // Generate new encryption key
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      
      const exported = await crypto.subtle.exportKey('jwk', key);
      localStorage.setItem(this.keyName, JSON.stringify(exported));
      this.key = key;
    } else {
      // Import existing key
      const keyJwk = JSON.parse(keyData);
      this.key = await crypto.subtle.importKey(
        'jwk',
        keyJwk,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    }
  }

  async encrypt(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      data
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(encryptedBase64) {
    try {
      // Convert from base64
      const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.key,
        data
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  async saveSecure(key, data) {
    const encrypted = await this.encrypt(JSON.stringify(data));
    localStorage.setItem(key, encrypted);
  }

  async loadSecure(key) {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    
    const decrypted = await this.decrypt(encrypted);
    if (!decrypted) return null;
    
    try {
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }
}

