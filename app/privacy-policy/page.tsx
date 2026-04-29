"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="space-y-3 text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  const { t } = useTranslation("privacy");

  const lastUpdated = t("meta.lastUpdated");
  const introTitle = t("intro.title");
  const introText = t("intro.text");

  const controllerTitle = t("controller.title");
  const controllerText = t("controller.text");
  const controllerEmail = t("controller.email");

  const personalTitle = t("data.personal.title");
  const personalEmail = t("data.personal.email");
  const personalPassword = t("data.personal.password");
  const personalNote = t("data.personal.note");

  const appTitle = t("data.app.title");
  const appDescription = t("data.app.description");
  const appTypes = t("data.app.types");

  const purposeTitle = t("purpose.title");
  const purposeAccount = t("purpose.account");
  const purposeFunctionality = t("purpose.functionality");

  const legalTitle = t("legal.title");
  const legalContract = t("legal.contract");

  const securityTitle = t("security.title");
  const securityStorage = t("security.storage");
  const securityMeasures = t("security.measures");

  const sharingTitle = t("sharing.title");
  const sharingStatement = t("sharing.statement");
  const sharingProviders = t("sharing.providers");

  const retentionTitle = t("retention.title");
  const retentionText = t("retention.text");
  const retentionDeletion = t("retention.deletion");

  const rightsTitle = t("rights.title");
  const rightsAccess = t("rights.access");
  const rightsRectification = t("rights.rectification");
  const rightsDeletion = t("rights.deletion");
  const rightsWithdrawal = t("rights.withdrawal");
  const rightsAuthority = t("rights.authority");

  const contactTitle = t("contact.title");
  const contactText = t("contact.text");
  const contactEmail = t("contact.email");

  const changesTitle = t("changes.title");
  const changesText = t("changes.text");

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              {t("meta.title")}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {t("meta.title")}
            </h1>
            <p className="text-sm text-slate-500">
              {lastUpdated ? `${t("meta.lastUpdated")}: ${lastUpdated}` : null}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              ← {t("common.back", { defaultValue: "Back" })}
            </Link>
          </div>
        </header>

        <Section title={introTitle}>
          <p>{introText}</p>
        </Section>

        <Section title={controllerTitle}>
          <p>{controllerText}</p>
          <p>{controllerEmail}</p>
        </Section>

        <Section title={personalTitle}>
          <p>{personalEmail}</p>
          <p>{personalPassword}</p>
          <p>{personalNote}</p>
        </Section>

        <Section title={appTitle}>
          <p>{appDescription}</p>
          <p>{appTypes}</p>
        </Section>

        <Section title={purposeTitle}>
          <List items={[purposeAccount, purposeFunctionality]} />
        </Section>

        <Section title={legalTitle}>
          <p>{legalContract}</p>
        </Section>

        <Section title={securityTitle}>
          <p>{securityStorage}</p>
          <p>{securityMeasures}</p>
        </Section>

        <Section title={sharingTitle}>
          <p>{sharingStatement}</p>
          <p>{sharingProviders}</p>
        </Section>

        <Section title={retentionTitle}>
          <p>{retentionText}</p>
          <p>{retentionDeletion}</p>
        </Section>

        <Section title={rightsTitle}>
          <List
            items={[
              rightsAccess,
              rightsRectification,
              rightsDeletion,
              rightsWithdrawal,
              rightsAuthority,
            ]}
          />
        </Section>

        <Section title={contactTitle}>
          <p>{contactText}</p>
          <p>{contactEmail}</p>
        </Section>

        <Section title={changesTitle}>
          <p>{changesText}</p>
        </Section>
      </div>
    </main>
  );
}
