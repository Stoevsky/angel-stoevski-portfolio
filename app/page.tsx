"use client";

import { KeyboardEvent, PointerEvent, ReactNode, useRef, useState } from "react";

type TabId = "about" | "links" | "press";

type Tab = {
  id: TabId;
  label: string;
};

type LinkItem = {
  label: string;
  href: string;
  icon:
    | "x"
    | "linkedin"
    | "instagram"
    | "github"
    | "mail"
    | "globe"
    | "footly"
    | "locked";
};

const tabs: Tab[] = [
  { id: "about", label: "About" },
  { id: "links", label: "Links" },
  { id: "press", label: "Press" },
];

const personalLinks: LinkItem[] = [
  { label: "X / Twitter", href: "https://x.com/stoevent", icon: "x" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/angel-stoevski-6b334b3b3/",
    icon: "linkedin",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/stoevski14/",
    icon: "instagram",
  },
  { label: "GitHub", href: "https://github.com/Stoevsky", icon: "github" },
  { label: "Email", href: "mailto:angel@footly-app.com", icon: "mail" },
];

const appLinks = [
  {
    group: "Footly",
    links: [
      { label: "Website", href: "https://tryfootly.app", icon: "footly" },
      {
        label: "Instagram",
        href: "https://www.instagram.com/footlyapp/",
        icon: "instagram",
      },
    ],
  },
  {
    group: "Locked",
    links: [
      { label: "Website", href: "https://trylocked.app", icon: "locked" },
    ],
  },
] satisfies Array<{ group: string; links: LinkItem[] }>;

const articleMentions = [
  {
    title: "MRR Story",
    description:
      "How a 15-year-old built a $10k/month AI soccer coach in 90 days.",
    status: "Public",
    href: "https://www.mrrstory.com/stories/how-a-15-year-old-built-a-10kmonth-ai-soccer-coach-in-90-days",
  },
  {
    title: "Medium article",
    description:
      "Angel was also mentioned in a Medium article. Unfortunately, the article was later taken down.",
    status: "Taken down",
  },
];

export default function Home() {
  return (
    <AppShell>
      <PortfolioTabs />
    </AppShell>
  );
}

function AppShell({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const shell = shellRef.current;

    if (!shell || event.pointerType === "touch" || frameRef.current !== null) {
      return;
    }

    const { clientX, clientY } = event;

    frameRef.current = window.requestAnimationFrame(() => {
      const rect = shell.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;

      shell.style.setProperty("--scene-rx", `${(-y * 3).toFixed(2)}deg`);
      shell.style.setProperty("--scene-ry", `${(x * 4).toFixed(2)}deg`);
      shell.style.setProperty("--scene-mx", `${(x * 8).toFixed(2)}px`);
      shell.style.setProperty("--scene-my", `${(y * 6).toFixed(2)}px`);
      shell.style.setProperty("--cursor-x", `${clientX - rect.left}px`);
      shell.style.setProperty("--cursor-y", `${clientY - rect.top}px`);
      frameRef.current = null;
    });
  }

  function handlePointerLeave() {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    shell.style.setProperty("--scene-rx", "0deg");
    shell.style.setProperty("--scene-ry", "0deg");
    shell.style.setProperty("--scene-mx", "0px");
    shell.style.setProperty("--scene-my", "0px");
  }

  return (
    <main
      className="portfolio-screen min-h-screen overflow-hidden px-4 py-6 text-text sm:px-6 sm:py-8"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div aria-hidden="true" className="ambient-space">
        <span className="ambient-plane ambient-plane-left" />
        <span className="ambient-plane ambient-plane-right" />
      </div>

      <div
        ref={shellRef}
        className="perspective-root mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-[860px] items-center"
      >
        <div className="scene-shell w-full p-4 sm:p-6 md:p-8">
          <div aria-hidden="true" className="scene-sheen" />
          {children}
        </div>
      </div>
    </main>
  );
}

function PortfolioTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("about");
  const [transitionDirection, setTransitionDirection] = useState<"forward" | "back">(
    "forward",
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  function changeTab(tabId: TabId) {
    const nextIndex = tabs.findIndex((tab) => tab.id === tabId);

    if (nextIndex !== activeIndex) {
      setTransitionDirection(nextIndex > activeIndex ? "forward" : "back");
    }

    setActiveTab(tabId);
  }

  function focusTab(index: number) {
    const nextIndex = (index + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    changeTab(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(activeIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(activeIndex - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusTab(tabs.length - 1);
    }
  }

  return (
    <>
      <header className="nav-layer">
        <Tabs
          activeTab={activeTab}
          onChange={changeTab}
          onKeyDown={handleKeyDown}
          tabRefs={tabRefs}
        />
      </header>

      <section
        key={activeTab}
        id={`${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
        data-direction={transitionDirection}
        tabIndex={0}
        className="panel-stage tab-panel relative z-10 outline-none focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        {activeTab === "about" && <AboutTab />}
        {activeTab === "links" && <LinksTab />}
        {activeTab === "press" && <PressTab />}
      </section>
    </>
  );
}

function Tabs({
  activeTab,
  onChange,
  onKeyDown,
  tabRefs,
}: {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  tabRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
}) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const tabFrameRef = useRef<number | null>(null);
  const indicatorIndex = previewIndex ?? activeIndex;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || tabFrameRef.current !== null) {
      return;
    }

    const target = event.currentTarget;
    const { clientX, clientY } = event;

    tabFrameRef.current = window.requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;

      target.style.setProperty("--tab-rx", `${(-y * 2).toFixed(2)}deg`);
      target.style.setProperty("--tab-ry", `${(x * 3).toFixed(2)}deg`);
      target.style.setProperty("--tab-glow-x", `${clientX - rect.left}px`);
      target.style.setProperty("--tab-glow-y", `${clientY - rect.top}px`);
      tabFrameRef.current = null;
    });
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    setPreviewIndex(null);
    event.currentTarget.style.setProperty("--tab-rx", "0deg");
    event.currentTarget.style.setProperty("--tab-ry", "0deg");
  }

  return (
    <div
      role="tablist"
      aria-label="Portfolio sections"
      data-index={indicatorIndex}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPreviewIndex(null);
        }
      }}
      className="depth-tabs"
    >
      <span aria-hidden="true" className="depth-tab-indicator" />
      {tabs.map((tab, index) => {
        const selected = activeTab === tab.id;
        const highlighted = indicatorIndex === index;

        return (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${tab.id}-panel`}
            tabIndex={selected ? 0 : -1}
            onPointerEnter={() => setPreviewIndex(index)}
            onFocus={() => setPreviewIndex(index)}
            onClick={() => onChange(tab.id)}
            onKeyDown={onKeyDown}
            className={`depth-tab-button ${
              highlighted ? "text-surface" : "text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function AboutTab() {
  return (
    <div className="profile-stage">
      <section className="profile-copy">
        <img
          src="/angel-stoevski.jpg"
          alt="Angel Stoevski"
          className="profile-photo"
        />
        <p className="scene-label">Founder profile</p>
        <h2 className="scene-title">Angel Stoevski</h2>
        <p className="scene-subtitle">
          15-year-old consumer apps founder. Co-Founder of Footly and Locked.
        </p>

        <div className="identity-card">
          <img
            src="/footly-logo.png"
            alt="Footly logo"
            className="identity-logo"
          />
          <div>
            <h3>Footly</h3>
            <p>Founder & CEO</p>
          </div>
        </div>

        <p className="story-copy">
          I started building at 9. At 12, I sold a Roblox game for 5 figures.
          After that, I got into ecommerce and marketing agencies, scaling both
          past $7k-$8k/month. Eventually, I realized that wasn&apos;t what I wanted
          to build long-term, so I shifted toward SaaS and consumer apps.
          My first app, Locked, reached $15k MRR within 2 months. Footly later
          reached $10k MRR within around a month and a half.
        </p>
      </section>
    </div>
  );
}

function LinksTab() {
  return (
    <div className="simple-stage">
      <SectionHeader eyebrow="Links" title="Direct links" />

      <div className="content-grid">
        <section>
          <h3 className="group-title">Personal</h3>
          <div className="link-stack">
          {personalLinks.map((link) => (
            <LinkCard key={link.label} {...link} />
          ))}
          </div>
        </section>

        {appLinks.map((group) => (
          <section key={group.group}>
            <h3 className="group-title">{group.group}</h3>
            <div className="link-stack">
              {group.links.map((link) => (
                <LinkCard key={`${group.group}-${link.label}`} {...link} />
              ))}
            </div>
          </section>
        ))}
        </div>
    </div>
  );
}

function PressTab() {
  return (
    <div className="simple-stage">
      <SectionHeader eyebrow="Press" title="Article mentions" />

      <section>
        <div className="proof-grid">
          {articleMentions.map((mention) => (
            <ProofCard key={mention.title} {...mention} />
          ))}
        </div>
      </section>
    </div>
  );
}

function LinkCard({ label, href, icon }: LinkItem) {
  const isPlaceholder = href === "#";

  return (
    <a
      href={href}
      aria-label={`${label}${isPlaceholder ? " placeholder" : ""}`}
      className="link-card group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span className="link-label">
        <SocialIcon icon={icon} />
        {label}
      </span>
      <span>
        {isPlaceholder ? "Placeholder" : "Open"}
        <ExternalIcon />
      </span>
    </a>
  );
}

function ProofCard({
  title,
  description,
  status,
  href,
}: {
  title: string;
  description: string;
  status: string;
  href?: string;
}) {
  const content = (
    <>
      <div>
        <h3>{title}</h3>
        <span>{status}</span>
      </div>
      <p>{description}</p>
      {href && (
        <span className="mention-link">
          Read article
          <ExternalIcon />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="proof-card tilt-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        {content}
      </a>
    );
  }

  return (
    <article className="proof-card tilt-card">
      {content}
    </article>
  );
}

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="font-mono text-xs font-medium uppercase text-muted">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-semibold leading-tight text-text">
        {title}
      </h2>
    </div>
  );
}

function SocialIcon({ icon }: { icon: LinkItem["icon"] }) {
  if (icon === "footly" || icon === "locked") {
    return (
      <img
        src={icon === "footly" ? "/footly-logo.png" : "/locked-icon.webp"}
        alt=""
        aria-hidden="true"
        className="social-icon app-link-icon"
      />
    );
  }

  const commonProps = {
    "aria-hidden": true,
    className: "social-icon",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: "2",
    viewBox: "0 0 24 24",
  };

  if (icon === "x") {
    return (
      <svg {...commonProps}>
        <path d="m4 4 16 16" />
        <path d="M20 4 4 20" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg {...commonProps}>
        <path d="M8 11v7" />
        <path d="M8 7v.01" />
        <path d="M12 18v-7" />
        <path d="M12 14a3 3 0 0 1 6 0v4" />
        <path d="M4 4h16v16H4z" />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg {...commonProps}>
        <rect width="16" height="16" x="4" y="4" rx="4" />
        <circle cx="12" cy="12" r="3" />
        <path d="M16.5 7.5h.01" />
      </svg>
    );
  }

  if (icon === "github") {
    return (
      <svg {...commonProps}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5a10.2 10.2 0 0 0-5.5 0C8.5 2 7.5 2 7.5 2a6.2 6.2 0 0 0 0 3.5 5.4 5.4 0 0 0-1 3.5c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65" />
        <path d="M9 18c-4.5 2-5-2-7-2" />
      </svg>
    );
  }

  if (icon === "mail") {
    return (
      <svg {...commonProps}>
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8" />
      <path d="M3.6 15h16.8" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
