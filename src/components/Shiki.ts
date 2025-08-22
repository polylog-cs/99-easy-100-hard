/**
 Copied & modified from https://github.com/pihedron/motion-canvas-hypermodern/.

 MIT License

 Copyright (c) 2025 pihedron

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import { CodeHighlighter, HighlightResult } from '@motion-canvas/2d';
import { DependencyContext, PromiseHandle } from '@motion-canvas/core';
import {
  BundledHighlighterOptions,
  BundledLanguage,
  BundledTheme,
  CodeToTokensOptions,
  createHighlighter,
  HighlighterGeneric,
  ThemedToken,
} from 'shiki';

type ShikiOptions = {
  // enforce one language or theme
  highlighter: Omit<
    BundledHighlighterOptions<BundledLanguage, BundledTheme>,
    'langs' | 'themes'
  > & {
    lang: BundledHighlighterOptions<BundledLanguage, BundledTheme>['langs'][number];
    theme: BundledHighlighterOptions<BundledLanguage, BundledTheme>['themes'][number];
  };
  codeToTokens?: CodeToTokensOptions<BundledLanguage, BundledTheme>;
};

// Extended token type with offset for highlighting
type TokenWithOffset = ThemedToken & { offset: number };

export class ShikiHighlighter implements CodeHighlighter<TokenWithOffset[]> {
  private shikiOptions: ShikiOptions;
  private handle: PromiseHandle<HighlighterGeneric<BundledLanguage, BundledTheme>>;

  constructor(shikiOptions: ShikiOptions) {
    this.shikiOptions = shikiOptions;
    this.handle = undefined;
  }

  initialize(): boolean {
    if (this.handle?.value !== undefined) {
      return true;
    } else {
      this.handle = DependencyContext.collectPromise(
        createHighlighter({
          ...this.shikiOptions.highlighter,
          langs: [this.shikiOptions.highlighter.lang],
          themes: [this.shikiOptions.highlighter.theme],
        }),
      );

      return false;
    }
  }

  prepare(code: string): TokenWithOffset[] {
    const result = this.handle.value.codeToTokens(code, this.codeToTokensOptions());

    // Flatten tokens and calculate offsets
    const tokensWithOffsets: TokenWithOffset[] = [];
    let currentOffset = 0;

    result.tokens.forEach((line, lineIndex) => {
      line.forEach((token) => {
        tokensWithOffsets.push({
          ...token,
          offset: currentOffset,
        });
        currentOffset += token.content.length;
      });

      // Add newline offset between lines (except after the last line if code doesn't end with newline)
      if (lineIndex < result.tokens.length - 1 || code.endsWith('\n')) {
        // Note: the newline itself isn't a token, but we need to account for its offset
        currentOffset += 1;
      }
    });

    return tokensWithOffsets;
  }

  highlight(index: number, cache: TokenWithOffset[]): HighlightResult {
    // Find the token that contains the character at the given index
    const token = cache.find(
      (token) => index >= token.offset && index < token.offset + token.content.length,
    );

    if (token) {
      return {
        color: token.color,
        skipAhead: token.offset + token.content.length - index,
      };
    } else {
      // Handle newlines and gaps between tokens
      return {
        color: null,
        skipAhead: 1,
      };
    }
  }

  tokenize(code: string): string[] {
    const result = this.handle.value.codeToTokens(code, this.codeToTokensOptions());

    // Reconstruct tokens array preserving original structure
    const tokens: string[] = [];

    result.tokens.forEach((line, lineIndex) => {
      // Add all tokens from this line
      line.forEach((token) => {
        tokens.push(token.content);
      });

      // Add newline between lines, except after the last line if the code doesn't end with a newline
      if (lineIndex < result.tokens.length - 1) {
        tokens.push('\n');
      } else if (code.endsWith('\n')) {
        tokens.push('\n');
      }
    });

    return tokens;
  }

  codeToTokensOptions() {
    return this.shikiOptions.codeToTokens !== undefined
      ? this.shikiOptions.codeToTokens
      : {
          lang: this.shikiOptions.highlighter.lang as BundledLanguage,
          theme: this.shikiOptions.highlighter.theme as BundledTheme, // Fixed: was incorrectly BundledLanguage
        };
  }
}
