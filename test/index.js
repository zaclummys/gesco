const { Gesco } = require('../dist');

const chai = require('chai');
const spies = require('chai-spies');

const { expect } = chai;

chai.use(spies);

describe('Gesco', () => {
    it('get/set', () => {
        const gesco = new Gesco();

        expect(gesco.get('quux')).to.be.undefined;
        expect(gesco.get('foo.bar')).to.be.undefined;

        gesco.set('quux', true);
        gesco.set('foo', {
            bar: true
        });

        expect(gesco.get('quux')).to.be.true;
        expect(gesco.get('foo.bar')).to.be.true;
    });

    it('has/delete', () => {
        const gesco = new Gesco();
        
        expect(gesco.has('quux')).to.be.false;
        expect(gesco.has('foo.bar')).to.be.false;

        gesco.set('quux', true);
        gesco.set('foo', {
            bar: true
        });

        expect(gesco.has('quux')).to.be.true;
        expect(gesco.has('foo.bar')).to.be.true;

        gesco.delete('quux');
        gesco.delete('foo');

        expect(gesco.has('quux')).to.be.false;
        expect(gesco.has('foo.bar')).to.be.false;
    });


    it('observe', () => {
        const gesco = new Gesco();

        const observer = chai.spy();

        gesco.observe('foo', observer);
        expect(observer).to.not.have.been.called();

        gesco.set('foo', 'bar');
        expect(observer).to.have.been.called();
    });

    it('compute', () => {
        const gesco = new Gesco();

        const computer = chai.spy(input => input * 2);
        
        gesco.compute('output', 'input', computer);
        expect(computer).to.not.have.been.called();

        gesco.set('input', 2);        
        expect(computer).to.have.been.called();

        expect(gesco.get('output')).to.be.equal(4);
    });

    it('emit', () => {
        const gesco = new Gesco();
    
        const observer = chai.spy();
    
        gesco.observe('foo', observer);        
        expect(observer).to.not.have.been.called();

        gesco.emit('foo');
        expect(observer).to.have.been.called();
    });

    describe('link', () => {
        it('unidirectional', () => {
            const gesco = new Gesco();
    
            gesco.link('foo', 'bar');
    
            expect(gesco.get('foo')).to.be.undefined;
            expect(gesco.get('bar')).to.be.undefined;
    
            gesco.set('foo', 'bar');
            
            expect(gesco.get('foo')).to.be.equal('bar');
            expect(gesco.get('bar')).to.be.equal('bar');
    
            gesco.delete('foo');
    
            expect(gesco.get('foo')).to.be.undefined;
            expect(gesco.get('bar')).to.be.undefined;
                
            gesco.set('bar', 'foo');
    
            expect(gesco.get('foo')).to.be.undefined;
            expect(gesco.get('bar')).to.be.equal('foo');
        })

        it('bidirectional', () => {
            const gesco = new Gesco();
    
            gesco.link('foo', 'bar', true);
    
            expect(gesco.get('foo')).to.be.undefined;
            expect(gesco.get('bar')).to.be.undefined;
    
            gesco.set('foo', 'bar');
            
            expect(gesco.get('foo')).to.be.equal('bar');
            expect(gesco.get('bar')).to.be.equal('bar');
    
            gesco.delete('foo');
    
            expect(gesco.get('foo')).to.be.undefined;
            expect(gesco.get('bar')).to.be.undefined;

                
            gesco.set('bar', 'foo');
    
            expect(gesco.get('foo')).to.be.equal('foo');
            expect(gesco.get('bar')).to.be.equal('foo');

            gesco.delete('bar');
    
            expect(gesco.get('foo')).to.be.undefined;
            expect(gesco.get('bar')).to.be.undefined;
        })
    });

    describe('commit', () => {
        it('affected', () => {
            const gesco = new Gesco();
            const observer = chai.spy();
                
            gesco.observe('foo', observer);
            expect(observer).to.not.have.been.called();

            gesco.set('foo', 'bar');
            expect(observer).to.have.been.called();
        });

        it('existing', () => {
            const gesco = new Gesco();
            const observer = chai.spy();
                
            gesco.set('foo', 'bar');
            expect(observer).to.not.have.been.called();

            gesco.observe('foo', observer);
            expect(observer).to.have.been.called();
        });
    })

    describe('propagation', () => {
        it('desc', () => {
            const gesco = new Gesco;

            const fooBarQuuxObserver = chai.spy();
            const fooBarObserver = chai.spy();
            const foobserver = chai.spy();

            gesco.observe('foo.bar.quux', fooBarQuuxObserver);
            gesco.observe('foo.bar', fooBarObserver);
            gesco.observe('foo', foobserver);

            expect(fooBarQuuxObserver).to.not.have.been.called();
            expect(fooBarObserver).to.not.have.been.called();
            expect(foobserver).to.not.have.been.called();

            gesco.set('foo.bar.quux', true);

            expect(fooBarQuuxObserver).to.have.been.called();
            expect(fooBarObserver).to.not.have.been.called();
            expect(foobserver).to.not.have.been.called();
        });

        it('asc', () => {
            const gesco = new Gesco;

            const fooBarQuuxObserver = chai.spy();
            const fooBarObserver = chai.spy();
            const foobserver = chai.spy();

            gesco.observe('foo.bar.quux', fooBarQuuxObserver);
            gesco.observe('foo.bar', fooBarObserver);
            gesco.observe('foo', foobserver);

            expect(fooBarQuuxObserver).to.not.have.been.called();
            expect(fooBarObserver).to.not.have.been.called();
            expect(foobserver).to.not.have.been.called();

            gesco.set('foo', true);

            expect(fooBarQuuxObserver).to.have.been.called();
            expect(fooBarObserver).to.have.been.called();
            expect(foobserver).to.have.been.called();
        });
    });
});
