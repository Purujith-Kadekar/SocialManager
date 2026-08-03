import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service — SocialManager',
  description:
    'Terms of Service for SocialManager, a self-hosted recipe API and desktop app developed by Purujith Kadekar.',
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" effectiveDate="August 3, 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
        SocialManager web application, API, and desktop app (collectively, the
        &quot;Service&quot;) operated by Purujith Kadekar (&quot;Developer&quot;,
        &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). The Service is open-source
        under the MIT License and is provided on a non-commercial, self-hosted basis.
      </p>
      <p>
        By creating an account, accessing the API, or downloading and using the desktop
        app, you agree to be bound by these Terms. If you do not agree to all of these
        Terms, you must not access or use the Service.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 13 years of age (or the minimum age required to consent to
        data processing in your jurisdiction) to create an account. If you are under 18,
        you represent that your parent or legal guardian has read and agreed to these
        Terms on your behalf. By using the Service, you represent and warrant that you
        meet these eligibility requirements and that you have the legal capacity to enter
        into a binding agreement.
      </p>

      <h2>2. Accounts</h2>
      <h3>2.1 Account creation</h3>
      <p>
        You can create an account using an email address and password, a magic link sent
        to your email, or by signing in with a third-party identity provider such as
        Google (&quot;OAuth Provider&quot;). You are responsible for maintaining the
        confidentiality of your login credentials and for all activity that occurs under
        your account.
      </p>
      <h3>2.2 Account responsibility</h3>
      <p>
        You agree to notify the Developer immediately of any unauthorized use of your
        account or any other security breach. The Developer will not be liable for any
        loss or damage arising from your failure to comply with this obligation. You are
        solely responsible for all content, data, and service configurations stored under
        your account, including any &quot;user services&quot; you configure in the
        dashboard.
      </p>
      <h3>2.3 Admin accounts</h3>
      <p>
        Certain email addresses designated by the Developer may be granted administrative
        privileges. Admins can upload, modify, or delete recipes and view aggregated
        storage statistics. Admins may not use their privileges to access, modify, or
        delete data belonging to other users except as strictly necessary to operate the
        Service. Misuse of admin privileges is a material breach of these Terms.
      </p>

      <h2>3. OAuth and third-party sign-in</h2>
      <p>
        If you choose to sign in using an OAuth Provider (such as Google), you are
        subject to the terms of service and privacy policy of that provider in addition
        to these Terms. When you authenticate via OAuth, the Service receives from the
        provider the minimum information necessary to create and sign in to your account
        — typically your email address, name, and a provider-issued identifier.
      </p>
      <p>
        You authorize the Service to retain this information for as long as your account
        is active and to use it to authenticate you on subsequent sign-ins. You may
        revoke the Service&apos;s access to your OAuth Provider account at any time
        through your provider&apos;s account settings (for example, in your Google
        Account security settings). Revoking access will prevent future sign-ins via
        that provider but will not automatically delete your SocialManager account.
      </p>
      <p>
        The Developer is not responsible for any disruption to the Service caused by an
        OAuth Provider revoking access, changing its API, or experiencing an outage.
      </p>

      <h2>4. The recipe API</h2>
      <h3>4.1 Nature of the API</h3>
      <p>
        The Service exposes a public HTTP API at <code>/api/v1/recipes</code> and
        related endpoints. This API is provided as a convenience to allow the
        SocialManager desktop app (and compatible Ferdium forks) to fetch a catalog of
        recipes and download <code>.tar.gz</code> recipe packages. The API is provided
        on a best-effort basis with no uptime guarantee. The Developer may modify,
        rate-limit, suspend, or discontinue the API at any time without notice.
      </p>
      <h3>4.2 Acceptable API use</h3>
      <p>You agree NOT to:</p>
      <ul>
        <li>
          Use the API in any manner that could disable, overburden, damage, or impair
          the Service, including via automated high-volume scraping, denial-of-service
          attacks, or runaway scripts;
        </li>
        <li>
          Reverse-engineer, decompile, or attempt to extract the source code of the
          Service except to the extent permitted by applicable law;
        </li>
        <li>
          Use the API to build a competing recipe catalog or to redistribute the recipes
          in bulk without attribution to the original Ferdium project and recipe authors;
        </li>
        <li>
          Bypass any rate limits, authentication, or security measures implemented by the
          Service or by Supabase (the Service&apos;s data backend);
        </li>
        <li>
          Use the API to transmit any malware, malicious code, or content that infringes
          the intellectual property rights of any third party.
        </li>
      </ul>
      <h3>4.3 Recipe content and ownership</h3>
      <p>
        Recipes available through the API are sourced from the open-source
        <a
          href="https://github.com/ferdium/ferdium-recipes"
          target="_blank"
          rel="noopener noreferrer"
        > ferdium-recipes repository</a> and are licensed under their respective
        upstream licenses (typically MIT). Custom recipes uploaded by admins remain the
        property of their respective authors. The Developer claims no ownership over any
        recipe content distributed through the API.
      </p>

      <h2>5. User content and service configurations</h2>
      <p>
        When you add a service to your account, the Service stores the recipe identifier,
        a custom display name, your custom URL (if any), and any per-service settings
        you provide. You retain all ownership rights to your service configurations. By
        saving them, you grant the Service a non-exclusive, worldwide, royalty-free
        license to store, transmit, and display them solely for the purpose of operating
        the Service for you.
      </p>
      <p>
        You are solely responsible for any custom URLs or service configurations you
        enter. The Developer does not pre-screen user content and assumes no liability
        for it. The Developer reserves the right to remove or disable access to any
        user content that violates these Terms or applicable law.
      </p>

      <h2>6. Third-party services</h2>
      <p>
        The Service relies on the following third-party providers. Each has its own
        terms and privacy policy, which you should review:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — provides the Postgres database, file storage, and
          authentication backend. Your email address, hashed password, OAuth
          identifiers, and service configurations are stored on Supabase infrastructure.
          See <a href="https://supabase.com/terms" target="_blank" rel="noopener noreferrer">Supabase&apos;s Terms</a> and
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </li>
        <li>
          <strong>Vercel</strong> — hosts the Next.js web application and API routes. See
          <a href="https://vercel.com/legal/terms" target="_blank" rel="noopener noreferrer">Vercel&apos;s Terms</a>.
        </li>
        <li>
          <strong>Google</strong> — optional OAuth sign-in provider. See
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Google&apos;s Terms</a>.
        </li>
        <li>
          <strong>GitHub</strong> — source of recipe packages served through the API. See
          <a href="https://docs.github.com/en/site-policy/github-terms" target="_blank" rel="noopener noreferrer">GitHub&apos;s Terms</a>.
        </li>
      </ul>
      <p>
        The Developer is not responsible for the practices or availability of any
        third-party service. Disruptions to third-party services may affect the Service.
      </p>

      <h2>7. Acceptable use</h2>
      <p>You agree NOT to:</p>
      <ul>
        <li>
          Use the Service for any unlawful purpose or in violation of any local, state,
          national, or international law;
        </li>
        <li>
          Harass, abuse, threaten, or impersonate any person or entity via the Service;
        </li>
        <li>
          Upload or transmit any viruses, malware, or any code of a destructive or
          harmful nature;
        </li>
        <li>
          Attempt to gain unauthorized access to any portion of the Service, other
          accounts, computer systems, or networks connected to the Service;
        </li>
        <li>
          Use the Service to send unsolicited commercial communications or to scrape,
          collect, or store personal data of other users without their consent;
        </li>
        <li>
          Resell, sublicense, or rebrand the Service without the Developer&apos;s prior
          written consent.
        </li>
      </ul>

      <h2>8. Service modifications</h2>
      <p>
        The Service is a personal, open-source project. The Developer reserves the right
        to modify, suspend, or discontinue the Service (or any part of it) at any time,
        with or without notice. Recipe availability may change as upstream Ferdium
        recipes are added, removed, or updated. The Developer will not be liable to you
        or to any third party for any such modification, suspension, or discontinuance.
      </p>

      <h2>9. Account termination</h2>
      <p>
        You may delete your account at any time by contacting the Developer. Upon
        deletion, your personal data, service configurations, and admin privileges will
        be removed from the database. Recipe packages you uploaded as an admin may be
        retained for the benefit of other users unless you request their removal.
      </p>
      <p>
        The Developer may suspend or terminate your access to the Service immediately,
        without prior notice or liability, if you breach these Terms, if your account
        has been inactive for an extended period, or if required by law.
      </p>

      <h2>10. Disclaimer of warranties</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;, WITHOUT
        WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
        IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT. THE DEVELOPER DOES NOT WARRANT THAT THE SERVICE WILL BE
        UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT ANY RECIPE WILL FUNCTION CORRECTLY
        INSIDE THE DESKTOP APP.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE
        DEVELOPER BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
        PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF
        OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SERVICE, WHETHER BASED ON
        WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY,
        WHETHER OR NOT THE DEVELOPER HAS BEEN INFORMED OF THE POSSIBILITY OF SUCH
        DAMAGE. THE DEVELOPER&apos;S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS RELATING
        TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO THE DEVELOPER FOR THE
        SERVICE DURING THE PRECEDING TWELVE MONTHS (I.E., ZERO DOLLARS, AS THE SERVICE
        IS FREE).
      </p>

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless the Developer from and against
        any and all claims, damages, losses, liabilities, costs, and expenses
        (including reasonable attorneys&apos; fees) arising out of or related to your
        use of the Service, your violation of these Terms, or your violation of any
        rights of a third party.
      </p>

      <h2>13. Open-source license</h2>
      <p>
        The source code of the Service is licensed under the MIT License. You are free
        to fork, modify, and self-host the Service subject to the terms of that license.
        These Terms apply only to the Developer&apos;s hosted instance of the Service.
        If you self-host the Service, you are solely responsible for compliance with
        applicable laws, data protection regulations, and the security of your
        deployment.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        The Developer may revise these Terms from time to time. The most current version
        will always be available at this URL with the &quot;Last updated&quot; date at
        the top. If a revision is material, the Developer will make a reasonable effort
        to notify users (for example, via a banner on the homepage). Your continued use
        of the Service after the effective date of any revision constitutes your
        acceptance of the revised Terms.
      </p>

      <h2>15. Governing law and dispute resolution</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of
        India, without regard to its conflict-of-law provisions. Any dispute arising out
        of or relating to these Terms or the Service shall first be attempted to be
        resolved through good-faith negotiation. If the dispute cannot be resolved
        through negotiation within thirty (30) days, it shall be submitted to the
        exclusive jurisdiction of the courts of Bengaluru, India.
      </p>

      <h2>16. Severability</h2>
      <p>
        If any provision of these Terms is held to be unenforceable or invalid by a
        court of competent jurisdiction, that provision will be modified to the minimum
        extent necessary to make it enforceable, and the remaining provisions will
        continue in full force and effect.
      </p>

      <h2>17. Entire agreement</h2>
      <p>
        These Terms, together with the Privacy Policy, constitute the entire and
        exclusive understanding and agreement between you and the Developer regarding
        the Service, and supersede all prior or contemporaneous agreements, whether
        oral or written.
      </p>

      <h2>18. Contact</h2>
      <p>
        If you have any questions, concerns, or notices regarding these Terms, please
        contact the Developer:
      </p>
      <ul>
        <li>Developer: Purujith Kadekar</li>
        <li>Project: <a href="https://github.com/Purujith-Kadekar/SocialManager" target="_blank" rel="noopener noreferrer">github.com/Purujith-Kadekar/SocialManager</a></li>
        <li>Issues: <a href="https://github.com/Purujith-Kadekar/SocialManager/issues" target="_blank" rel="noopener noreferrer">github.com/Purujith-Kadekar/SocialManager/issues</a></li>
      </ul>
    </LegalPage>
  )
}
