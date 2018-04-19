import React from 'react';
import PropTypes from 'prop-types';
import {
  Footer,
  Example,
  Section,
  Popover,
} from '../index';

const Page = ({
  theme,
  data,
  popoverOpened,
  popoverText,
  handlePopover,
}) => {
  return (
    <Section>
      <Example
        title={theme.example.title}
        description={theme.example.description}
        component={theme.example.component}
        examples={theme.example.items}
      />
      <Footer
        repository={data.repository}
        article={data.article}
      />
      <Popover
        opened={popoverOpened}
        text={popoverText}
        handlePopover={handlePopover}
      />
    </Section>
  );
}

Page.propTypes = {
  theme: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  popoverOpened: PropTypes.bool.isRequired,
  popoverText: PropTypes.string.isRequired,
  handlePopover: PropTypes.func.isRequired,
};

export default Page;
