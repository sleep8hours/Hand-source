class Vue {
    constructor(options) {
        // 存储当前传入参数
        this.$options = options;
        this.$data = options.data || {};
        this.$methods = options.methods || {};
        this.$el = typeof options.el === "string" ? document.querySelector(options.el) : options.el;
        // 2 将data中的数据挂载到当前实例并响应式
        this._proxyData(this.$data);
        // 5 method挂载到当前实例
        this._proxyMethods(this.$methods);
        // 3 响应式监听data数据
        new Observer(this.$data);
        // 4 处理指令 / 插值表达式
        new Compiler(this);
    }

    _proxyData(data) {
        Object.keys(data).forEach(d => {
            Object.defineProperty(this, d, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[d];
                },
                set(v) {
                    if (v === data[d]) return;
                    data[d] = v;
                },
            });
        });
    }

    _proxyMethods(methods) {
        Object.keys(methods).forEach(m => {
            this[m] = methods[m];
        });
    }
}
