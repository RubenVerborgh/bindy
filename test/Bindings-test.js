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

  describe('A Bindings object with one binding', function () {
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

  describe('A Bindings object with three bindings', function () {
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
});