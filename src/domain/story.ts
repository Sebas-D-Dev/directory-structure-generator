export const storyBeatMs = 3200;
export const storyBeatCount = 4;
export const storyCycleMs = storyBeatMs * storyBeatCount;
export type StoryState = 'playing' | 'paused' | 'static';
export function nextStoryBeat(current: number): number {
  return (Math.max(0, Math.floor(current)) + 1) % storyBeatCount;
}
export function storyControlLabel(state: StoryState): string {
  return state === 'playing' ? 'Pause story' : 'Resume story';
}

/** Advance to the current phase after a delayed callback, without replaying missed beats. */
export function advanceStoryClock(beat: number, remaining: number, elapsed: number) {
  const position = beat * storyBeatMs + storyBeatMs - remaining + Math.max(0, elapsed);
  return {beat:Math.floor(position / storyBeatMs) % storyBeatCount, remaining:storyBeatMs - position % storyBeatMs};
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
