class Watcher {
    constructor(Vue, key, cb) {
        this.vm = Vue;
        this.key = key;
        this.cb = cb;

        Dep.target = this;
        // 存储更新前的数据, 获取依赖
        this.oddVal = Vue[key];
        Dep.target = null;
    }

    update() {
        const value = this.vm[this.key];
        if (value === this.oddVal) return;
        this.cb(value);
    }
}
