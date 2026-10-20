import React from 'react';
import LangFlags from '../components/LangFlags';
import './YqmsLanguageBar.css';

export default function YqmsLanguageBar() {
  return <div className="yqms-language-row" aria-label="YQMS module language">
    <strong>YQMS language</strong>
    <LangFlags />
  </div>;
}
