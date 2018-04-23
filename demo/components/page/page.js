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
  startup,
}) => {
  return (
    <Section>
      <Example
        startup={startup}
        title={theme.example.title}
        description={theme.example.description}
        Component={theme.example.Component}
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
  startup: PropTypes.bool.isRequired,
  popoverText: PropTypes.string.isRequired,
  handlePopover: PropTypes.func.isRequired,
};

export default Page;
