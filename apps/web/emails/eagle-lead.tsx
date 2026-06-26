// Get the full source code, including the theme and Tailwind config:
// https://github.com/resend/react-email/tree/canary/apps/demo/emails
import { Body, Column, Container, Font, Head, Heading, Html, Img, Link, Preview, Row, Section, Tailwind, Text, Markdown } from 'react-email';
import type { CSSProperties } from 'react';
import { draft } from '@/lib/data/draft';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// ── Dark-mode overrides for Markdown output (Tailwind can't process these) ──

const markdownDarkCSS = `
  @media (prefers-color-scheme: dark) {
    h3 {
      color: #ffffff !important;
      border-bottom-color: #333333 !important;
    }
    p {
      color: #a3a3a3 !important;
    }
    hr {
      border-top-color: #333333 !important;
    }
  }
`;

// ── Design tokens (light-mode defaults) ────────────────────────────

const headingStyle: CSSProperties = {
  color: '#171717',
  fontSize: '17px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '32px 0 12px 0',
  paddingBottom: '8px',
  borderBottom: '1px solid #d4d4d4',
};

const paragraphStyle: CSSProperties = {
  color: '#525252',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: '0 0 14px 0',
};

const contactStyle: CSSProperties = {
  ...paragraphStyle,
  margin: 0,
  lineHeight: '1.5',
};

const dividerStyle: CSSProperties = {
  border: 'none',
  borderTop: '1px solid #d4d4d4',
  margin: '24px 0',
};

const markdownCustomStyles: Record<string, CSSProperties> = {
  h3: headingStyle,
  p: paragraphStyle,
  hr: dividerStyle,
};

// ── Component ──────────────────────────────────────────────────────

interface WelcomeEmailProps {
  leadName: string;
  url: string;
}

export const LeadEmail  = ({ leadName, url }: WelcomeEmailProps) => (
  <Tailwind>
    <Html>
      <Head>
        <style>{markdownDarkCSS}</style>
        <Font
          fontFamily="Inter"
          fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
            format: 'woff2',
          }}
        />
        <Font
          fontFamily="Barlow Condensed"
          fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&display=swap',
            format: 'woff2',
          }}
        />
      </Head>
      <Body
        className="bg-white dark:bg-black text-[14px] m-0 p-0"
        style={{ fontFamily: 'Inter, Helvetica Neue, Helvetica, Arial, sans-serif' }}
      >
        <Preview> Eagle Info Solutions Introduction </Preview>
        <Container className="bg-white dark:bg-black mx-auto max-w-[640px]">
          <Section>
            <Img
              src={`${baseUrl}/static/Brand/email-header.png`}
              alt=""
              width={592}
              className="block w-full"
            />
          </Section>
          <Section className="mobile:px-4 mobile:pt-10 mobile:pb-8 px-6 pt-16 pb-12">
            <Text className="text-neutral-700 dark:text-white mb-6 text-xl font-semibold">
              Hello, {leadName}
            </Text>
            <Markdown
              children={draft}
              markdownCustomStyles={markdownCustomStyles}
            />

            {/* Sign-off */}
            <Section style={{ margin: '32px 0 0 0' }}>
              <Heading as="h3" style={headingStyle}>
                Best Regards,
              </Heading>
              <Text style={paragraphStyle}>
                Eagle Info Solutions
              </Text>
              <Text style={contactStyle}>
                <Link
                  href="https://www.eagleinfosolutions.com"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  www.eagleinfosolutions.com
                </Link>
              </Text>
              <Text style={contactStyle}>
                <Link
                  href="mailto:info@eagleinfosolutions.com"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  info@eagleinfosolutions.com
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section className="mobile:px-4 mobile:py-12 border-neutral-200 dark:border-neutral-800 border-t px-6 py-16">
            <Text className="text-[13px] text-neutral-500 dark:text-neutral-400 m-0 max-w-[320px]">
              Eagle Info Solutions is your ideal Information Technology partner,
              dealing in hardware retail software & Tech Support.
            </Text>

            {/* Social icons */}
            <Row align="left">
              <Column className="w-full align-top">
                <Section align="left" className="mt-8 w-[152px]">
                  <Row align="left">
                    <Column className="w-[20px] pr-6">
                      <Link href="https://x.com/" className="inline-block">
                        <Img src={`${baseUrl}/static/icons/x_dark.svg`} alt="X" width="20" height="20" className="block" />
                      </Link>
                    </Column>
                    <Column className="w-[20px] pr-6">
                      <Link href="https://instagram.com/" className="inline-block">
                        <Img src={`${baseUrl}/static/icons/instagram-icon.svg`} alt="Instagram" width="20" height="20" className="block" />
                      </Link>
                    </Column>
                    <Column className="w-[20px] pr-6">
                      <Link href="https://tiktok.com/" className="inline-block">
                        <Img src={`${baseUrl}/static/icons/tiktok-icon-dark.svg`} alt="TikTok" width="20" height="20" className="block" />
                      </Link>
                    </Column>
                    <Column className="w-[20px]">
                      <Link href="https://facebook.com/" className="inline-block">
                        <Img src={`${baseUrl}/static/icons/facebook-icon.svg`} alt="Facebook" width="20" height="20" className="block" />
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>

            <Row align="left">
              <Column className="w-full pt-8 align-top">
                <Text className="text-[11px] text-neutral-500 dark:text-neutral-400 m-0">
                  123 Market Street, Floor 1
                  <br />
                  Tech City, CA, 94102
                </Text>
              </Column>
            </Row>

            <Row align="left">
              <Column className="w-full pt-5 align-top">
                <Text className="text-[11px] text-neutral-500 dark:text-neutral-400 m-0 max-w-[160px]">
                  <Link
                    href="https://example.com/"
                    className="text-neutral-500 dark:text-neutral-400 underline"
                  >
                    Unsubscribe
                  </Link>{' '}
                  from Eagle Info Solutions marketing emails.
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
  );

LeadEmail.PreviewProps = {
  leadName: 'Mink Technologies',
  url: 'https://example.com/',
} satisfies WelcomeEmailProps;

export default LeadEmail;
