import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Integrated with Next.js',
    imageUrl: 'img/undraw_next_js_8g5m.svg',
    description: (
      <>
        <code>relay-nextjs</code> was designed with Next.js in mind from the
        start. Perfectly integrated with Relay Hooks and no need to change pages
        not using it. 100% backwards compatible.
      </>
    ),
  },
  {
    title: 'Designed for Server Rendering',
    imageUrl: 'img/undraw_Server_re_twwj.svg',
    description: (
      <>
        Next.js speeds your page loads up using server-side rendering but
        subsequent navigations require a server-round trip.{' '}
        <code>relay-nextjs</code> keeps client-side navigation snappy with all
        the performance of SSR.
      </>
    ),
  },
  {
    title: 'Unlock React Suspense',
    imageUrl: 'img/undraw_react_y7wq.svg',
    description: (
      <>
        <code>relay-nextjs</code> uses React Suspense under the hood to
        orchestrate loading states across the page. Don't worry — we only use
        publicly documented API's so you won't be stranded in two years.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={`Relay for Next.js`}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
