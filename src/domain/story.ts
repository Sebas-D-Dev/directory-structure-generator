export const storyBeatMs = 3200;
export const storyBeatCount = 3;
export type StoryState = 'playing' | 'paused' | 'complete' | 'static';
export function nextStoryBeat(current: number): number {
  return Math.min(storyBeatCount, Math.max(0, current) + 1);
}
export function storyControlLabel(state: StoryState): string {
  return state === 'playing' ? 'Pause story' : state === 'paused' ? 'Resume story' : 'Replay story';
}

/** Points along the independently drawn checks → source schematic connector. */
export function storyConnectorPoints() {
  return Array.from({length:25}, (_, index) => {
    const t = index / 24, u = 1 - t;
    return {
      x: u ** 3 * 364 + 3 * u ** 2 * t * 364 + 3 * u * t ** 2 * 326 + t ** 3 * 278,
      y: u ** 3 * 100 + 3 * u ** 2 * t * 60 + 3 * u * t ** 2 * 52 + t ** 3 * 52,
      opacity: index === 0 || index === 24 ? 0 : 1,
      offset: t,
    };
  });
}
