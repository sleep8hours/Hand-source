class Dep {
    constructor() {
        this.watchers = [];
    }

    addWatcher(watcher) {
        if (watcher && watcher.update) this.watchers.push(watcher);
    }

    notify() {
        this.watchers.forEach(watcher => watcher.update());
    }
}
