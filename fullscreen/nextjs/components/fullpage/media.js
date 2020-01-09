import React from 'react';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/themes/theme-c137.css';
import { withNavigationContext } from 'react-awesome-slider/dist/navigation';
import Lettering from '../lettering/lettering';
import Background from '../background/background';
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
            text={[
              'This is a single full page fixed screen.',
              'Use the button bellow to navigate to the next page',
            ]}
          />
        }
        action={
          <div className="button">
            <AwesomeButton
              size="large"
              onPress={() => {
                fullpage.navigate('/page-two');
              }}
            >
              Goto the next page
            </AwesomeButton>
          </div>
        }
      />
    </Section>
  );
});

export const Third = withNavigationContext(({ fullpage }) => {
  return (
    <Section wrapper={false} backgroundColor="#292c35">
      <Background src="https://caferati.me/images/series/bojack-0.png" />
      <Content
        main={
          <Lettering
            title="PAGE-THREE"
            text={['This is a screen with preloaded background image.']}
          />
        }
        action={
          <div className="button">
            <AwesomeButton
              size="large"
              onPress={() => {
                fullpage.navigate('/page-two');
              }}
            >
              Goto the prev page
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
    preload: ['https://caferati.me/images/series/bojack-0.png'],
    className: 'slide page-three',
    children: <Third />,
  },
];
