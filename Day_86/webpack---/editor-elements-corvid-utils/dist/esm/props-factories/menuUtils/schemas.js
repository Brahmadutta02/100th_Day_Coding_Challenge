export const menuItemSchema = {
    type: ['object'],
    properties: {
        link: {
            type: ['string', 'nil'],
        },
        label: {
            type: ['string', 'nil'],
            minLength: 1,
            maxLength: 40,
        },
        target: {
            type: ['string', 'nil'],
        },
        selected: {
            type: ['boolean', 'nil'],
        },
        menuItems: {
            type: ['array', 'nil'],
        },
    },
};
export const getMenuItemsSchema = (depth) => ({
    type: ['object'],
    properties: Object.assign({}, new Array(depth + 1).fill(null).reduce(acc => ({
        menuItems: {
            type: ['array', 'nil'],
            items: Object.assign(Object.assign({}, menuItemSchema), {
                properties: Object.assign(Object.assign({}, menuItemSchema.properties), acc)
            }),
        },
    }), {
        menuItems: menuItemSchema.properties.menuItems,
    })),
});
//# sourceMappingURL=schemas.js.map