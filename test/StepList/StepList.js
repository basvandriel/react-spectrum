/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2019 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

import assert from 'assert';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {Step, StepList} from '../../src/StepList';

describe('StepList', () => {
  it('has correct defaults', () => {
    const tree = shallow(<StepList />);
    const innerTree = tree.dive().dive();
    assert.equal(tree.hasClass('spectrum-Steplist'), true);
    assert.equal(tree.hasClass('spectrum-Steplist--interactive'), true);
    assert.equal(innerTree.type(), 'div');
    assert.equal(innerTree.prop('role'), 'tablist');
    assert.equal(innerTree.prop('aria-multiselectable'), false);
  });

  it('should support size', () => {
    const tree = shallow(<StepList />);
    assert.equal(tree.hasClass('spectrum-Steplist--small'), false);

    tree.setProps({size: 'S'});
    assert.equal(tree.hasClass('spectrum-Steplist--small'), true);

    tree.setProps({size: 'L'});
    assert.equal(tree.hasClass('spectrum-Steplist--small'), false);
  });

  it('should support interaction', () => {
    const tree = shallow(<StepList />);
    assert.equal(tree.hasClass('spectrum-Steplist--interactive'), true);

    tree.setProps({interaction: 'off'});
    assert.equal(tree.hasClass('spectrum-Steplist--interactive'), false);
  });

  it('should pass the size property to the children', () => {
    // size="S"
    let tree = shallow(
      <StepList size="S">
        <div className="one">a</div>
        <div className="two">b</div>
      </StepList>
    );
    let innerTree = tree.shallow();
    let child = innerTree.find('.two');
    assert.equal(child.prop('size'), 'S');

    // size="L"
    tree = shallow(
      <StepList size="L">
        <div className="one">a</div>
        <div className="two">b</div>
      </StepList>
    );
    innerTree = tree.shallow();
    child = innerTree.find('.one');
    assert.equal(child.prop('size'), 'L');
  });

  it('should handle the complete prop for the children before selected', () => {
    const tree = shallow(
      <StepList selectedIndex={1}>
        <div className="one">a</div>
        <div className="two">b</div>
      </StepList>
    );
    const innerTree = tree.shallow();
    let child = innerTree.find('.one');
    assert.equal(child.prop('complete'), true);

    child = innerTree.find('.two');
    assert.equal(child.prop('complete'), false);
  });

  it('should disable the steps when not interactive', () => {
    const spy = sinon.spy();
    const tree = shallow(
      <StepList interaction="off" onChange={spy}>
        <div className="one">a</div>
        <div className="two">b</div>
      </StepList>
    );
    const innerTree = tree.shallow();
    const child = innerTree.find('.two');
    child.simulate('click');

    assert(!spy.called);
  });

  it('should support keyboardMode="manual', () => {
    const spy = sinon.spy();
    const keyDownSpy = sinon.spy();
    const tree = shallow(
      <StepList keyboardMode="manual" onChange={spy}>
        <Step className="one" onKeyDown={keyDownSpy}>a</Step>
        <Step className="two" onKeyDown={keyDownSpy}>b</Step>
      </StepList>
    );
    const innerTree = tree.shallow();
    innerTree.find('.two').simulate('keydown', {key: 'Enter', preventDefault: () => {}});
    assert(spy.calledWith(1));
    innerTree.find('.one').simulate('keydown', {key: ' ', preventDefault: () => {}});
    assert(spy.calledWith(0));
  });

  describe('Step', () => {
    it('has correct defaults', () => {
      const tree = shallow(<Step />);
      assert.equal(tree.hasClass('spectrum-Steplist-item'), true);
      assert.equal(tree.type(), 'div');
      assert.equal(tree.prop('role'), 'tab');
      assert.equal(tree.childAt(0).hasClass('spectrum-Steplist-label'), true);
      assert.equal(tree.childAt(1).hasClass('spectrum-Steplist-markerContainer'), true);
      assert.equal(tree.childAt(2).hasClass('spectrum-Steplist-segment'), true);
      tree.setProps({
        selected: true,
        complete: true
      });
      tree.update();
      assert.equal(tree.hasClass('is-selected'), true);
      assert.equal(tree.hasClass('is-complete'), true);
      assert.equal(tree.prop('aria-selected'), true);
      tree.setProps({
        selected: false,
        complete: false
      });
      assert.equal(tree.hasClass('is-selected'), false);
      assert.equal(tree.hasClass('is-complete'), false);
      assert.equal(tree.prop('aria-selected'), false);
    });
  });
});