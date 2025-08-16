try {
  (() => {
    var a = __REACT__,
      {
        Children: se,
        Component: ie,
        Fragment: ue,
        Profiler: ce,
        PureComponent: pe,
        StrictMode: de,
        Suspense: me,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: _e,
        cloneElement: be,
        createContext: Se,
        createElement: ye,
        createFactory: Te,
        createRef: ke,
        forwardRef: Oe,
        isValidElement: ve,
        lazy: Ce,
        memo: fe,
        startTransition: Ie,
        unstable_act: Ee,
        useCallback: O,
        useContext: xe,
        useDebugValue: he,
        useDeferredValue: ge,
        useEffect: x,
        useId: Ae,
        useImperativeHandle: Re,
        useInsertionEffect: Le,
        useLayoutEffect: Be,
        useMemo: Pe,
        useReducer: Me,
        useRef: L,
        useState: B,
        useSyncExternalStore: Ne,
        useTransition: Ue,
        version: De,
      } = __REACT__;
    var We = __STORYBOOK_API__,
      {
        ActiveTabs: Fe,
        Consumer: Ge,
        ManagerContext: Ke,
        Provider: Ye,
        RequestResponseError: $e,
        addons: h,
        combineParameters: qe,
        controlOrMetaKey: ze,
        controlOrMetaSymbol: Ze,
        eventMatchesShortcut: Je,
        eventToShortcut: Qe,
        experimental_MockUniversalStore: Xe,
        experimental_UniversalStore: et,
        experimental_requestResponse: tt,
        experimental_useUniversalStore: ot,
        isMacLike: rt,
        isShortcutTaken: nt,
        keyToSymbol: at,
        merge: lt,
        mockChannel: st,
        optionOrAltSymbol: it,
        shortcutMatchesShortcut: ut,
        shortcutToHumanString: ct,
        types: P,
        useAddonState: pt,
        useArgTypes: dt,
        useArgs: mt,
        useChannel: _t,
        useGlobalTypes: M,
        useGlobals: g,
        useParameter: bt,
        useSharedState: St,
        useStoryPrepared: yt,
        useStorybookApi: N,
        useStorybookState: Tt,
      } = __STORYBOOK_API__;
    var ft = __STORYBOOK_COMPONENTS__,
      {
        A: It,
        ActionBar: Et,
        AddonPanel: xt,
        Badge: ht,
        Bar: gt,
        Blockquote: At,
        Button: Rt,
        ClipboardCode: Lt,
        Code: Bt,
        DL: Pt,
        Div: Mt,
        DocumentWrapper: Nt,
        EmptyTabContent: Ut,
        ErrorFormatter: Dt,
        FlexBar: Vt,
        Form: wt,
        H1: Ht,
        H2: jt,
        H3: Wt,
        H4: Ft,
        H5: Gt,
        H6: Kt,
        HR: Yt,
        IconButton: U,
        IconButtonSkeleton: $t,
        Icons: A,
        Img: qt,
        LI: zt,
        Link: Zt,
        ListItem: Jt,
        Loader: Qt,
        Modal: Xt,
        OL: eo,
        P: to,
        Placeholder: oo,
        Pre: ro,
        ProgressSpinner: no,
        ResetWrapper: ao,
        ScrollArea: lo,
        Separator: D,
        Spaced: so,
        Span: io,
        StorybookIcon: uo,
        StorybookLogo: co,
        Symbols: po,
        SyntaxHighlighter: mo,
        TT: _o,
        TabBar: bo,
        TabButton: So,
        TabWrapper: yo,
        Table: To,
        Tabs: ko,
        TabsState: Oo,
        TooltipLinkList: V,
        TooltipMessage: vo,
        TooltipNote: Co,
        UL: fo,
        WithTooltip: w,
        WithTooltipPure: Io,
        Zoom: Eo,
        codeCommon: xo,
        components: ho,
        createCopyToClipboardFunction: go,
        getStoryHref: Ao,
        icons: Ro,
        interleaveSeparators: Lo,
        nameSpaceClassNames: Bo,
        resetComponents: Po,
        withReset: Mo,
      } = __STORYBOOK_COMPONENTS__;
    var F = { type: 'item', value: '' },
      G = (o, t) => ({
        ...t,
        name: t.name || o,
        description: t.description || o,
        toolbar: {
          ...t.toolbar,
          items: t.toolbar.items.map(e => {
            let r = typeof e == 'string' ? { value: e, title: e } : e;
            return (
              r.type === 'reset' &&
                t.toolbar.icon &&
                ((r.icon = t.toolbar.icon), (r.hideIcon = !0)),
              { ...F, ...r }
            );
          }),
        },
      }),
      K = ['reset'],
      Y = o => o.filter(t => !K.includes(t.type)).map(t => t.value),
      b = 'addon-toolbars',
      $ = async (o, t, e) => {
        (e &&
          e.next &&
          (await o.setAddonShortcut(b, {
            label: e.next.label,
            defaultShortcut: e.next.keys,
            actionName: `${t}:next`,
            action: e.next.action,
          })),
          e &&
            e.previous &&
            (await o.setAddonShortcut(b, {
              label: e.previous.label,
              defaultShortcut: e.previous.keys,
              actionName: `${t}:previous`,
              action: e.previous.action,
            })),
          e &&
            e.reset &&
            (await o.setAddonShortcut(b, {
              label: e.reset.label,
              defaultShortcut: e.reset.keys,
              actionName: `${t}:reset`,
              action: e.reset.action,
            })));
      },
      q = o => t => {
        let {
            id: e,
            toolbar: { items: r, shortcuts: n },
          } = t,
          c = N(),
          [S, i] = g(),
          l = L([]),
          u = S[e],
          v = O(() => {
            i({ [e]: '' });
          }, [i]),
          C = O(() => {
            let s = l.current,
              d = s.indexOf(u),
              m = d === s.length - 1 ? 0 : d + 1,
              p = l.current[m];
            i({ [e]: p });
          }, [l, u, i]),
          f = O(() => {
            let s = l.current,
              d = s.indexOf(u),
              m = d > -1 ? d : 0,
              p = m === 0 ? s.length - 1 : m - 1,
              _ = l.current[p];
            i({ [e]: _ });
          }, [l, u, i]);
        return (
          x(() => {
            n &&
              $(c, e, {
                next: { ...n.next, action: C },
                previous: { ...n.previous, action: f },
                reset: { ...n.reset, action: v },
              });
          }, [c, e, n, C, f, v]),
          x(() => {
            l.current = Y(r);
          }, []),
          a.createElement(o, { cycleValues: l.current, ...t })
        );
      },
      H = ({ currentValue: o, items: t }) =>
        o != null && t.find(e => e.value === o && e.type !== 'reset'),
      z = ({ currentValue: o, items: t }) => {
        let e = H({ currentValue: o, items: t });
        if (e) return e.icon;
      },
      Z = ({ currentValue: o, items: t }) => {
        let e = H({ currentValue: o, items: t });
        if (e) return e.title;
      },
      J = ({
        active: o,
        disabled: t,
        title: e,
        icon: r,
        description: n,
        onClick: c,
      }) =>
        a.createElement(
          U,
          { active: o, title: n, disabled: t, onClick: t ? () => {} : c },
          r &&
            a.createElement(A, { icon: r, __suppressDeprecationWarning: !0 }),
          e ? `\xA0${e}` : null
        ),
      Q = ({
        right: o,
        title: t,
        value: e,
        icon: r,
        hideIcon: n,
        onClick: c,
        disabled: S,
        currentValue: i,
      }) => {
        let l =
            r &&
            a.createElement(A, {
              style: { opacity: 1 },
              icon: r,
              __suppressDeprecationWarning: !0,
            }),
          u = {
            id: e ?? '_reset',
            active: i === e,
            right: o,
            title: t,
            disabled: S,
            onClick: c,
          };
        return (r && !n && (u.icon = l), u);
      },
      X = q(
        ({
          id: o,
          name: t,
          description: e,
          toolbar: {
            icon: r,
            items: n,
            title: c,
            preventDynamicIcon: S,
            dynamicTitle: i,
          },
        }) => {
          let [l, u, v] = g(),
            [C, f] = B(!1),
            s = l[o],
            d = !!s,
            m = o in v,
            p = r,
            _ = c;
          (S || (p = z({ currentValue: s, items: n }) || p),
            i && (_ = Z({ currentValue: s, items: n }) || _),
            !_ && !p && console.warn(`Toolbar '${t}' has no title or icon`));
          let j = O(
            E => {
              u({ [o]: E });
            },
            [o, u]
          );
          return a.createElement(
            w,
            {
              placement: 'top',
              tooltip: ({ onHide: E }) => {
                let W = n
                  .filter(({ type: I }) => {
                    let R = !0;
                    return (I === 'reset' && !s && (R = !1), R);
                  })
                  .map(I =>
                    Q({
                      ...I,
                      currentValue: s,
                      disabled: m,
                      onClick: () => {
                        (j(I.value), E());
                      },
                    })
                  );
                return a.createElement(V, { links: W });
              },
              closeOnOutsideClick: !0,
              onVisibleChange: f,
            },
            a.createElement(J, {
              active: C || d,
              disabled: m,
              description: e || '',
              icon: p,
              title: _ || '',
            })
          );
        }
      ),
      ee = () => {
        let o = M(),
          t = Object.keys(o).filter(e => !!o[e].toolbar);
        return t.length
          ? a.createElement(
              a.Fragment,
              null,
              a.createElement(D, null),
              t.map(e => {
                let r = G(e, o[e]);
                return a.createElement(X, { key: e, id: e, ...r });
              })
            )
          : null;
      };
    h.register(b, () =>
      h.add(b, {
        title: b,
        type: P.TOOL,
        match: ({ tabId: o }) => !o,
        render: () => a.createElement(ee, null),
      })
    );
  })();
} catch (e) {
  console.error(
    '[Storybook] One of your manager-entries failed: ' + import.meta.url,
    e
  );
}
