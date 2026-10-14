export const storyBeatMs = 3200;
export const storyBeatCount = 3;
export type StoryState = 'playing' | 'paused' | 'complete' | 'static';
export function nextStoryBeat(current: number): number {
  return Math.min(storyBeatCount, Math.max(0, current) + 1);
}
export function storyControlLabel(state: StoryState): string {
  return state === 'playing' ? 'Pause story' : state === 'paused' ? 'Resume story' : 'Replay story';
}
