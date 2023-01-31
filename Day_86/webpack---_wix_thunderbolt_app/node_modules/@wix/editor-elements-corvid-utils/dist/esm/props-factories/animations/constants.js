export const sharedEffectDefaultOptions = {
    duration: 1200,
    delay: 0,
};
export const effectDefaultOptions = {
    arc: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    bounce: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'topLeft',
        intensity: 'medium'
    }),
    puff: Object.assign({}, sharedEffectDefaultOptions),
    zoom: Object.assign({}, sharedEffectDefaultOptions),
    fade: Object.assign({}, sharedEffectDefaultOptions),
    flip: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    float: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    fly: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    fold: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    glide: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        angle: 0,
        distance: 0
    }),
    roll: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    slide: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    spin: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'cw',
        cycles: 5
    }),
    turn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    ArcIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    ArcOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    BounceIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'topLeft',
        intensity: 'medium'
    }),
    BounceOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'topLeft',
        intensity: 'medium'
    }),
    ExpandIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    CollapseOut: Object.assign({}, sharedEffectDefaultOptions),
    Conceal: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    Reveal: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    FadeIn: Object.assign({}, sharedEffectDefaultOptions),
    FadeOut: Object.assign({}, sharedEffectDefaultOptions),
    FlipIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    FlipOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    FloatIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    FloatOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    FlyIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    FlyOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    FoldIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    FoldOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    GlideIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        angle: 0,
        distance: 150
    }),
    GlideOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        angle: 0,
        distance: 150
    }),
    DropIn: Object.assign({}, sharedEffectDefaultOptions),
    PopOut: Object.assign({}, sharedEffectDefaultOptions),
    SlideIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    SlideOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'left'
    }),
    SpinIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'cw',
        cycles: 2
    }),
    SpinOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'cw',
        cycles: 2
    }),
    TurnIn: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
    TurnOut: Object.assign(Object.assign({}, sharedEffectDefaultOptions), {
        direction: 'right'
    }),
};
export const EFFECTS = {
    HIDE: {
        suffix: 'out',
        deprecatedValues: [
            'ArcOut',
            'BounceOut',
            'CollapseOut',
            'Conceal',
            'FadeOut',
            'FlipOut',
            'FloatOut',
            'FlyOut',
            'FoldOut',
            'GlideOut',
            'PopOut',
            'SlideOut',
            'SpinOut',
            'TurnOut',
        ],
    },
    SHOW: {
        suffix: 'in',
        deprecatedValues: [
            'ArcIn',
            'BounceIn',
            'DropIn',
            'ExpandIn',
            'FadeIn',
            'FlipIn',
            'FloatIn',
            'FlyIn',
            'FoldIn',
            'GlideIn',
            'Reveal',
            'SlideIn',
            'SpinIn',
            'TurnIn',
        ],
    },
};
export const effectInfoLink = (propertyName) => `https://www.wix.com/corvid/reference/$w/hiddenmixin/${propertyName}`;
//# sourceMappingURL=constants.js.map