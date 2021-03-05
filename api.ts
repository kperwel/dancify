import { AudioFeature } from "./lib/AudioFeaturesResponse";
import { Item } from "./lib/TracksByPlaylistResponse";

export interface FeaturedItem extends Item {
    features: AudioFeature;
}

export interface TracksByPlaylistWithFeaturesResponse {
    items: FeaturedItem[];
  }