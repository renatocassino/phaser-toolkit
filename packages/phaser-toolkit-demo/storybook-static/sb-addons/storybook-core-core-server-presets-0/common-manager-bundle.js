try {
  (() => {
    var h = __STORYBOOK_API__,
      {
        ActiveTabs: O,
        Consumer: T,
        ManagerContext: g,
        Provider: U,
        RequestResponseError: f,
        addons: a,
        combineParameters: v,
        controlOrMetaKey: A,
        controlOrMetaSymbol: j,
        eventMatchesShortcut: x,
        eventToShortcut: P,
        experimental_MockUniversalStore: M,
        experimental_UniversalStore: R,
        experimental_requestResponse: C,
        experimental_useUniversalStore: w,
        isMacLike: B,
        isShortcutTaken: E,
        keyToSymbol: I,
        merge: K,
        mockChannel: N,
        optionOrAltSymbol: G,
        shortcutMatchesShortcut: L,
        shortcutToHumanString: Y,
        types: q,
        useAddonState: D,
        useArgTypes: F,
        useArgs: H,
        useChannel: V,
        useGlobalTypes: z,
        useGlobals: J,
        useParameter: Q,
        useSharedState: W,
        useStoryPrepared: X,
        useStorybookApi: Z,
        useStorybookState: $,
      } = __STORYBOOK_API__;
    var i = (() => {
        let e;
        return (
          typeof window < 'u'
            ? (e = window)
            : typeof globalThis < 'u'
              ? (e = globalThis)
              : typeof window < 'u'
                ? (e = window)
                : typeof self < 'u'
                  ? (e = self)
                  : (e = {}),
          e
        );
      })(),
      u = 'tag-filters',
      m = 'static-filter';
    a.register(u, e => {
      let p = Object.entries(i.TAGS_OPTIONS ?? {}).reduce((o, s) => {
        let [t, d] = s;
        return (d.excludeFromSidebar && (o[t] = !0), o);
      }, {});
      e.experimental_setFilter(m, o => {
        let s = o.tags ?? [];
        return (
          (s.includes('dev') || o.type === 'docs') &&
          s.filter(t => p[t]).length === 0
        );
      });
    });
  })();
} catch (e) {
  console.error(
    '[Storybook] One of your manager-entries failed: ' + import.meta.url,
    e
  );
}
