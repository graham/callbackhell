var CBH = (function() {

    var Contract = function(start_cb, timeout) {
        if (timeout == undefined) {
            this.timeout = -1;
        } else {
            this.timeout = timeout;
        }

        this.timeout_ref = null;
        
        this.state = {};

        this.thens = [];
        this.afters = [];
        
        this.resolved = false;
        this.resolve_value = null;
        this.resolve_error = null;

        var _this = this;
        
        setTimeout( function() {
            try {
                start_cb(_this);
            } catch (e) {
                console.log(e);
                this.error(e);
            }
        }, 0);

        if (this.timeout > -1) {
            this.timeout_ref = setTimeout(function() {
                _this.error('timeout');
            }, this.timeout)
        }
    };

    Contract.prototype.resolve = function(data) {
        if (this.resolved == true) {
            // pass
        } else {
            if (this.timeout_ref != null) { clearTimeout(this.timeout_ref); }
            this.resolved = true;
            this.resolve_value = data;
            this.resolve_error = null;
            for(var i=0; i < this.thens.length; i++) {
                try {
                    this.thens[i](this, this.resolve_value, this.resolve_error);
                } catch (e) {
                    console.log(e);
                }
            }
            for(var i=0; i < this.afters.length; i++) {
                try {
                    this.afters[i](this, this.resolve_value, this.resolve_error);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    Contract.prototype.error = function(error) {
        if (this.resolved == true) {
            // pass
        } else {
            if (this.timeout_ref != null) { clearTimeout(this.timeout_ref); }
            this.resolved = true;
            this.resolve_value = null;
            this.resolve_error = error;
            for(var i=0; i < this.thens.length; i++) {
                try {
                    this.thens[i](this, this.resolve_value, this.resolve_error);
                } catch (e) {
                    console.log(e);
                }
            }
            for(var i=0; i < this.afters.length; i++) {
                try {
                    this.afters[i](this, this.resolve_value, this.resolve_error);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    Contract.prototype.then = function(cb) {
        if (this.resolved == true) {
            cb(this, this.resolve_value, this.resolve_error);
        } else {
            this.thens.push(cb);
        }
    };

    Contract.prototype.after = function(cb) {
        if (this.resolved == true) {
            cb(this, this.resolve_value, this.resolve_error);
        } else {
            this.afters.push(cb);
        }
    };

    return {"Contract":Contract};    
})();

module.exports.Contract = CBH.Contract;
