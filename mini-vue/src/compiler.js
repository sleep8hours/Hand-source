class Compiler {
    constructor(Vue) {
        this.vm = Vue;
        this.el = Vue.$el;
        // 1 主方法
        this.compiler(this.el);
    }

    compiler(el) {
        const nodes = el.childNodes;
        if (!nodes || !nodes.length) return;
        Array.from(nodes).forEach(node => {
            if (this.isTextNode(node)) {
                // 1 文本处理 - 插值表达式
                this.compilerText(node);
            } else if (this.isElementNode(node)) {
                // 2 元素处理 - 指令
                this.compilerElement(node);
            }

            // 3 处理node子节点
            this.compiler(node);
        });
    }

    compilerText(node) {
        const reg = /\{\{(.+?)\}\}/;
        const text = node.textContent;
        if (!reg.test(text)) return;
        const key = RegExp.$1.trim();
        node.textContent = text.replace(reg, this.vm[key]);
        new Watcher(this.vm, key, val => {
            node.textContent = text.replace(reg, val);
        });
    }

    compilerElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name;
            if (this.isDirective(attr.name)) {
                const name = attrName.slice(2),
                    value = attr.value;
                let event = undefined,
                    eventthings = undefined;
                const includeAt = attrName.startsWith("@");
                // 注册方法处理相应指令
                if (name.startsWith("on") || includeAt) {
                    if (attrName.includes(".")) {
                        // 这部分写法可以优化
                        const atReg = /^@(.+?)\./,
                            reg = /^on:(.+?)\./;
                        // 匹配事件名称
                        event = includeAt ? attrName.match(atReg)[1] : name.match(reg)[1];
                        // 匹配事件处理
                        eventthings = includeAt ? attrName.replace(atReg, "") : name.replace(reg, "");
                    } else if (includeAt) {
                        event = attrName.replace("@", "");
                    } else {
                        event = name.slice(3);
                    }
                    this.onUpdater(node, value, event, eventthings);
                } else {
                    this.update(node, value, name);
                }
            }
        });
    }

    update(node, value, attrName) {
        const func = this[`${attrName}Updater`];
        if (func && typeof func === "function") func.call(this, node, value, this.vm[value]);
    }

    // v-text
    textUpdater(node, key, value) {
        node.textContent = value;
        new Watcher(this.vm, key, val => {
            node.textContent = val;
        });
    }

    // v-model
    modelUpdater(node, key, value) {
        node.value = value;
        new Watcher(this.vm, key, val => {
            node.textContent = val;
        });
        // 双向绑定
        node.addEventListener("input", e => {
            this.vm[key] = e.target.value;
        });
    }

    // v-html
    htmlUpdater(node, key, value) {
        node.innerHTML = value;
        new Watcher(this.vm, key, val => {
            node.innerHTML = val;
        });
    }

    // v-on
    onUpdater(node, key, event, eventthings) {
        node.addEventListener([event], e => {
            if (eventthings === "stop") e.preventDefault();
            this.vm[key](e);
        });
    }

    isDirective = attr => attr.startsWith("v-") || attr.startsWith("@");
    isTextNode = node => node.nodeType === 3;
    isElementNode = node => node.nodeType === 1;
}
