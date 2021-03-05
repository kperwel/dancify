export interface AudioFeaturesResponse {
  audio_features: AudioFeature[];
}

export interface NumericAudioFeatures {
    danceability: number;
    energy: number;
    key: number;
    loudness: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    tempo: number;
    duration_ms: number;
    time_signature: number;
}

export interface AudioFeature extends NumericAudioFeatures {
  type: string;
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
}


