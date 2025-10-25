import React from "react";
import { EmotionResult } from "../services/api";
import "./EmotionDisplay.css";

interface EmotionDisplayProps {
  emotion: EmotionResult | null;
  isAnalyzing: boolean;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({
  emotion,
  isAnalyzing,
}) => {
  const getEmotionColor = (label: string): string => {
    switch (label.toLowerCase()) {
      case "positive":
        return "#4ade80"; // green
      case "negative":
        return "#f87171"; // red
      case "neutral":
        return "#94a3b8"; // gray
      default:
        return "#60a5fa"; // blue
    }
  };

  const getEmotionEmoji = (label: string): string => {
    switch (label.toLowerCase()) {
      case "positive":
        return "😊";
      case "negative":
        return "😔";
      case "neutral":
        return "😐";
      default:
        return "🤔";
    }
  };

  const formatScore = (score: number): string => {
    return `${(score * 100).toFixed(1)}%`;
  };

  if (isAnalyzing) {
    return (
      <div className="emotion-display analyzing">
        <div className="emotion-header">
          <span className="emotion-emoji">🤔</span>
          <span className="emotion-label">Analiz ediliyor...</span>
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!emotion) {
    return (
      <div className="emotion-display empty">
        <div className="emotion-header">
          <span className="emotion-emoji">💭</span>
          <span className="emotion-label">Mesaj gönder</span>
        </div>
        <p className="emotion-subtitle">duygu analizi görmek için</p>
      </div>
    );
  }

  return (
    <div className="emotion-display">
      <div className="emotion-header">
        <span className="emotion-emoji">{getEmotionEmoji(emotion.label)}</span>
        <span
          className="emotion-label"
          style={{ color: getEmotionColor(emotion.label) }}
        >
          {emotion.label}
        </span>
      </div>
      <div className="emotion-score">
        <div className="score-label">Güven</div>
        <div
          className="score-value"
          style={{ color: getEmotionColor(emotion.label) }}
        >
          {formatScore(emotion.score)}
        </div>
      </div>
      <div className="emotion-bar">
        <div
          className="emotion-bar-fill"
          style={{
            width: `${emotion.score * 100}%`,
            backgroundColor: getEmotionColor(emotion.label),
          }}
        ></div>
      </div>
    </div>
  );
};

export default EmotionDisplay;
