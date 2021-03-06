var Bindings = require('../build/Release/bindy');
var expect = require('chai').expect;

describe('Bindings', function () {
  describe('The Bindings module', function () {

    it('is a function', function () {
      expect(Bindings).to.be.a('function');
    });

    it('has "Bindings" as name', function () {
      expect(Bindings).to.have.property('name', 'Bindings');
    });

    it('creates Bindings instances with new', function () {
      expect(new Bindings()).to.be.an.instanceof(Bindings);
    });

    it('creates Bindings instances without new', function () {
      expect(Bindings()).to.be.an.instanceof(Bindings);
    });
  });

  describe('An empty Bindings object', function () {
    var bindings = new Bindings();

    it('returns undefined when accessing a property', function () {
      expect(bindings.a).to.be.undefined;
    });

    it('returns false when checking if a property exists', function () {
      expect('a' in bindings).to.be.false;
    });

    it('returns true when deleting a property', function () {
      expect(delete bindings.a).to.be.true;
    });

    it('does not enumerate over any properties', function () {
      var properties = [];
      for (var binding in bindings)
        properties.push(binding);
      expect(properties).to.deep.equal([]);
    });

    it('allows setting a string as property value', function () {
      bindings.a = 'A';
      expect(bindings.a).to.equal('A');
    });

    it('allows setting a non-string as property value', function () {
      bindings.b = 1;
      expect(bindings.b).to.equal('1');
    });
  });

  describe('A Bindings object to which one binding has been added', function () {
    var bindings = new Bindings();
    bindings.a = 'A';

    it('returns the value when accessing the property', function () {
      expect(bindings.a).to.equal('A');
    });

    it('returns true when checking if the property exists', function () {
      expect('a' in bindings).to.be.true;
    });

    it('returns false when checking if another property exists', function () {
      expect('b' in bindings).to.be.false;
    });

    it('enumerates over the property', function () {
      var properties = [];
      for (var binding in bindings)
        properties.push(binding);
      expect(properties).to.deep.equal(['a']);
    });

    it('allows setting the property to a different value', function () {
      bindings.a = 'B';
      expect(bindings.a).to.equal('B');
    });

    it('allows to delete the property', function () {
      expect(delete bindings.a).to.be.true;
      expect(bindings.a).to.be.undefined;
    });

    it('allows to set the property after it has been deleted', function () {
      bindings.a = 'C';
      expect(bindings.a).to.equal('C');
    });
  });

  describe('A Bindings object to which three bindings have been added', function () {
    var bindings = new Bindings();
    bindings.a = 'A';
    bindings.b = 'B';
    bindings.c = 'C';

    it('returns the values when accessing the properties', function () {
      expect(bindings.a).to.equal('A');
      expect(bindings.b).to.equal('B');
      expect(bindings.c).to.equal('C');
    });

    it('returns true when checking if the properties exist', function () {
      expect('a' in bindings).to.be.true;
      expect('b' in bindings).to.be.true;
      expect('c' in bindings).to.be.true;
    });

    it('returns false when checking if another property exists', function () {
      expect('d' in bindings).to.be.false;
    });

    it('enumerates over the properties', function () {
      var properties = [];
      for (var binding in bindings)
        properties.push(binding);
      expect(properties).to.deep.equal(['a', 'b', 'c']);
    });

    it('allows setting the properties to different values', function () {
      bindings.a = 'D';
      bindings.b = 'E';
      bindings.c = 'F';
      expect(bindings.a).to.equal('D');
      expect(bindings.b).to.equal('E');
      expect(bindings.c).to.equal('F');
    });

    it('allows to delete the properties', function () {
      expect(delete bindings.a).to.be.true;
      expect(delete bindings.b).to.be.true;
      expect(delete bindings.c).to.be.true;
      expect(bindings.a).to.be.undefined;
      expect(bindings.b).to.be.undefined;
      expect(bindings.c).to.be.undefined;
    });

    it('allows to set the properties after they have been deleted', function () {
      bindings.a = 'G';
      bindings.b = 'H';
      bindings.c = 'I';
      expect(bindings.a).to.equal('G');
      expect(bindings.b).to.equal('H');
      expect(bindings.c).to.equal('I');
    });
  });

  describe('A Bindings object created with new and initialized with three properties', function () {
    var bindings = new Bindings({ a: 'A', b: 'B', c: 'C' });

    it('returns the values when accessing the properties', function () {
      expect(bindings.a).to.equal('A');
      expect(bindings.b).to.equal('B');
      expect(bindings.c).to.equal('C');
    });

    it('returns true when checking if the properties exist', function () {
      expect('a' in bindings).to.be.true;
      expect('b' in bindings).to.be.true;
      expect('c' in bindings).to.be.true;
    });

    it('returns false when checking if another property exists', function () {
      expect('d' in bindings).to.be.false;
    });

    it('enumerates over the properties', function () {
      var properties = [];
      for (var binding in bindings)
        properties.push(binding);
      expect(properties).to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('A Bindings object created without new and initialized with three properties', function () {
    var bindings = Bindings({ a: 'A', b: 'B', c: 'C' });

    it('returns the values when accessing the properties', function () {
      expect(bindings.a).to.equal('A');
      expect(bindings.b).to.equal('B');
      expect(bindings.c).to.equal('C');
    });

    it('returns true when checking if the properties exist', function () {
      expect('a' in bindings).to.be.true;
      expect('b' in bindings).to.be.true;
      expect('c' in bindings).to.be.true;
    });

    it('returns false when checking if another property exists', function () {
      expect('d' in bindings).to.be.false;
    });

    it('enumerates over the properties', function () {
      var properties = [];
      for (var binding in bindings)
        properties.push(binding);
      expect(properties).to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('A Bindings object initialized with another Bindings object', function () {
    var initializer = new Bindings({ a: 'A', b: 'B', c: 'C' });
    var bindings = new Bindings(initializer);

    it('returns the values when accessing the properties', function () {
      expect(bindings.a).to.equal('A');
      expect(bindings.b).to.equal('B');
      expect(bindings.c).to.equal('C');
    });

    it('returns true when checking if the properties exist', function () {
      expect('a' in bindings).to.be.true;
      expect('b' in bindings).to.be.true;
      expect('c' in bindings).to.be.true;
    });

    it('returns false when checking if another property exists', function () {
      expect('d' in bindings).to.be.false;
    });

    it('enumerates over the properties', function () {
      var properties = [];
      for (var binding in bindings)
        properties.push(binding);
      expect(properties).to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('Bindings.equals', function () {
    describe('without arguments', function () {
      it('throw an Error', function () {
        expect(function () { Bindings.equals(); })
        .to.throw(Error, 'equals requires two Object arguments.');
      });
    });

    describe('with one argument', function () {
      it('throw an Error', function () {
        expect(function () { Bindings.equals(new Bindings()); })
        .to.throw(Error, 'equals requires two Object arguments.');
      });
    });

    describe('with two arguments, one of which is not an object', function () {
      it('throw an Error', function () {
        expect(function () { Bindings.equals(new Bindings(), false); })
        .to.throw(Error, 'equals requires two Object arguments.');
      });
    });

    describe('with the first argument a non-Bindings object', function () {
      it('returns false', function () {
        expect(Bindings.equals({},
                               new Bindings()))
        .to.be.false;
      });
    });

    describe('with the second argument a non-Bindings object', function () {
      it('returns false', function () {
        expect(Bindings.equals(new Bindings(),
                               {}))
        .to.be.false;
      });
    });

    describe('with two empty bindings', function () {
      it('returns true', function () {
        expect(Bindings.equals(new Bindings(),
                               new Bindings()))
        .to.be.true;
      });
    });

    describe('with empty and a non-empty bindings', function () {
      it('returns false', function () {
        expect(Bindings.equals(new Bindings(),
                               new Bindings({ a: 'A' })))
        .to.be.false;
      });
    });

    describe('with identical bindings with one element', function () {
      it('returns true', function () {
        expect(Bindings.equals(new Bindings({ a: 'A' }),
                               new Bindings({ a: 'A' })))
        .to.be.true;
      });
    });

    describe('with non-identical bindings with one element', function () {
      it('returns false', function () {
        expect(Bindings.equals(new Bindings({ a: 'A' }),
                               new Bindings({ a: 'B' })))
        .to.be.false;
      });
    });

    describe('with identical bindings with two elements', function () {
      it('returns true', function () {
        expect(Bindings.equals(new Bindings({ a: 'A', b: 'B' }),
                               new Bindings({ a: 'A', b: 'B' })))
        .to.be.true;
      });
    });

    describe('with non-identical bindings with two elements', function () {
      it('returns false', function () {
        expect(Bindings.equals(new Bindings({ a: 'A', b: 'B' }),
                               new Bindings({ a: 'A', b: 'C' })))
        .to.be.false;
      });
    });
  });

  describe('Bindings.merge', function () {
    describe('without arguments', function () {
      it('returns an empty Bindings object', function () {
        var merged = Bindings.merge();
        expect(merged).to.be.an.instanceof(Bindings);
        expect(merged).to.deep.equal(new Bindings());
      });
    });

    describe('with an empty bindings object', function () {
      it('returns an empty Bindings object', function () {
        var merged = Bindings.merge(new Bindings());
        expect(merged).to.be.an.instanceof(Bindings);
        expect(merged).to.deep.equal(new Bindings());
      });
    });

    describe('with an empty array', function () {
      it('returns an empty Bindings object', function () {
        var merged = Bindings.merge([]);
        expect(merged).to.be.an.instanceof(Bindings);
        expect(merged).to.deep.equal(new Bindings());
      });
    });

    describe('with a single bindings object', function () {
      it('returns a copy of the bindings object', function () {
        var bindings = new Bindings({ a: 'A', b: 'B' });
        var merged = Bindings.merge(bindings);
        expect(merged).to.not.equal(bindings);
        expect(merged).to.deep.equal(bindings);
      });
    });

    describe('with an array of a single bindings object', function () {
      it('returns a copy of the bindings object', function () {
        var bindings = new Bindings([{ a: 'A', b: 'B' }]);
        var merged = Bindings.merge(bindings);
        expect(merged).to.not.equal(bindings);
        expect(merged).to.deep.equal(bindings);
      });
    });

    describe('with multiple bindings objects', function () {
      it('returns a merged bindings object', function () {
        var merged = Bindings.merge(
          new Bindings({ a: 'A', b: 'B' }),
          new Bindings({ b: 'C', c: 'C' })
        );
        expect(merged).to.deep.equal(new Bindings({ a: 'A', b: 'B', c: 'C' }));
      });
    });

    describe('with an array of a multiple bindings objects', function () {
      it('returns a merged bindings object', function () {
        var merged = Bindings.merge([
          new Bindings({ a: 'A', b: 'B' }),
          new Bindings({ b: 'C', c: 'C' }),
        ]);
        expect(merged).to.deep.equal(new Bindings({ a: 'A', b: 'B', c: 'C' }));
      });
    });
  });

  describe('Bindings.uniqueValues', function () {
    describe('without arguments', function () {
      it('returns an empty array', function () {
        expect(Bindings.uniqueValues()).to.deep.equal([]);
      });
    });

    describe('with a non-array value without key', function () {
      it('returns an empty array', function () {
        expect(Bindings.uniqueValues(null)).to.deep.equal([]);
      });
    });

    describe('with a non-array value with key', function () {
      it('returns an empty array', function () {
        expect(Bindings.uniqueValues(null, 'a')).to.deep.equal([]);
      });
    });

    describe('with an empty array without key', function () {
      it('returns an empty array', function () {
        expect(Bindings.uniqueValues([])).to.deep.equal([]);
      });
    });

    describe('with an empty array with key', function () {
      it('returns an empty array', function () {
        expect(Bindings.uniqueValues([], 'a')).to.deep.equal([]);
      });
    });

    describe('with a one-element array without key', function () {
      var bindingsArray = [
        new Bindings({ a: 'A' }),
      ];

      it('returns an empty array', function () {
        expect(Bindings.uniqueValues(bindingsArray)).to.deep.equal([]);
      });
    });

    describe('with a one-element array with matching key', function () {
      var bindingsArray = [
        new Bindings({ a: 'A' }),
      ];

      it('returns an array with the value', function () {
        expect(Bindings.uniqueValues(bindingsArray, 'a')).to.deep.equal(['A']);
      });
    });

    describe('with a one-element array with non-matching key', function () {
      var bindingsArray = [
        new Bindings({ a: 'A' }),
      ];

      it('returns an array with the value', function () {
        expect(Bindings.uniqueValues(bindingsArray, 'a')).to.deep.equal(['A']);
      });
    });

    describe('with a five-element array with matching key', function () {
      var bindingsArray = [
        new Bindings({ a: 'A1', b: 'B1' }),
        new Bindings({ a: 'A2', b: 'B2' }),
        new Bindings({ a: 'A1', b: 'B3' }),
        new Bindings({ a: 'A3', b: 'B4' }),
        new Bindings({ b: 'B5' }),
      ];

      it('returns an array with the unique values for that key', function () {
        expect(Bindings.uniqueValues(bindingsArray, 'a')).to.deep.equal(['A1', 'A2', 'A3']);
      });
    });

    describe('with a five-element array with non-matching key', function () {
      var bindingsArray = [
        new Bindings({ a: 'A1', b: 'B1' }),
        new Bindings({ a: 'A2', b: 'B2' }),
        new Bindings({ a: 'A1', b: 'B3' }),
        new Bindings({ a: 'A3', b: 'B4' }),
        new Bindings({ b: 'B5' }),
      ];

      it('returns an empty array', function () {
        expect(Bindings.uniqueValues(bindingsArray, 'c')).to.deep.equal([]);
      });
    });
  });
});
