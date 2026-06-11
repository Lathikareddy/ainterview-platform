// Lightweight frontend "real-time" store using BroadcastChannel with localStorage fallback
type Callback = (state: any) => void;

const CHANNEL = 'app-realtime-channel';

class RealtimeStore {
  bc: BroadcastChannel | null = null;
  listeners: Set<Callback> = new Set();
  stateKey = 'appRealtimeState';

  constructor() {
    try {
      // @ts-ignore
      this.bc = new BroadcastChannel(CHANNEL);
      this.bc.onmessage = (ev) => {
        this.emit(ev.data);
      };
    } catch (e) {
      this.bc = null;
      window.addEventListener('storage', (ev) => {
        if (ev.key === this.stateKey && ev.newValue) {
          try {
            const parsed = JSON.parse(ev.newValue);
            this.emit(parsed);
          } catch {}
        }
      });
    }
  }

  getState() {
    try {
      const raw = localStorage.getItem(this.stateKey) || '{}';
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }

  setState(partial: any) {
    const current = this.getState();
    const next = { ...current, ...partial };
    try {
      localStorage.setItem(this.stateKey, JSON.stringify(next));
    } catch {}

    // ── Mirror to per-user slot immediately ──────────────────────────
    // This ensures progress is saved even if the user closes the tab
    // without signing out. AuthContext.loginWithPassword will restore it.
    try {
      const profileRaw = localStorage.getItem('userProfile');
      if (profileRaw) {
        const profile = JSON.parse(profileRaw);
        if (profile?.id) {
          localStorage.setItem(`appRealtimeState_${profile.id}`, JSON.stringify(next));
        }
      }
    } catch {}

    if (this.bc) {
      this.bc.postMessage(next);
    } else {
      try {
        localStorage.setItem(this.stateKey, JSON.stringify(next));
      } catch {}
      try {
        localStorage.setItem(this.stateKey + '_ping', String(Date.now()));
      } catch {}
    }
    this.emit(next);
  }

  emit(state: any) {
    for (const cb of Array.from(this.listeners)) {
      try {
        cb(state);
      } catch (e) {}
    }
  }

  subscribe(cb: Callback) {
    this.listeners.add(cb);
    // emit current state immediately
    cb(this.getState());
    return () => this.listeners.delete(cb);
  }

  /**
   * Called by AuthContext after writing a user's saved progress into
   * 'appRealtimeState'. This pushes the new state out to all active
   * subscribers so the dashboard / analytics update without a page reload.
   */
  reloadFromStorage() {
    this.emit(this.getState());
  }
}

const store = new RealtimeStore();

export default store;
