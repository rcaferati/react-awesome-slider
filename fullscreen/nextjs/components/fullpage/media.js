import React from 'react';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/themes/theme-c137.css';
import { withNavigationContext } from 'react-awesome-slider/dist/navigation';
import Lettering from '../lettering/lettering';
import Content from '../content/content';
import Mouse from '../mouse/mouse';
import Section from '../section/section';
import Page from '../page/page';
import './fullpage.css';

export const Home = withNavigationContext(({ fullpage }) => {
  return (
    <Section wrapper={false} backgroundColor="#292c35">
      <Content
        main={
          <Lettering
            title="INDEX"
            text={['This is a single full page fixed screen.']}
          />
        }
        action={
          <div className="button">
            <AwesomeButton
              size="medium"
              onPress={() => {
                fullpage.navigate('/page-two');
              }}
            >
              Next Page
            </AwesomeButton>
          </div>
        }
      />
    </Section>
  );
});

export const media = [
  {
    slug: '',
    className: 'slide page-one',
    children: <Home />,
  },
  {
    slug: 'page-two',
    className: 'sectioned page-two',
    children: (
      <Page>
        <Section wrapper={false} backgroundColor="#4158b4">
          <Content
            main={
              <Lettering
                title="PAGE-TWO"
                text={[
                  'This is multiple section page, scroll down to view more content.',
                ]}
              />
            }
            action={<Mouse />}
          />
        </Section>
        <Section backgroundColor="#617be3">
          <Lettering
            title="PAGE-SECTION"
            text={['This is a continued page section.']}
          />
        </Section>
      </Page>
    ),
  },
  {
    slug: 'page-three',
    url: 'https://caferati.me/images/series/bojack-0.png',
    className: 'slide page-three',
    children: (
      <Lettering
        title="PAGE-THREE"
        text={['Screen with preloaded background image.']}
      />
    ),
  },
];
