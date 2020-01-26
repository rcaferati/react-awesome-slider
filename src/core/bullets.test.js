import React from 'react';
import { shallow } from 'enzyme';
import Bullets from './bullets';

describe('Bullets Battery Tests', () => {
  describe('Composition', () => {
    it('Should render empty bullets', () => {
      const wrapper = shallow(<Bullets rootElement=".foo" />);
      expect(wrapper.find('button')).toHaveLength(0);
      expect(wrapper.find('nav').prop('className')).toEqual('.foo__bullets');
    });
    it('Should render bullets with for given media', () => {
      const media = [1, 2, 3, 4, 5];
      const wrapper = shallow(
        <Bullets onClick={jest.fn} media={media} rootElement=".foo" />
      );
      const buttons = wrapper.find('button');
      expect(buttons).toHaveLength(5);
      expect(buttons.at(0).prop('className')).toEqual('.foo__bullets--active');
      expect(buttons.at(0).prop('data-index')).toEqual(0);
      expect(buttons.at(0).text()).toEqual('0');
    });
  });
});
