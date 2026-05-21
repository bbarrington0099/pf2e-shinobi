/**
 * Minimal ambient declarations for the Foundry VTT globals this module touches.
 *
 * This intentionally avoids pulling in the community
 * `@league-of-foundry-developers/foundry-vtt-types` package; that dependency
 * tracks Foundry versions closely and would force coupling. Expand these
 * shims as the module surfaces more behavior.
 */
export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyObject = Record<string, any>;

  interface HooksStatic {
    on(event: string, fn: (...args: unknown[]) => unknown): number;
    once(event: string, fn: (...args: unknown[]) => unknown): number;
    off(event: string, id: number): void;
    callAll(event: string, ...args: unknown[]): boolean;
  }

  interface GameSettingsRegisterOptions {
    name?: string;
    hint?: string;
    scope: "world" | "client";
    config: boolean;
    type: typeof String | typeof Number | typeof Boolean | typeof Object;
    default: unknown;
    choices?: Record<string, string>;
    requiresReload?: boolean;
    onChange?: (value: unknown) => void;
  }

  interface GameSettings {
    register(module: string, key: string, options: GameSettingsRegisterOptions): void;
    get(module: string, key: string): unknown;
    set(module: string, key: string, value: unknown): Promise<unknown>;
  }

  interface I18n {
    localize(key: string): string;
    format(key: string, data?: Record<string, unknown>): string;
  }

  interface Game {
    settings: GameSettings;
    i18n: I18n;
    modules: Map<string, { id: string; active: boolean; api?: unknown }>;
    system: { id: string; version: string };
  }

  // eslint-disable-next-line no-var
  var Hooks: HooksStatic;
  // eslint-disable-next-line no-var
  var game: Game;
  // eslint-disable-next-line no-var
  var CONFIG: AnyObject;
  // eslint-disable-next-line no-var
  var ui: AnyObject;
}
