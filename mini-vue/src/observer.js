class Observer {
    constructor(data) {
        this.walk(data);
    }

    walk(data) {
        if (!data || typeof data !== "object") return;
        Object.keys(data).forEach(d => {
            this.defineReactive(data, d, data[d]);
        });
    }

    defineReactive(obj, key, value) {
        const that = this;
        const dep = new Dep();
        this.walk(value);
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 6 收集依赖
                if (Dep.target) dep.addWatcher(Dep.target);
                return value;
            },
            set(v) {
                if (v === value) return;
                value = v;
                that.walk(v);
                // 7 触发依赖
                dep.notify();
            },
        });
    }
}
