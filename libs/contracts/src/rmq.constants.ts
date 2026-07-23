export const AUTH_SERVICE = 'AUTH_SERVICE';
export const PRODUCT_SERVICE = 'PRODUCT_SERVICE';
export const ORDER_SERVICE = 'ORDER_SERVICE';
export const PAYMENT_SERVICE = 'PAYMENT_SERVICE';
export const NOTIFICATION_SERVICE = 'NOTIFICATION_SERVICE';

export const RMQ_SERVICE = {
    AUTH_SERVICE: {
        QUEUE: 'auth_queue',
    },
    PRODUCT_SERVICE: {
        QUEUE: 'product_queue',
    },
    ORDER_SERVICE: {
        QUEUE: 'order_queue',
    },
    PAYMENT_SERVICE: {
        QUEUE: 'payment_queue',
    },
    NOTIFICATION_SERVICE: {
        QUEUE: 'notification_queue',
    },
};

export const MESSAGE_PATTERN = {
    AUTH_SERVICE: {
        LOGIN: 'auth.login',
        VERIFY_TOKEN: 'auth.verifyToken',
        USER: {
            CREATE: 'auth.user.create',
            GET_ALL: 'auth.user.getAll',
            SELECT_OPTIONS: 'auth.user.selectOptions',
            GET_BY_USERNAME: 'auth.user.getByUsername',
            GET_BY_ID: 'auth.user.getById',
            UPDATE: 'auth.user.update',
            DELETE: 'auth.user.delete',
        },
        ROLE: {
            CREATE: 'auth.role.create',
            GET_ALL: 'auth.role.getAll',
            SELECT_OPTIONS: 'auth.role.selectOptions',
            GET_BY_ID: 'auth.role.getById',
            UPDATE: 'auth.role.update',
            DELETE: 'auth.role.delete',
        },
        PERMISSION: {
            CREATE: 'auth.permission.create',
            GET_ALL: 'auth.permission.getAll',
            SELECT_OPTIONS: 'auth.permission.selectOptions',
            GET_BY_ID: 'auth.permission.getById',
            UPDATE: 'auth.permission.update',
            DELETE: 'auth.permission.delete',   
        },
    },
    PRODUCT_SERVICE: {
        CATEGORY: {
            CREATE: 'product.category.create',
            GET_ALL: 'product.category.getAll',
            SELECT_OPTIONS: 'product.category.selectOptions',
            GET_BY_ID: 'product.category.getById',
            UPDATE: 'product.category.update',
            DELETE: 'product.category.delete',
        },
        PRODUCT: {
            CREATE: 'product.create',
            GET_ALL: 'product.getAll',
            SELECT_OPTIONS: 'product.selectOptions',
            GET_BY_ID: 'product.getById',
            UPDATE: 'product.update',
            DELETE: 'product.delete',
        },
        STOCK: {
            CREATE: 'product.stock.create',
            GET_ALL: 'product.stock.getAll',
            SELECT_OPTIONS: 'product.stock.selectOptions',
            GET_BY_ID: 'product.stock.getById',
            UPDATE: 'product.stock.update',
            DELETE: 'product.stock.delete',
            STOCK_INCREASE: 'product.stock.increase',
        },
        STOCK_IN: {
            CREATE: 'product.stockIn.create',
            GET_ALL: 'product.stockIn.getAll',
            GET_BY_ID: 'product.stockIn.getById',
            UPDATE: 'product.stockIn.update',
            DELETE: 'product.stockIn.delete',
        },
        STOCK_ADJUSTMENT: {
            CREATE: 'product.stockAdjustment.create',
            GET_ALL: 'product.stockAdjustment.getAll',
            GET_BY_ID: 'product.stockAdjustment.getById',
            UPDATE: 'product.stockAdjustment.update',
            DELETE: 'product.stockAdjustment.delete',
        },
    },
    ORDER_SERVICE: {
        ORDER: {
            CREATE: 'order.create',
            GET_ALL: 'order.getAll',
            GET_BY_ID: 'order.getById',
            UPDATE: 'order.update',
            DELETE: 'order.delete',
        },
        CUSTOMER: {
            CREATE: 'order.customer.create',
            GET_ALL: 'order.customer.getAll',
            SELECT_OPTIONS: 'order.customer.selectOptions',
            GET_BY_ID: 'order.customer.getById',
            UPDATE: 'order.customer.update',
            DELETE: 'order.customer.delete',
        },
    },
    PAYMENT_SERVICE: {
        PAYMENT: {
            CREATE: 'payment.create',
            GET_ALL: 'payment.getAll',
            SELECT_OPTIONS: 'payment.selectOptions',
            GET_BY_ID: 'payment.getById',
            UPDATE: 'payment.update',
            DELETE: 'payment.delete',
        },
    },
    NOTIFICATION_SERVICE: {
        NOTIFICATION: {
            CREATE: 'notification.create',
            GET_ALL: 'notification.getAll',
            SELECT_OPTIONS: 'notification.selectOptions',
            GET_BY_ID: 'notification.getById',
            UPDATE: 'notification.update',
            DELETE: 'notification.delete',
        },
    },
};