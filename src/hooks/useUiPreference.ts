import { useEffect, useState } from 'react';

const UI_PREFS_PREFIX = 'uiPrefs.';
const UI_PREFS_VERSION_KEY = 'uiPrefsVersion';
const UI_PREFS_VERSION = '1';

let versionValidated = false;

const hasLocalStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const ensureUiPrefsVersion = () => {
  if (!hasLocalStorage() || versionValidated) return;
  versionValidated = true;

  try {
    const storedVersion = window.localStorage.getItem(UI_PREFS_VERSION_KEY);
    if (storedVersion === UI_PREFS_VERSION) return;

    const keysToRemove: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith(UI_PREFS_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
    window.localStorage.setItem(UI_PREFS_VERSION_KEY, UI_PREFS_VERSION);
  } catch {
    // Ignore storage failures and keep runtime defaults.
  }
};

export const useUiPreference = <T>(key: string, defaultValue: T) => {
  const storageKey = `${UI_PREFS_PREFIX}${key}`;

  const [value, setValue] = useState<T>(() => {
    if (!hasLocalStorage()) return defaultValue;
    ensureUiPrefsVersion();
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === null) return defaultValue;
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (!hasLocalStorage()) return;
    ensureUiPrefsVersion();
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Ignore storage failures and keep runtime behavior.
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
};
