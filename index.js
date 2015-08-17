'use strict';

export default class Url {
  constructor(url = document.location.href) {
    if (url.constructor === Url) {
      return url;
    }

    this.link = document.createElement('a');
    this.link.href = url;
  };

  get href() {
    return this.link.href;
  };

  get protocol() {
    return this.link.protocol;
  };

  get host() {
    return this.link.host;
  };

  get hostname() {
    return this.link.hostname;
  };

  get port() {
    return this.link.port;
  };

  get pathname() {
    return this.link.pathname;
  };

  get search() {
    return this.link.search;
  };

  get hash() {
    return this.link.hash;
  };

  get origin() {
    let origin = [this.protocol, '//', this.hostname].join('');

    return this.port != null ? `${origin}:${this.port}` : origin;
  };

  get relative() {
    return [this.pathname, this.search, this.hash].join('');
  };

  get absolute() {
    return this.href;
  };

  get uniqueId() {
    return new Date().getTime().toString(36);
  };

  get isCrossOrigin() {
    return this.origin !== (new this.constructor()).origin;
  };

  /*
    adapted from:
    https://github.com/sindresorhus/query-string/blob/master/index.js
  */
  get params() {
    let str = this.search.trim().replace(/^(\?|#|&)/, '');

    if (str.length > 0) {
      return str.split('&').reduce(function(ret, param) {
        var parts = param.replace(/\+/g, ' ').split('='),
            key = parts[0],
            val = parts[1];

        key = decodeURIComponent(key);
        // missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        val = val === undefined ? null : decodeURIComponent(val);

        if (!ret.hasOwnProperty(key)) {
          ret[key] = val;
        } else if (Array.isArray(ret[key])) {
          ret[key].push(val);
        } else {
          ret[key] = [ret[key], val];
        }

        return ret;
      }, {});

    } else {
      return {};
    }
  };

  withParams(params) {
    return new this.constructor(this.parseParams(params));
  };

  withAntiCache() {
    let params = JSON.parse(JSON.stringify(this.params));

    params._ = this.uniqueId;

    return this.withParams(params);
  };

  withoutAntiCache() {
    let params = JSON.parse(JSON.stringify(this.params));

    delete params._;

    return this.withParams(params);
  };

  withoutSearch() {
    return new this.constructor(
      this.href.replace(this.search, '')
    );
  }

  withoutHash() {
    return new this.constructor(
      this.href.replace(this.hash, '').replace('#', '')
    );
  };

  withoutHashForIE10compatibility() {
    return this.withoutHash();
  };

  hasHash() {
    return this.hash.length > 0;
  };

  formatForXHR(cache = false) {
    return (cache ?
      this.withAntiCache() : this).withoutHashForIE10compatibility();
  };

  parseParams(params) {
    let qs = this.stringify(params),
        str = `${this.withoutSearch().withoutHash().href}?${qs}`;

    return this.hasHash() ? `${str}#${this.hash.replace('#', '')}` : str;
  };

  /*
    adapted from:
    https://github.com/sindresorhus/query-string/blob/master/index.js
  */
  stringify(params) {
    return Object.keys(params).sort().map(function(key) {
      var val = params[key];

      if (Array.isArray(val)) {
        return val.sort().map(function(val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
        }).join('&');
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&');
  };
}
