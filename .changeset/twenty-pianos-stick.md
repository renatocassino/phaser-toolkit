---
'phaser-hooks': patch
---

withComputedState could emit duplicate updates when instantiated multiple times or when derived value did not change. Computed states are now memoized by key and only propagate changes when the computed value actually changes.
