import { clipUrl } from './clips';
import bioVersions from './speaker-bio-versions.json';

export interface SpeakerBio {
  transcript?: string;
  /** True only after manual/native-speaker verification. */
  transcriptVerified?: boolean;
  audioUrl?: string;
  audioLabel?: string;
}

/** English introductions from the recorded speaker bio session. */
export const speakerBios: Record<string, SpeakerBio> = {
  salim: {
    audioUrl: clipUrl('bios/salim.mp3'),
    audioLabel: 'Arabic introduction',
  },
  khalid: {
    audioUrl: clipUrl('bios/khalid.mp3'),
    audioLabel: 'Arabic introduction',
  },
  karim: {
    audioUrl: `/audio/bios/karim.mp3?v=${bioVersions.karim}`,
    audioLabel: 'English introduction',
  },
  omar: {
    audioUrl: `/audio/bios/omar.mp3?v=${bioVersions.omar}`,
    audioLabel: 'English introduction',
  },
  ali: {
    audioUrl: `/audio/bios/ali.mp3?v=${bioVersions.ali}`,
    audioLabel: 'English introduction',
  },
};
