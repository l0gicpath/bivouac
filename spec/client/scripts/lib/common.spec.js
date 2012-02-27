"use strict";
var requirejs = require('requirejs');

requirejs([__dirname + '/../../../../lib/client/scripts/lib/common.js'], function(common) {

  describe('urlParam', function() {

    it('finds the correct value of a given GET param', function() {
      global.window = {
        location: {
          href: 'http://www.example.com/foo.bar?question=unknown&answer=42'
        }
      };
      expect(common.urlParam('answer')).toEqual('42');
    });

  });

});