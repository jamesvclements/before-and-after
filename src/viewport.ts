import { ViewportConfig, ViewportSize, ViewportPreset, VIEWPORT_PRESETS } from './types.js';

export function resolveViewport(config?: ViewportConfig): ViewportSize {
  if (!config) {
    return VIEWPORT_PRESETS.desktop;
  }
  if (typeof config === 'string') {
    return VIEWPORT_PRESETS[config as ViewportPreset];
  }
  return config;
}
