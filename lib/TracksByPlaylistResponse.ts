export interface TracksByPlaylistResponse {
  items: Item[];
}

export interface Item {
  track: Track;
}

export interface Track {
  album: Album;
  id:    string;
  name:  string;
}

export interface Album {
  images: Image[];
}

export interface Image {
  height: number;
  url:    string;
  width:  number;
}
