export default {
  // oxfmt formats any file type it recognises; --no-error-on-unmatched-pattern
  // avoids failures on unsupported extensions (e.g. .md, .json).
  '*': 'oxfmt --no-error-on-unmatched-pattern',

  // Pass only staged files to oxlint. The OOM panic from oxlint 1.64.0 is fixed
  // in 1.65.0 — no longer needs the function form workaround.
  '**/*.{ts,tsx,js,jsx}': 'oxlint --fix',
};
