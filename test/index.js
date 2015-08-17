/*global test, suite, setup, teardown*/

'use strict';

import {assert} from 'chai';
import Url from '../index';

suite('Url', function() {
  setup(function(done) {
    this.link = 'http://subdomain.domain.com:8080/directory/file.html?param1=value1#hash';

    this.url = new Url(this.link);

    done();
  });

  teardown(function(done) {
    this.url = null;

    done();
  });

  test('should be an instance of Url', function(done) {
    assert.instanceOf(this.url, Url);
    assert.match(this.url.href, /domain\.com/);
    assert.match(this.url.protocol, /http/);
    assert.match(this.url.host, /domain/);
    assert.match(this.url.hostname, /domain/);
    assert.match(this.url.port, /8080/);
    assert.match(this.url.search, /param1/);
    assert.equal(this.url.origin, 'http://subdomain.domain.com:8080');
    assert.equal(this.url.relative, '/directory/file.html?param1=value1#hash');
    assert.equal(this.url.hash, '#hash');
    assert.equal(this.url.absolute, this.link);
    assert.isTrue(this.url.uniqueId.length > 5);
    assert.isTrue(this.url.isCrossOrigin);
    assert.isTrue(this.url.isCrossOrigin);
    assert.equal(this.url.params.param1, 'value1');

    done();
  });

  test('should not have search parameters', function(done) {
    assert.notMatch(this.url.withoutSearch().href, /\?/);

    done();
  });

  test('should not have an hash', function(done) {
    assert.notMatch(this.url.withoutHash().href, /#/);

    done();
  });

  test('should set params', function(done) {
    this.url = this.url.withParams({
      param2: 'value2'
    });

    assert.isUndefined(this.url.params.param1);
    assert.equal(this.url.params.param2, 'value2');

    done();
  })

  test('should create a anti-cache url', function(done) {
    assert.match(
      this.url.withAntiCache().href,
      /_/
    );

    assert.match(
      (new Url('http://domain.com')).withAntiCache().href,
      /\?_/
    );

    done();
  });

  test('should remove a anti-cache url', function(done) {
    assert.notMatch(
      (new Url('http://domain.com?_=cache')).withoutAntiCache().href,
      /_/
    );

    done();
  });

  test('should formatForXHR', function(done) {
    assert.equal(
      this.url.withoutHash().href,
      this.url.formatForXHR().href
    );

    assert.match(
      this.url.formatForXHR(true).href,
      /_=/
    );

    done();
  });
});
