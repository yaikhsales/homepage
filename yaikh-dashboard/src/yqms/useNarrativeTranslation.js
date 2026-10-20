import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../translate/TranslationContext';

// Only report narrative fields are passed to this hook. Identifiers, names,
// measurements and record values remain unchanged in the saved record.
const cache = new Map();
const cacheKey = (language, note) => `${language}\0${note}`;
const batches = values => {
  const result = []; let current = [], length = 0;
  values.forEach(value => {
    if (current.length === 12 || length + value.length > 12000) {
      result.push(current); current = []; length = 0;
    }
    current.push(value); length += value.length;
  });
  if (current.length) result.push(current);
  return result;
};

export function useNarrativeTranslation(values, enabled = true) {
  const { language, t } = useTranslation();
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState('idle');
  const candidates = useMemo(() => [...new Set(values.filter(value => typeof value === 'string'
    && value.trim() && value.length <= 2000 && /\p{L}/u.test(value)))], [values]);
  const signature = JSON.stringify(candidates);
  useEffect(() => {
    if (!enabled || language === 'en' || !candidates.length) { setState('idle'); return; }
    const missing = candidates.filter(note => t(note) === note && !cache.has(cacheKey(language, note)));
    if (!missing.length) { setState('ready'); return; }
    let active = true;
    setState('loading');
    (async () => {
      try {
        for (const batch of batches(missing)) {
          const response = await fetch('/api/yqms/translate-notes', {
            method: 'POST', credentials: 'same-origin', cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, notes: batch }),
          });
          const data = await response.json();
          if (!response.ok || !data.ok || !Array.isArray(data.translations)
            || data.translations.length !== batch.length) throw new Error('Translation unavailable');
          if (!active) return;
          batch.forEach((note, index) => cache.set(cacheKey(language, note), data.translations[index]));
          setRevision(value => value + 1);
        }
        if (active) setState('ready');
      } catch { if (active) setState('unavailable'); }
    })();
    return () => { active = false; };
    // The signature represents exactly the visible narrative inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, enabled, signature]);
  const translated = value => {
    if (typeof value !== 'string' || language === 'en') return value;
    return cache.get(cacheKey(language, value)) || t(value);
  };
  const render = value => {
    const result = translated(value);
    if (!value || result === value) return value;
    return <span className="yqms-translated-note">{result}<small style={{ display: 'block', opacity: .7, marginTop: 3 }}>{t('Original')}: {value}</small></span>;
  };
  const csv = value => {
    const result = translated(value);
    return result !== value ? `${result} [${t('Original')}: ${value}]` : value;
  };
  void revision;
  return { translated, render, csv, state };
}
