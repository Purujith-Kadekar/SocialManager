import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — SocialManager',
  description:
    'Privacy Policy for SocialManager, a self-hosted recipe API and desktop app developed by Purujith Kadekar. Explains what data is collected, how it is used, and your rights.',
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="August 3, 2026">
      <p>
        This Privacy Policy explains how Purujith Kadekar (&quot;Developer&quot;,
        &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, discloses,
        and protects your information when you use the SocialManager web application,
        API, and desktop app (collectively, the &quot;Service&quot;).
      </p>
      <p>
        The Developer is the data controller for personal data processed through his
        hosted instance of the Service. The Service is built on Supabase (database and
        authentication) and Vercel (web hosting), each of which acts as a separate data
        processor. This policy describes what data the Service itself collects and how
        it is handled.
      </p>

      <h2>1. Information we collect</h2>

      <h3>1.1 Information you provide directly</h3>
      <p>When you create an account, we collect:</p>
      <ul>
        <li>
          <strong>Email address</strong> — used as your unique identifier and for
          account-related communications (magic-link login, security notices, replies
          to support requests).
        </li>
        <li>
          <strong>Password</strong> — stored only as a salted hash by Supabase Auth.
          The Developer never sees your plaintext password.
        </li>
        <li>
          <strong>Full name (optional)</strong> — displayed on your dashboard and used
          to personalize your experience.
        </li>
        <li>
          <strong>Service configurations</strong> — when you add a service to your
          account, we store the recipe identifier, your custom display name, any custom
          URL you enter, the sort order, and a JSONB field of per-service settings.
        </li>
        <li>
          <strong>Custom recipes (admins only)</strong> — if you upload a custom recipe,
          we store the recipe package (<code>.tar.gz</code>), its metadata, and the
          author name you provide.
        </li>
      </ul>

      <h3>1.2 Information collected automatically</h3>
      <p>
        When you visit the Service, we collect limited technical information through
        server logs and analytics provided by our hosting providers:
      </p>
      <ul>
        <li>
          <strong>IP address</strong> — logged transiently by Vercel and Supabase for
          security, abuse prevention, and rate-limiting. Not retained in application
          database tables.
        </li>
        <li>
          <strong>Request metadata</strong> — User-Agent string, referring URL,
          timestamp, and the route you accessed. Used for debugging and aggregate
          traffic analysis.
        </li>
        <li>
          <strong>Authentication tokens</strong> — Supabase Auth session cookies are
          set in your browser to keep you signed in. These are HTTP-only, secure, and
          expire according to Supabase&apos;s default session lifetime.
        </li>
      </ul>

      <h3>1.3 Information from OAuth Providers</h3>
      <p>
        If you choose to sign in with Google (or any other OAuth Provider we may add in
        the future), we receive from the provider:
      </p>
      <ul>
        <li>Your email address as registered with the provider;</li>
        <li>The display name associated with your provider account;</li>
        <li>A stable, provider-issued identifier (a random string, not your password);</li>
        <li>
          The provider name (e.g., &quot;google&quot;) — so we know which provider
          authenticated you.
        </li>
      </ul>
      <p>
        <strong>We do NOT receive your Google password, your Google contacts, your
        Google Drive files, or any other data from your Google account.</strong> The
        OAuth scope requested is the minimum required for sign-in (the
        <code>openid email profile</code> scope).
      </p>
      <p>
        You can review and revoke the Service&apos;s access to your Google account at
        any time at <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.
      </p>

      <h3>1.4 Information we do NOT collect</h3>
      <p>We explicitly do NOT collect or process:</p>
      <ul>
        <li>
          The contents of messages you send or receive through any service you configure
          inside the SocialManager desktop app (e.g., your WhatsApp chats, Telegram
          messages, Discord DMs). The desktop app loads these services directly inside
          Electron; they never pass through the Service&apos;s API or database.
        </li>
        <li>
          Payment information — the Service is free and does not process payments.
        </li>
        <li>
          Precise geolocation — we do not request GPS or location data.
        </li>
        <li>
          Contacts, camera, microphone, or filesystem contents.
        </li>
        <li>
          Tracking pixels, advertising identifiers, or cross-site tracking cookies.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Authenticate you and maintain your session across requests;</li>
        <li>
          Create and maintain your account, including your profile, admin status, and
          service configurations;
        </li>
        <li>
          Serve the public recipe catalog and downloadable recipe packages through the
          API;
        </li>
        <li>
          Sync your service configurations across devices when you sign in to the
          desktop app with the same account;
        </li>
        <li>
          Detect, prevent, and respond to security incidents, fraud, abuse, or
          violations of our Terms;
        </li>
        <li>
          Communicate with you about your account, security notices, breaking changes
          to the API, and (rarely) important Service announcements;
        </li>
        <li>
          Comply with legal obligations under applicable Indian and international law.
        </li>
      </ul>
      <p>
        <strong>We do NOT use your data for marketing, advertising, profiling, or
        training machine-learning models.</strong> The Developer runs no ad networks,
        no analytics trackers beyond Vercel/Supabase&apos;s built-in operational
        logging, and no third-party advertising SDKs.
      </p>

      <h2>3. Legal basis for processing</h2>
      <p>
        If you are in the European Economic Area, the United Kingdom, or any other
        jurisdiction with GDPR-style data protection laws, the legal bases on which we
        process your personal data are:
      </p>
      <ul>
        <li>
          <strong>Performance of a contract</strong> (Art. 6(1)(b) GDPR) — creating and
          operating your account in accordance with our Terms of Service;
        </li>
        <li>
          <strong>Legitimate interests</strong> (Art. 6(1)(f) GDPR) — detecting abuse,
          rate-limiting the API, and securing the Service against unauthorized access;
        </li>
        <li>
          <strong>Consent</strong> (Art. 6(1)(a) GDPR) — when you choose to sign in via
          Google OAuth. You can withdraw this consent at any time via your Google
          account permissions, and we will stop relying on it going forward.
        </li>
        <li>
          <strong>Legal obligation</strong> (Art. 6(1)(c) GDPR) — when we are required
          to retain or disclose data under Indian law or valid legal process.
        </li>
      </ul>

      <h2>4. Data storage and retention</h2>

      <h3>4.1 Where your data is stored</h3>
      <p>
        Personal data is stored on infrastructure operated by our processors:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — Postgres database (your profile, service
          configurations, recipe metadata), Storage (recipe <code>.tar.gz</code>
          packages), and Auth (your email, hashed password, OAuth identifiers). The
          Supabase project region is selected by the Developer at setup time and will
          typically be in the region closest to the majority of users.
        </li>
        <li>
          <strong>Vercel</strong> — hosts the Next.js web application, API routes, and
          transient server logs. Build logs and runtime logs may be retained by Vercel
          for up to 30 days for debugging.
        </li>
      </ul>

      <h3>4.2 How long we keep your data</h3>
      <ul>
        <li>
          <strong>Account data</strong> — retained for as long as your account is
          active. Deleted within 30 days of an account-deletion request.
        </li>
        <li>
          <strong>Service configurations</strong> — same as account data; removed when
          the account is deleted.
        </li>
        <li>
          <strong>Custom recipe uploads</strong> — retained indefinitely for the benefit
          of other users, unless you request removal or the recipe is removed for
          policy reasons.
        </li>
        <li>
          <strong>Server logs (Vercel/Supabase)</strong> — retained according to each
          provider&apos;s default retention policy (typically 7–30 days).
        </li>
        <li>
          <strong>OAuth tokens</strong> — Supabase Auth may cache provider access tokens
          for the duration of your active session. These are revoked when you sign out
          or when you revoke access via the provider.
        </li>
      </ul>

      <h3>4.3 Security measures</h3>
      <p>
        The Service implements the following technical and organizational measures to
        protect your data:
      </p>
      <ul>
        <li>
          Passwords are hashed using bcrypt by Supabase Auth — never stored in
          plaintext;
        </li>
        <li>
          The Service&apos;s service-role key (used for admin operations) is stored
          only as a Vercel environment variable and never exposed to the browser;
        </li>
        <li>
          Row Level Security (RLS) is enabled on all database tables, so users can
          only read or modify their own data;
        </li>
        <li>
          Recipe packages are stored in a private Supabase Storage bucket and accessed
          only via short-lived signed URLs;
        </li>
        <li>
          All network traffic between your browser, Vercel, and Supabase is encrypted
          via HTTPS/TLS;
        </li>
        <li>
          Admin privileges are gated both by a server-side email allowlist and a
          database <code>is_admin</code> flag — neither alone is sufficient.
        </li>
      </ul>
      <p>
        Despite these measures, no system is 100% secure. The Developer cannot
        guarantee the absolute security of your data.
      </p>

      <h2>5. Sharing of your information</h2>
      <p>
        The Developer does NOT sell, rent, or trade your personal data. We share your
        information only in the following limited circumstances:
      </p>
      <ul>
        <li>
          <strong>With processors</strong> — Supabase (database, auth, storage) and
          Vercel (hosting) process your data on our behalf under their respective
          Data Processing Agreements. They are contractually prohibited from using
          your data for any other purpose.
        </li>
        <li>
          <strong>With OAuth Providers</strong> — when you sign in via Google, the
          provider receives your IP address and the fact that you signed in to this
          Service. The provider does not receive any data from your SocialManager
          account.
        </li>
        <li>
          <strong>To protect rights or comply with law</strong> — if required by a
          valid legal process (subpoena, court order, or request from a government
          authority with proper jurisdiction), or if we believe in good faith that
          disclosure is necessary to protect the rights, property, or safety of the
          Developer, users, or the public.
        </li>
        <li>
          <strong>Business transfer</strong> — in the unlikely event of a merger,
          acquisition, or asset sale, user data may be transferred to the acquiring
          entity. We would notify you via email before any such transfer.
        </li>
      </ul>

      <h2>6. Third-party links and services</h2>
      <p>
        The Service contains links to, and depends on, third-party services that have
        their own privacy policies:
      </p>
      <ul>
        <li>
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a>
        </li>
        <li>
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a>
        </li>
        <li>
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
        </li>
        <li>
          <a href="https://docs.github.com/en/site-policy/privacy-policies" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a>
        </li>
      </ul>
      <p>
        Additionally, each recipe you add (WhatsApp, Telegram, Discord, etc.) is loaded
        directly inside the SocialManager desktop app via Electron. Those services have
        their own privacy policies that apply when you use them. The Service does not
        proxy or inspect any traffic between you and those services.
      </p>

      <h2>7. Cookies and similar technologies</h2>
      <p>
        The Service uses the following cookies:
      </p>
      <ul>
        <li>
          <strong>Authentication cookies</strong> — set by Supabase Auth to maintain
          your session. These are strictly necessary for the Service to function and
          cannot be disabled.
        </li>
        <li>
          <strong>Theme cookie</strong> — stores your light/dark theme preference.
          Optional and can be cleared without affecting functionality.
        </li>
      </ul>
      <p>
        We do NOT use advertising cookies, tracking cookies, or third-party analytics
        cookies (Google Analytics, Mixpanel, Segment, etc.). The Service does not
        display advertising.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Depending on your jurisdiction, you may have the following rights regarding your
        personal data:
      </p>
      <ul>
        <li>
          <strong>Right of access</strong> — request a copy of the personal data we
          hold about you;
        </li>
        <li>
          <strong>Right to rectification</strong> — request that we correct inaccurate
          or incomplete data;
        </li>
        <li>
          <strong>Right to erasure</strong> (&quot;right to be forgotten&quot;) —
          request that we delete your account and associated personal data;
        </li>
        <li>
          <strong>Right to restrict processing</strong> — request that we limit the
          processing of your data in certain circumstances;
        </li>
        <li>
          <strong>Right to data portability</strong> — request a machine-readable copy
          of your data in a structured format;
        </li>
        <li>
          <strong>Right to object</strong> — object to processing based on legitimate
          interests or for direct marketing (we do no direct marketing);
        </li>
        <li>
          <strong>Right to withdraw consent</strong> — withdraw consent for OAuth-based
          processing at any time without affecting the lawfulness of processing before
          withdrawal.
        </li>
      </ul>
      <p>
        To exercise any of these rights, please open an issue at
        <a href="https://github.com/Purujith-Kadekar/SocialManager/issues" target="_blank" rel="noopener noreferrer">github.com/Purujith-Kadekar/SocialManager/issues</a>
        or email the Developer. We will respond within 30 days. We may need to verify
        your identity before processing certain requests.
      </p>
      <p>
        If you are in the European Union, the United Kingdom, or Switzerland, you also
        have the right to lodge a complaint with your local supervisory data protection
        authority. A list of EU DPAs is available at
        <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer">edpb.europa.eu</a>.
      </p>

      <h2>9. Children&apos;s privacy</h2>
      <p>
        The Service is not directed to children under 13 (or the minimum age of digital
        consent in your jurisdiction). We do not knowingly collect personal data from
        children. If you believe a child has provided us with personal data, please
        contact us and we will promptly delete it.
      </p>

      <h2>10. International data transfers</h2>
      <p>
        Your data may be processed on servers located outside your country of residence,
        including in the United States (Vercel) and the region selected for the Supabase
        project. By using the Service, you consent to these transfers. Where required
        (for example, for EU/UK residents), appropriate safeguards such as Standard
        Contractual Clauses are in place between the Developer and the processors.
      </p>

      <h2>11. Notifications</h2>
      <p>
        We may use your email address to send you the following types of emails:
      </p>
      <ul>
        <li>
          <strong>Transactional emails</strong> — magic-link login, email verification,
          password reset (if you trigger it). These are required for the Service to
          function;
        </li>
        <li>
          <strong>Security notices</strong> — if we become aware of a security incident
          affecting your account;
        </li>
        <li>
          <strong>Service announcements</strong> — only for material changes (e.g.,
          API breaking changes, end-of-life announcements). At most a few per year.
        </li>
      </ul>
      <p>
        We will NEVER send you marketing emails, newsletters, or promotional offers.
        You cannot opt out of transactional emails (they are required to operate your
        account), but you can opt out of service announcements by replying with
        &quot;unsubscribe&quot;.
      </p>

      <h2>12. Changes to this Privacy Policy</h2>
      <p>
        The Developer may update this Privacy Policy from time to time. The most current
        version will always be available at this URL with the &quot;Last updated&quot;
        date at the top. If a change is material (e.g., a new category of data
        collected, a new processor added, or a change in how we use your data), we will
        notify you via email or a prominent banner on the Service before the change
        takes effect.
      </p>

      <h2>13. Contact</h2>
      <p>
        If you have any questions, requests, or concerns about this Privacy Policy or
        your personal data, please contact the Developer:
      </p>
      <ul>
        <li>Developer: Purujith Kadekar</li>
        <li>Project: <a href="https://github.com/Purujith-Kadekar/SocialManager" target="_blank" rel="noopener noreferrer">github.com/Purujith-Kadekar/SocialManager</a></li>
        <li>Issues: <a href="https://github.com/Purujith-Kadekar/SocialManager/issues" target="_blank" rel="noopener noreferrer">github.com/Purujith-Kadekar/SocialManager/issues</a></li>
      </ul>
      <p>
        For privacy-related requests, please include the email address associated with
        your account and a brief description of your request. We aim to respond within
        30 days.
      </p>
    </LegalPage>
  )
}
