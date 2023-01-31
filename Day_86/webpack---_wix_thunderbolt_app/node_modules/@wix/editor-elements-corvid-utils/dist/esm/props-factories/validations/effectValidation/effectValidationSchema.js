const duration = {
    type: ['number', 'nil'],
    minimum: 0,
    maximum: 4000
};
const delay = {
    type: ['number', 'nil'],
    minimum: 0,
    maximum: 8000
};
const direction = {
    type: ['string', 'nil'],
    enum: ['left', 'right', 'top', 'bottom'],
};
export const effectsValidationSchema = {
    arc: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction: {
                type: ['string', 'nil'],
                enum: ['left', 'right'],
            },
        },
    },
    bounce: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction: {
                type: ['string', 'nil'],
                enum: ['topLeft', 'topRight', 'bottomRight', 'bottomLeft', 'center'],
            },
            intensity: {
                type: ['string', 'nil'],
                enum: ['soft', 'medium', 'hard'],
            },
        },
    },
    puff: {
        type: ['object'],
        properties: {
            duration,
            delay,
        },
    },
    zoom: {
        type: ['object'],
        properties: {
            duration,
            delay,
        },
    },
    fade: {
        type: ['object'],
        properties: {
            duration,
            delay,
        },
    },
    flip: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction,
        },
    },
    float: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction,
        },
    },
    fly: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction,
        },
    },
    fold: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction,
        },
    },
    glide: {
        type: ['object'],
        properties: {
            duration,
            delay,
            angle: {
                type: ['number', 'nil'],
                minimum: 0,
                maximum: 360,
            },
            distance: {
                type: ['number', 'nil'],
                minimum: 0,
                maximum: 300,
            },
        },
    },
    roll: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction,
        },
    },
    slide: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction,
        },
    },
    spin: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction: {
                type: ['string', 'nil'],
                enum: ['cw', 'ccw'],
            },
            cycles: {
                type: ['number', 'nil'],
                minimum: 1,
                maximum: 15,
            },
        },
    },
    turn: {
        type: ['object'],
        properties: {
            duration,
            delay,
            direction: {
                type: ['string', 'nil'],
                enum: ['right', 'left'],
            },
        },
    },
};
//# sourceMappingURL=effectValidationSchema.js.map