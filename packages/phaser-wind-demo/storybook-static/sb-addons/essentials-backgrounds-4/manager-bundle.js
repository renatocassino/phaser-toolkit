try {
  (() => {
    var re = Object.create;
    var Y = Object.defineProperty;
    var ae = Object.getOwnPropertyDescriptor;
    var ie = Object.getOwnPropertyNames;
    var ce = Object.getPrototypeOf,
      se = Object.prototype.hasOwnProperty;
    var E = (e =>
      typeof require < 'u'
        ? require
        : typeof Proxy < 'u'
          ? new Proxy(e, {
              get: (o, c) => (typeof require < 'u' ? require : o)[c],
            })
          : e)(function (e) {
      if (typeof require < 'u') return require.apply(this, arguments);
      throw Error('Dynamic require of "' + e + '" is not supported');
    });
    var M = (e, o) => () => (e && (o = e((e = 0))), o);
    var le = (e, o) => () => (
      o || e((o = { exports: {} }).exports, o),
      o.exports
    );
    var ue = (e, o, c, r) => {
      if ((o && typeof o == 'object') || typeof o == 'function')
        for (let a of ie(o))
          !se.call(e, a) &&
            a !== c &&
            Y(e, a, {
              get: () => o[a],
              enumerable: !(r = ae(o, a)) || r.enumerable,
            });
      return e;
    };
    var Ie = (e, o, c) => (
      (c = e != null ? re(ce(e)) : {}),
      ue(
        o || !e || !e.__esModule
          ? Y(c, 'default', { value: e, enumerable: !0 })
          : c,
        e
      )
    );
    var m = M(() => {});
    var h = M(() => {});
    var f = M(() => {});
    var X = le((Q, j) => {
      m();
      h();
      f();
      (function (e) {
        if (typeof Q == 'object' && typeof j < 'u') j.exports = e();
        else if (typeof define == 'function' && define.amd) define([], e);
        else {
          var o;
          (typeof window < 'u' || typeof window < 'u'
            ? (o = window)
            : typeof self < 'u'
              ? (o = self)
              : (o = this),
            (o.memoizerific = e()));
        }
      })(function () {
        var e, o, c;
        return (function r(a, d, s) {
          function t(i, I) {
            if (!d[i]) {
              if (!a[i]) {
                var l = typeof E == 'function' && E;
                if (!I && l) return l(i, !0);
                if (n) return n(i, !0);
                var k = new Error("Cannot find module '" + i + "'");
                throw ((k.code = 'MODULE_NOT_FOUND'), k);
              }
              var p = (d[i] = { exports: {} });
              a[i][0].call(
                p.exports,
                function (b) {
                  var _ = a[i][1][b];
                  return t(_ || b);
                },
                p,
                p.exports,
                r,
                a,
                d,
                s
              );
            }
            return d[i].exports;
          }
          for (var n = typeof E == 'function' && E, u = 0; u < s.length; u++)
            t(s[u]);
          return t;
        })(
          {
            1: [
              function (r, a, d) {
                a.exports = function (s) {
                  if (typeof Map != 'function' || s) {
                    var t = r('./similar');
                    return new t();
                  } else return new Map();
                };
              },
              { './similar': 2 },
            ],
            2: [
              function (r, a, d) {
                function s() {
                  return (
                    (this.list = []),
                    (this.lastItem = void 0),
                    (this.size = 0),
                    this
                  );
                }
                ((s.prototype.get = function (t) {
                  var n;
                  if (this.lastItem && this.isEqual(this.lastItem.key, t))
                    return this.lastItem.val;
                  if (((n = this.indexOf(t)), n >= 0))
                    return ((this.lastItem = this.list[n]), this.list[n].val);
                }),
                  (s.prototype.set = function (t, n) {
                    var u;
                    return this.lastItem && this.isEqual(this.lastItem.key, t)
                      ? ((this.lastItem.val = n), this)
                      : ((u = this.indexOf(t)),
                        u >= 0
                          ? ((this.lastItem = this.list[u]),
                            (this.list[u].val = n),
                            this)
                          : ((this.lastItem = { key: t, val: n }),
                            this.list.push(this.lastItem),
                            this.size++,
                            this));
                  }),
                  (s.prototype.delete = function (t) {
                    var n;
                    if (
                      (this.lastItem &&
                        this.isEqual(this.lastItem.key, t) &&
                        (this.lastItem = void 0),
                      (n = this.indexOf(t)),
                      n >= 0)
                    )
                      return (this.size--, this.list.splice(n, 1)[0]);
                  }),
                  (s.prototype.has = function (t) {
                    var n;
                    return this.lastItem && this.isEqual(this.lastItem.key, t)
                      ? !0
                      : ((n = this.indexOf(t)),
                        n >= 0 ? ((this.lastItem = this.list[n]), !0) : !1);
                  }),
                  (s.prototype.forEach = function (t, n) {
                    var u;
                    for (u = 0; u < this.size; u++)
                      t.call(
                        n || this,
                        this.list[u].val,
                        this.list[u].key,
                        this
                      );
                  }),
                  (s.prototype.indexOf = function (t) {
                    var n;
                    for (n = 0; n < this.size; n++)
                      if (this.isEqual(this.list[n].key, t)) return n;
                    return -1;
                  }),
                  (s.prototype.isEqual = function (t, n) {
                    return t === n || (t !== t && n !== n);
                  }),
                  (a.exports = s));
              },
              {},
            ],
            3: [
              function (r, a, d) {
                var s = r('map-or-similar');
                a.exports = function (i) {
                  var I = new s(!1),
                    l = [];
                  return function (k) {
                    var p = function () {
                      var b = I,
                        _,
                        R,
                        T = arguments.length - 1,
                        x = Array(T + 1),
                        O = !0,
                        A;
                      if ((p.numArgs || p.numArgs === 0) && p.numArgs !== T + 1)
                        throw new Error(
                          'Memoizerific functions should always be called with the same number of arguments'
                        );
                      for (A = 0; A < T; A++) {
                        if (
                          ((x[A] = { cacheItem: b, arg: arguments[A] }),
                          b.has(arguments[A]))
                        ) {
                          b = b.get(arguments[A]);
                          continue;
                        }
                        ((O = !1),
                          (_ = new s(!1)),
                          b.set(arguments[A], _),
                          (b = _));
                      }
                      return (
                        O &&
                          (b.has(arguments[T])
                            ? (R = b.get(arguments[T]))
                            : (O = !1)),
                        O ||
                          ((R = k.apply(null, arguments)),
                          b.set(arguments[T], R)),
                        i > 0 &&
                          ((x[T] = { cacheItem: b, arg: arguments[T] }),
                          O ? t(l, x) : l.push(x),
                          l.length > i && n(l.shift())),
                        (p.wasMemoized = O),
                        (p.numArgs = T + 1),
                        R
                      );
                    };
                    return (
                      (p.limit = i),
                      (p.wasMemoized = !1),
                      (p.cache = I),
                      (p.lru = l),
                      p
                    );
                  };
                };
                function t(i, I) {
                  var l = i.length,
                    k = I.length,
                    p,
                    b,
                    _;
                  for (b = 0; b < l; b++) {
                    for (p = !0, _ = 0; _ < k; _++)
                      if (!u(i[b][_].arg, I[_].arg)) {
                        p = !1;
                        break;
                      }
                    if (p) break;
                  }
                  i.push(i.splice(b, 1)[0]);
                }
                function n(i) {
                  var I = i.length,
                    l = i[I - 1],
                    k,
                    p;
                  for (
                    l.cacheItem.delete(l.arg), p = I - 2;
                    p >= 0 &&
                    ((l = i[p]), (k = l.cacheItem.get(l.arg)), !k || !k.size);
                    p--
                  )
                    l.cacheItem.delete(l.arg);
                }
                function u(i, I) {
                  return i === I || (i !== i && I !== I);
                }
              },
              { 'map-or-similar': 1 },
            ],
          },
          {},
          [3]
        )(3);
      });
    });
    m();
    h();
    f();
    m();
    h();
    f();
    m();
    h();
    f();
    m();
    h();
    f();
    var g = __REACT__,
      {
        Children: Ee,
        Component: Be,
        Fragment: D,
        Profiler: we,
        PureComponent: Re,
        StrictMode: xe,
        Suspense: Le,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Pe,
        cloneElement: Me,
        createContext: De,
        createElement: Ue,
        createFactory: Ge,
        createRef: Ne,
        forwardRef: Fe,
        isValidElement: He,
        lazy: qe,
        memo: B,
        startTransition: ze,
        unstable_act: Ke,
        useCallback: U,
        useContext: je,
        useDebugValue: Ve,
        useDeferredValue: Ye,
        useEffect: We,
        useId: $e,
        useImperativeHandle: Ze,
        useInsertionEffect: Je,
        useLayoutEffect: Qe,
        useMemo: W,
        useReducer: Xe,
        useRef: eo,
        useState: G,
        useSyncExternalStore: oo,
        useTransition: no,
        version: to,
      } = __REACT__;
    m();
    h();
    f();
    var so = __STORYBOOK_API__,
      {
        ActiveTabs: lo,
        Consumer: uo,
        ManagerContext: Io,
        Provider: po,
        RequestResponseError: mo,
        addons: N,
        combineParameters: ho,
        controlOrMetaKey: fo,
        controlOrMetaSymbol: go,
        eventMatchesShortcut: bo,
        eventToShortcut: ko,
        experimental_MockUniversalStore: _o,
        experimental_UniversalStore: yo,
        experimental_requestResponse: So,
        experimental_useUniversalStore: Co,
        isMacLike: vo,
        isShortcutTaken: To,
        keyToSymbol: Ao,
        merge: Oo,
        mockChannel: Eo,
        optionOrAltSymbol: Bo,
        shortcutMatchesShortcut: wo,
        shortcutToHumanString: Ro,
        types: $,
        useAddonState: xo,
        useArgTypes: Lo,
        useArgs: Po,
        useChannel: Mo,
        useGlobalTypes: Do,
        useGlobals: L,
        useParameter: P,
        useSharedState: Uo,
        useStoryPrepared: Go,
        useStorybookApi: No,
        useStorybookState: Fo,
      } = __STORYBOOK_API__;
    m();
    h();
    f();
    var jo = __STORYBOOK_COMPONENTS__,
      {
        A: Vo,
        ActionBar: Yo,
        AddonPanel: Wo,
        Badge: $o,
        Bar: Zo,
        Blockquote: Jo,
        Button: Qo,
        ClipboardCode: Xo,
        Code: en,
        DL: on,
        Div: nn,
        DocumentWrapper: tn,
        EmptyTabContent: rn,
        ErrorFormatter: an,
        FlexBar: cn,
        Form: sn,
        H1: ln,
        H2: un,
        H3: In,
        H4: dn,
        H5: pn,
        H6: mn,
        HR: hn,
        IconButton: w,
        IconButtonSkeleton: fn,
        Icons: gn,
        Img: bn,
        LI: kn,
        Link: _n,
        ListItem: yn,
        Loader: Sn,
        Modal: Cn,
        OL: vn,
        P: Tn,
        Placeholder: An,
        Pre: On,
        ProgressSpinner: En,
        ResetWrapper: Bn,
        ScrollArea: wn,
        Separator: Rn,
        Spaced: xn,
        Span: Ln,
        StorybookIcon: Pn,
        StorybookLogo: Mn,
        Symbols: Dn,
        SyntaxHighlighter: Un,
        TT: Gn,
        TabBar: Nn,
        TabButton: Fn,
        TabWrapper: Hn,
        Table: qn,
        Tabs: zn,
        TabsState: Kn,
        TooltipLinkList: F,
        TooltipMessage: jn,
        TooltipNote: Vn,
        UL: Yn,
        WithTooltip: H,
        WithTooltipPure: Wn,
        Zoom: $n,
        codeCommon: Zn,
        components: Jn,
        createCopyToClipboardFunction: Qn,
        getStoryHref: Xn,
        icons: et,
        interleaveSeparators: ot,
        nameSpaceClassNames: nt,
        resetComponents: tt,
        withReset: rt,
      } = __STORYBOOK_COMPONENTS__;
    m();
    h();
    f();
    var lt = __STORYBOOK_ICONS__,
      {
        AccessibilityAltIcon: ut,
        AccessibilityIcon: It,
        AccessibilityIgnoredIcon: dt,
        AddIcon: pt,
        AdminIcon: mt,
        AlertAltIcon: ht,
        AlertIcon: ft,
        AlignLeftIcon: gt,
        AlignRightIcon: bt,
        AppleIcon: kt,
        ArrowBottomLeftIcon: _t,
        ArrowBottomRightIcon: yt,
        ArrowDownIcon: St,
        ArrowLeftIcon: Ct,
        ArrowRightIcon: vt,
        ArrowSolidDownIcon: Tt,
        ArrowSolidLeftIcon: At,
        ArrowSolidRightIcon: Ot,
        ArrowSolidUpIcon: Et,
        ArrowTopLeftIcon: Bt,
        ArrowTopRightIcon: wt,
        ArrowUpIcon: Rt,
        AzureDevOpsIcon: xt,
        BackIcon: Lt,
        BasketIcon: Pt,
        BatchAcceptIcon: Mt,
        BatchDenyIcon: Dt,
        BeakerIcon: Ut,
        BellIcon: Gt,
        BitbucketIcon: Nt,
        BoldIcon: Ft,
        BookIcon: Ht,
        BookmarkHollowIcon: qt,
        BookmarkIcon: zt,
        BottomBarIcon: Kt,
        BottomBarToggleIcon: jt,
        BoxIcon: Vt,
        BranchIcon: Yt,
        BrowserIcon: Wt,
        ButtonIcon: $t,
        CPUIcon: Zt,
        CalendarIcon: Jt,
        CameraIcon: Qt,
        CameraStabilizeIcon: Xt,
        CategoryIcon: er,
        CertificateIcon: or,
        ChangedIcon: nr,
        ChatIcon: tr,
        CheckIcon: rr,
        ChevronDownIcon: ar,
        ChevronLeftIcon: ir,
        ChevronRightIcon: cr,
        ChevronSmallDownIcon: sr,
        ChevronSmallLeftIcon: lr,
        ChevronSmallRightIcon: ur,
        ChevronSmallUpIcon: Ir,
        ChevronUpIcon: dr,
        ChromaticIcon: pr,
        ChromeIcon: mr,
        CircleHollowIcon: hr,
        CircleIcon: Z,
        ClearIcon: fr,
        CloseAltIcon: gr,
        CloseIcon: br,
        CloudHollowIcon: kr,
        CloudIcon: _r,
        CogIcon: yr,
        CollapseIcon: Sr,
        CommandIcon: Cr,
        CommentAddIcon: vr,
        CommentIcon: Tr,
        CommentsIcon: Ar,
        CommitIcon: Or,
        CompassIcon: Er,
        ComponentDrivenIcon: Br,
        ComponentIcon: wr,
        ContrastIcon: Rr,
        ContrastIgnoredIcon: xr,
        ControlsIcon: Lr,
        CopyIcon: Pr,
        CreditIcon: Mr,
        CrossIcon: Dr,
        DashboardIcon: Ur,
        DatabaseIcon: Gr,
        DeleteIcon: Nr,
        DiamondIcon: Fr,
        DirectionIcon: Hr,
        DiscordIcon: qr,
        DocChartIcon: zr,
        DocListIcon: Kr,
        DocumentIcon: jr,
        DownloadIcon: Vr,
        DragIcon: Yr,
        EditIcon: Wr,
        EllipsisIcon: $r,
        EmailIcon: Zr,
        ExpandAltIcon: Jr,
        ExpandIcon: Qr,
        EyeCloseIcon: Xr,
        EyeIcon: ea,
        FaceHappyIcon: oa,
        FaceNeutralIcon: na,
        FaceSadIcon: ta,
        FacebookIcon: ra,
        FailedIcon: aa,
        FastForwardIcon: ia,
        FigmaIcon: ca,
        FilterIcon: sa,
        FlagIcon: la,
        FolderIcon: ua,
        FormIcon: Ia,
        GDriveIcon: da,
        GithubIcon: pa,
        GitlabIcon: ma,
        GlobeIcon: ha,
        GoogleIcon: fa,
        GraphBarIcon: ga,
        GraphLineIcon: ba,
        GraphqlIcon: ka,
        GridAltIcon: _a,
        GridIcon: q,
        GrowIcon: ya,
        HeartHollowIcon: Sa,
        HeartIcon: Ca,
        HomeIcon: va,
        HourglassIcon: Ta,
        InfoIcon: Aa,
        ItalicIcon: Oa,
        JumpToIcon: Ea,
        KeyIcon: Ba,
        LightningIcon: wa,
        LightningOffIcon: Ra,
        LinkBrokenIcon: xa,
        LinkIcon: La,
        LinkedinIcon: Pa,
        LinuxIcon: Ma,
        ListOrderedIcon: Da,
        ListUnorderedIcon: Ua,
        LocationIcon: Ga,
        LockIcon: Na,
        MarkdownIcon: Fa,
        MarkupIcon: Ha,
        MediumIcon: qa,
        MemoryIcon: za,
        MenuIcon: Ka,
        MergeIcon: ja,
        MirrorIcon: Va,
        MobileIcon: Ya,
        MoonIcon: Wa,
        NutIcon: $a,
        OutboxIcon: Za,
        OutlineIcon: Ja,
        PaintBrushIcon: Qa,
        PaperClipIcon: Xa,
        ParagraphIcon: ei,
        PassedIcon: oi,
        PhoneIcon: ni,
        PhotoDragIcon: ti,
        PhotoIcon: z,
        PhotoStabilizeIcon: ri,
        PinAltIcon: ai,
        PinIcon: ii,
        PlayAllHollowIcon: ci,
        PlayBackIcon: si,
        PlayHollowIcon: li,
        PlayIcon: ui,
        PlayNextIcon: Ii,
        PlusIcon: di,
        PointerDefaultIcon: pi,
        PointerHandIcon: mi,
        PowerIcon: hi,
        PrintIcon: fi,
        ProceedIcon: gi,
        ProfileIcon: bi,
        PullRequestIcon: ki,
        QuestionIcon: _i,
        RSSIcon: yi,
        RedirectIcon: Si,
        ReduxIcon: Ci,
        RefreshIcon: J,
        ReplyIcon: vi,
        RepoIcon: Ti,
        RequestChangeIcon: Ai,
        RewindIcon: Oi,
        RulerIcon: Ei,
        SaveIcon: Bi,
        SearchIcon: wi,
        ShareAltIcon: Ri,
        ShareIcon: xi,
        ShieldIcon: Li,
        SideBySideIcon: Pi,
        SidebarAltIcon: Mi,
        SidebarAltToggleIcon: Di,
        SidebarIcon: Ui,
        SidebarToggleIcon: Gi,
        SpeakerIcon: Ni,
        StackedIcon: Fi,
        StarHollowIcon: Hi,
        StarIcon: qi,
        StatusFailIcon: zi,
        StatusIcon: Ki,
        StatusPassIcon: ji,
        StatusWarnIcon: Vi,
        StickerIcon: Yi,
        StopAltHollowIcon: Wi,
        StopAltIcon: $i,
        StopIcon: Zi,
        StorybookIcon: Ji,
        StructureIcon: Qi,
        SubtractIcon: Xi,
        SunIcon: ec,
        SupportIcon: oc,
        SweepIcon: nc,
        SwitchAltIcon: tc,
        SyncIcon: rc,
        TabletIcon: ac,
        ThumbsUpIcon: ic,
        TimeIcon: cc,
        TimerIcon: sc,
        TransferIcon: lc,
        TrashIcon: uc,
        TwitterIcon: Ic,
        TypeIcon: dc,
        UbuntuIcon: pc,
        UndoIcon: mc,
        UnfoldIcon: hc,
        UnlockIcon: fc,
        UnpinIcon: gc,
        UploadIcon: bc,
        UserAddIcon: kc,
        UserAltIcon: _c,
        UserIcon: yc,
        UsersIcon: Sc,
        VSCodeIcon: Cc,
        VerifiedIcon: vc,
        VideoIcon: Tc,
        WandIcon: Ac,
        WatchIcon: Oc,
        WindowsIcon: Ec,
        WrenchIcon: Bc,
        XIcon: wc,
        YoutubeIcon: Rc,
        ZoomIcon: xc,
        ZoomOutIcon: Lc,
        ZoomResetIcon: Pc,
        iconList: Mc,
      } = __STORYBOOK_ICONS__;
    m();
    h();
    f();
    var Fc = __STORYBOOK_CLIENT_LOGGER__,
      {
        deprecate: Hc,
        logger: K,
        once: qc,
        pretty: zc,
      } = __STORYBOOK_CLIENT_LOGGER__;
    var V = Ie(X());
    m();
    h();
    f();
    var Qc = __STORYBOOK_THEMING__,
      {
        CacheProvider: Xc,
        ClassNames: es,
        Global: os,
        ThemeProvider: ns,
        background: ts,
        color: rs,
        convert: as,
        create: is,
        createCache: cs,
        createGlobal: ss,
        createReset: ls,
        css: us,
        darken: Is,
        ensure: ds,
        ignoreSsrWarning: ps,
        isPropValid: ms,
        jsx: hs,
        keyframes: fs,
        lighten: gs,
        styled: ee,
        themes: bs,
        typography: ks,
        useTheme: _s,
        withTheme: ys,
      } = __STORYBOOK_THEMING__;
    m();
    h();
    f();
    function oe(e) {
      for (var o = [], c = 1; c < arguments.length; c++)
        o[c - 1] = arguments[c];
      var r = Array.from(typeof e == 'string' ? [e] : e);
      r[r.length - 1] = r[r.length - 1].replace(/\r?\n([\t ]*)$/, '');
      var a = r.reduce(function (t, n) {
        var u = n.match(/\n([\t ]+|(?!\s).)/g);
        return u
          ? t.concat(
              u.map(function (i) {
                var I, l;
                return (l =
                  (I = i.match(/[\t ]/g)) === null || I === void 0
                    ? void 0
                    : I.length) !== null && l !== void 0
                  ? l
                  : 0;
              })
            )
          : t;
      }, []);
      if (a.length) {
        var d = new RegExp(
          `
[	 ]{` +
            Math.min.apply(Math, a) +
            '}',
          'g'
        );
        r = r.map(function (t) {
          return t.replace(
            d,
            `
`
          );
        });
      }
      r[0] = r[0].replace(/^\r?\n/, '');
      var s = r[0];
      return (
        o.forEach(function (t, n) {
          var u = s.match(/(?:^|\n)( *)$/),
            i = u ? u[1] : '',
            I = t;
          (typeof t == 'string' &&
            t.includes(`
`) &&
            (I = String(t)
              .split(
                `
`
              )
              .map(function (l, k) {
                return k === 0 ? l : '' + i + l;
              }).join(`
`)),
            (s += I + r[n + 1]));
        }),
        s
      );
    }
    var ne = 'storybook/background',
      y = 'backgrounds',
      de = {
        light: { name: 'light', value: '#F8F8F8' },
        dark: { name: 'dark', value: '#333' },
      },
      pe = B(function () {
        let e = P(y),
          [o, c, r] = L(),
          [a, d] = G(!1),
          { options: s = de, disable: t = !0 } = e || {};
        if (t) return null;
        let n = o[y] || {},
          u = n.value,
          i = n.grid || !1,
          I = s[u],
          l = !!r?.[y],
          k = Object.keys(s).length;
        return g.createElement(me, {
          length: k,
          backgroundMap: s,
          item: I,
          updateGlobals: c,
          backgroundName: u,
          setIsTooltipVisible: d,
          isLocked: l,
          isGridActive: i,
          isTooltipVisible: a,
        });
      }),
      me = B(function (e) {
        let {
            item: o,
            length: c,
            updateGlobals: r,
            setIsTooltipVisible: a,
            backgroundMap: d,
            backgroundName: s,
            isLocked: t,
            isGridActive: n,
            isTooltipVisible: u,
          } = e,
          i = U(
            I => {
              r({ [y]: I });
            },
            [r]
          );
        return g.createElement(
          D,
          null,
          g.createElement(
            w,
            {
              key: 'grid',
              active: n,
              disabled: t,
              title: 'Apply a grid to the preview',
              onClick: () => i({ value: s, grid: !n }),
            },
            g.createElement(q, null)
          ),
          c > 0
            ? g.createElement(
                H,
                {
                  key: 'background',
                  placement: 'top',
                  closeOnOutsideClick: !0,
                  tooltip: ({ onHide: I }) =>
                    g.createElement(F, {
                      links: [
                        ...(o
                          ? [
                              {
                                id: 'reset',
                                title: 'Reset background',
                                icon: g.createElement(J, null),
                                onClick: () => {
                                  (i({ value: void 0, grid: n }), I());
                                },
                              },
                            ]
                          : []),
                        ...Object.entries(d).map(([l, k]) => ({
                          id: l,
                          title: k.name,
                          icon: g.createElement(Z, {
                            color: k?.value || 'grey',
                          }),
                          active: l === s,
                          onClick: () => {
                            (i({ value: l, grid: n }), I());
                          },
                        })),
                      ].flat(),
                    }),
                  onVisibleChange: a,
                },
                g.createElement(
                  w,
                  {
                    disabled: t,
                    key: 'background',
                    title: 'Change the background of the preview',
                    active: !!o || u,
                  },
                  g.createElement(z, null)
                )
              )
            : null
        );
      }),
      he = ee.span(
        ({ background: e }) => ({
          borderRadius: '1rem',
          display: 'block',
          height: '1rem',
          width: '1rem',
          background: e,
        }),
        ({ theme: e }) => ({ boxShadow: `${e.appBorderColor} 0 0 0 1px inset` })
      ),
      fe = (e, o = [], c) => {
        if (e === 'transparent') return 'transparent';
        if (o.find(a => a.value === e) || e) return e;
        let r = o.find(a => a.name === c);
        if (r) return r.value;
        if (c) {
          let a = o.map(d => d.name).join(', ');
          K.warn(oe`
        Backgrounds Addon: could not find the default color "${c}".
        These are the available colors for your story based on your configuration:
        ${a}.
      `);
        }
        return 'transparent';
      },
      te = (0, V.default)(1e3)((e, o, c, r, a, d) => ({
        id: e || o,
        title: o,
        onClick: () => {
          a({ selected: c, name: o });
        },
        value: c,
        right: r ? g.createElement(he, { background: c }) : void 0,
        active: d,
      })),
      ge = (0, V.default)(10)((e, o, c) => {
        let r = e.map(({ name: a, value: d }) =>
          te(null, a, d, !0, c, d === o)
        );
        return o !== 'transparent'
          ? [te('reset', 'Clear background', 'transparent', null, c, !1), ...r]
          : r;
      }),
      be = { default: null, disable: !0, values: [] },
      ke = B(function () {
        let e = P(y, be),
          [o, c] = G(!1),
          [r, a] = L(),
          d = r[y]?.value,
          s = W(() => fe(d, e.values, e.default), [e, d]);
        Array.isArray(e) &&
          K.warn(
            'Addon Backgrounds api has changed in Storybook 6.0. Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md'
          );
        let t = U(
          n => {
            a({ [y]: { ...r[y], value: n } });
          },
          [e, r, a]
        );
        return e.disable
          ? null
          : g.createElement(
              H,
              {
                placement: 'top',
                closeOnOutsideClick: !0,
                tooltip: ({ onHide: n }) =>
                  g.createElement(F, {
                    links: ge(e.values, s, ({ selected: u }) => {
                      (s !== u && t(u), n());
                    }),
                  }),
                onVisibleChange: c,
              },
              g.createElement(
                w,
                {
                  key: 'background',
                  title: 'Change the background of the preview',
                  active: s !== 'transparent' || o,
                },
                g.createElement(z, null)
              )
            );
      }),
      _e = B(function () {
        let [e, o] = L(),
          { grid: c } = P(y, { grid: { disable: !1 } });
        if (c?.disable) return null;
        let r = e[y]?.grid || !1;
        return g.createElement(
          w,
          {
            key: 'background',
            active: r,
            title: 'Apply a grid to the preview',
            onClick: () => o({ [y]: { ...e[y], grid: !r } }),
          },
          g.createElement(q, null)
        );
      });
    N.register(ne, () => {
      N.add(ne, {
        title: 'Backgrounds',
        type: $.TOOL,
        match: ({ viewMode: e, tabId: o }) =>
          !!(e && e.match(/^(story|docs)$/)) && !o,
        render: () =>
          FEATURES?.backgroundsStoryGlobals
            ? g.createElement(pe, null)
            : g.createElement(
                D,
                null,
                g.createElement(ke, null),
                g.createElement(_e, null)
              ),
      });
    });
  })();
} catch (e) {
  console.error(
    '[Storybook] One of your manager-entries failed: ' + import.meta.url,
    e
  );
}
