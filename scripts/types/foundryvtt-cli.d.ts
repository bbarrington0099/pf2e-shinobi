/**
 * Minimal type shim for `@foundryvtt/foundryvtt-cli`, which is published
 * without TypeScript declarations.
 *
 * We declare just the surface the build/extract scripts actually call.
 * If you need more of the CLI's API, extend this declaration rather than
 * pulling in the whole tool as a typed dependency.
 */
declare module "@foundryvtt/foundryvtt-cli" {
  export interface CompilePackOptions {
    /** Whether to recurse into subdirectories. Defaults to `false`. */
    recursive?: boolean;
    /** Suppresses CLI progress logging when `false`. */
    log?: boolean;
    /** YAML/JSON detection override. */
    yaml?: boolean;
    /** Pretty-print output JSON when extracting. */
    transformEntry?: (entry: Record<string, unknown>) => unknown;
  }

  export interface ExtractPackOptions extends CompilePackOptions {
    /** Output file extension (`json` or `yml`). */
    expandOutput?: boolean;
  }

  /**
   * Compile a directory of JSON (or YAML) source files into a Foundry LevelDB
   * compendium pack.
   */
  export function compilePack(
    sourceDir: string,
    destDir: string,
    options?: CompilePackOptions,
  ): Promise<void>;

  /**
   * Reverse of `compilePack`: extract a Foundry LevelDB compendium pack into
   * JSON (or YAML) source files.
   */
  export function extractPack(
    sourceDir: string,
    destDir: string,
    options?: ExtractPackOptions,
  ): Promise<void>;
}
