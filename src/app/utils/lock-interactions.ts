export class LockInteractions {
    private timeoutId?: ReturnType<typeof setTimeout>
    private _isLocked = false

    get isLocked() {
        return this._isLocked
    }

    lock(ms?: number) {
        this._isLocked = true
        if (this.timeoutId) clearTimeout(this.timeoutId)
        if (ms) {
            this.timeoutId = setTimeout(() => {
                this._isLocked = false
                this.timeoutId = undefined
            }, ms);
        }
    }

    unlock(force: boolean = false) {
        if (this.timeoutId) {
            if (force) {
                clearTimeout(this.timeoutId)
                this._isLocked = false
                this.timeoutId = undefined
            }
        }
        else {
            this._isLocked = false
        }
    }
}