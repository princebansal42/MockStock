const ORDER_STATUS = {
    OPEN: "OPEN",
    PARTIAL: "PARTIAL",
    COMPLETED: "COMPLETED",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
    EXPIRED: "EXPIRED",
};

const ACTION = {
    BUY: "BUY",
    SELL: "SELL",
};

const ORDER_TYPE = {
    MARKET: "MARKET",
    LIMIT: "LIMIT",
    STOP: "STOP",
    STOP_LIMIT: "STOP_LIMIT",
};

const ORDER_DURATION = {
    DAY: "DAY",
    GTC: "GTC",
    IOC: "IOC",
};

module.exports = {
    ORDER_STATUS,
    ACTION,
    ORDER_TYPE,
    ORDER_DURATION,
};
