const CAN_USE_DOM = typeof window !== "undefined";

export const IS_APPLE: boolean = CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
