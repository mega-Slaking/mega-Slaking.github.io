import { useEffect, useId, useRef, useState } from 'react';
import { ShatterCard } from './ShatterCard.jsx';

import profileImage from '../profile.jpg';
import thesisPdf from '../theory_methods_marked.pdf';
import xFieldGif from '../gifs/X_field.gif';
import yFieldGif from '../gifs/y_field.gif';
import zFieldGif from '../gifs/z_field.gif';
import yzFieldGif from '../gifs/yz_field.gif';
import waterGif from '../gifs/yes.gif';
import PixelClickEffect from './PixelClickEffect.jsx';

function getRoute() {
  const hash = window.location.hash;

  if (hash === '#/projects') return 'projects';
  if (hash === '#/experience') return 'experience';
  if (hash === '#/blog') return 'blog';
  if (hash.startsWith('#/blog/')) return `blog-post:${hash.slice(7)}`;

  return 'home';
}

function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');

      if (anchor && !anchor.getAttribute('href').startsWith('#/')) {
        const target = document.querySelector(anchor.getAttribute('href'));

        if (target) {
          event.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (route !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (window.location.hash && !window.location.hash.startsWith('#/')) {
      window.requestAnimationFrame(() => {
        document.querySelector(window.location.hash)?.scrollIntoView({
          behavior: 'smooth',
        });
      });
    }
  }, [route]);

  return (
    <>
      <PixelClickEffect />
      <Header />
      {route === 'projects' ? <ProjectsPage /> : null}
      {route === 'experience' ? <ExperiencePage /> : null}
      {route === 'blog' ? <BlogPage /> : null}
      {route.startsWith('blog-post:') ? <BlogPostPage slug={route.slice(10)} /> : null}
      {route === 'home' ? <HomePage /> : null}
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header>
      <h1>Kish Kharka</h1>
      <nav>
        <a href="#about">About</a>
        <a href="#/projects">Projects</a>
        <a href="#/experience">Experience</a>
        <a href="#/blog">Blog</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <AboutSection />
      <section id="projects">
        <h2>Projects, Experience and Blog</h2>
        <CarouselPicker />
      </section>
      <ContactSection />
    </>
  );
}

const NAV_ITEMS = [
  { label: 'Projects', href: '#/projects' },
  { label: 'Experience', href: '#/experience' },
  { label: 'Blog', href: '#/blog' },
];

function CarouselPicker() {
  const [selected, setSelected] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const touchStartRef = useRef(null);
  const n = NAV_ITEMS.length;

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const doSwitch = (dir) => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSelected(s => (s + dir + n) % n);
      setAnimating(false);
    }, 560);
  };

  const getSlotClass = (idx) => {
    if (!animating) {
      if (idx === selected) return 'carousel-slot--central';
      if (idx === (selected + 1) % n) return 'carousel-slot--right';
      return 'carousel-slot--left';
    }
    // During animation: show items at their destination positions
    const next = (selected + direction + n) % n;
    if (idx === next) return 'carousel-slot--central';
    if (idx === (next + 1) % n) return 'carousel-slot--right';
    return 'carousel-slot--left';
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    // Require horizontal movement to dominate and exceed threshold
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    doSwitch(dx < 0 ? 1 : -1);
  };

  return (
    <div className="carousel-picker" role="group" aria-label="Projects, experience, and blog navigation">
      <button
        className="carousel-arrow"
        onClick={() => doSwitch(-1)}
        aria-label="Previous"
        disabled={animating}
        type="button"
      >
        ‹
      </button>
      <div
        className="carousel-track"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {NAV_ITEMS.map((item, idx) => (
          <div key={item.label} className={`carousel-slot ${getSlotClass(idx)}`}>
            <ShatterCard label={item.label} href={item.href} />
          </div>
        ))}
      </div>
      <button
        className="carousel-arrow"
        onClick={() => doSwitch(1)}
        aria-label="Next"
        disabled={animating}
        type="button"
      >
        ›
      </button>
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about">
      <div className="about-container">
        <div className="text-container">
          <h2>About Me</h2>
          <p>
            Ambitious and adaptable, I am a Bachelor of Science graduate from the University of Sydney with majors in
            Physics and Chemistry (Honours - First Class). I excel in problem-solving, thrive in diverse environments,
            and possess a strong background in scientific research, programming, and technology. With proven abilities in
            predictive analytics, automation, and technical platforms through my role at Westpac, I am eager to contribute
            and expand my expertise in development and DevOps. Recently, I have developed a strong interest in trading and
            financial markets, further diversifying my skill set and expanding my perspective in the realm of finance.
          </p>
        </div>
        <div className="image-content">
          <img src={profileImage} alt="Profile Picture" />
        </div>
      </div>
    </section>
  );
}

function ProjectsPage() {
  return (
    <section id="projects-page" className="content-page">
      <div className="page-actions">
        <a href="#projects">Back to Projects and Experience</a>
      </div>
      <h2>Projects</h2>
      <div className="project-grid">
        <ExpandableItem
          variant="project"
          title="Systematic Quantitative Research & Backtesting Platform"
          summary="A modular quantitative research and backtesting platform for testing systematic bond ETF allocation strategies using macro regimes, price signals, volatility/covariance models, scenario factories, SQLite persistence, and Streamlit analytics dashboards."
          buttonText="More details"
        >
          <h4>Overview</h4>
          <p>
            Built a modular quantitative research platform for testing systematic asset-allocation strategies across bond
            ETFs, macroeconomic regimes, volatility models, and portfolio construction rules. The platform ingests market
            and macroeconomic data, computes price and macro signals, classifies economic/monetary regimes, generates
            allocation decisions, applies risk-aware sizing and constraints, persists scenario results to SQLite, and
            surfaces performance analytics through a Streamlit dashboard.
          </p>
          <h4>Key Highlights</h4>
          <ul>
            <li>
              Built a modular Python research platform for systematic asset-allocation experiments across bond ETFs
              including TLT, AGG, and SHY.
            </li>
            <li>
              Designed a decision-centric strategy pipeline covering macro/price signal generation, regime
              classification, base allocation, volatility-aware position sizing, portfolio constraints, and final
              allocation tracing.
            </li>
            <li>
              Implemented scenario factories to compare strategy variants across EWMA/GARCH volatility models,
              sample/EWMA covariance scaling, conviction scaling, and portfolio volatility targeting.
            </li>
            <li>
              Persisted backtest results, decision traces, costs, turnover, NAV, and scenario metadata into SQLite for
              reproducible experiment tracking.
            </li>
            <li>
              Built Streamlit dashboards and tearsheet analytics for NAV comparison, return analysis, drawdowns,
              Sharpe/Sortino/Calmar, VaR/CVaR, turnover, cost drag, and ETF price inspection.
            </li>
            <li>
              Optimized expensive covariance calculations using C++/pybind11 integration, precomputed return views, and
              caching to improve scenario-testing performance.
            </li>
            <li>
              Refactored macro data handling to store raw FRED series only while computing derived features such as
              inflation direction, yield curve, labour weakness, and growth signals at runtime.
            </li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">Python</span>
            <span className="project-tag">SQLite</span>
            <span className="project-tag">Streamlit</span>
            <span className="project-tag">C++ / pybind11</span>
            <span className="project-tag">EWMA</span>
            <span className="project-tag">GARCH</span>
            <span className="project-tag">FRED</span>
          </div>
          <h4>Source Code</h4>
          <div className="project-links">
            <a href="https://github.com/mega-Slaking/systematic_trading_model" target="_blank" rel="noreferrer">
              Publicly available code and README — github.com/mega-Slaking/systematic_trading_model
            </a>
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="project"
          title="Honours Thesis"
          summary="Computational Modelling of the effects of Oriented External Electric Fields on Glycine"
          buttonText="View More Details"
        >
          <h4>Overview</h4>
          <p>
            The project focused on simulating the behavior of glycine molecules under varying external electric fields.
          </p>
          <h4>Key Highlights</h4>
          <ul>
            <li>
              Developed a three-dimensional model to map glycine&apos;s potential energy surface by varying dihedral angles,
              forming the foundation for advanced predictive modeling.
            </li>
            <li>
              Investigated and applied modified Shepard interpolation methods, leveraging first and second-order derivatives
              to enhance predictive accuracy and enable model extrapolation.
            </li>
            <li>
              Created and implemented rotation matrices for precise data transformation and molecular orientation in
              computational simulations.
            </li>
            <li>
              Modeled glycine&apos;s interactions under varying electric fields (x, y, z) to characterize enzyme binding and
              structural changes, leveraging computational data analysis techniques.
            </li>
            <li>
              Engineered the first full-dimensional (24-dimensional) data model for a molecule larger than three atoms,
              showcasing innovation in high-dimensional modeling.
            </li>
            <li>
              Validated the model by accurately predicting glycine&apos;s behavior in biologically relevant environments,
              such as water, as seen in the visualisations below.
            </li>
          </ul>
          <h4>Thesis Document</h4>
          <div className="project-links">
            <a href={thesisPdf} target="_blank" rel="noreferrer">
              Check this file out here — view the methods used to create these predictive models.
            </a>
          </div>
          <h4>Visualisations</h4>
          <div className="project-media-grid">
            <img src={yFieldGif} alt="Application of y-electric field" className="project-gif" />
            <img src={xFieldGif} alt="Application of x-electric field" className="project-gif" />
            <img src={zFieldGif} alt="Application of z-electric field" className="project-gif" />
            <img src={yzFieldGif} alt="Application of yz-electric field" className="project-gif" />
            <img src={waterGif} alt="Modelling Glycine in water" className="project-gif" />
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="project"
          title="Cartier Data Analysis Project"
          summary="Worked together in an interdisciplinary team to provide a solution for Cartier&apos;s boutique zoning traffic"
          buttonText="More details"
        >
          <h4>Key Highlights</h4>
          <ul>
            <li>
              <strong>Data Analysis and Insights:</strong> Analyzed customer engagement data using Pandas and Matplotlib to investigate
              inconsistencies between Cartier&apos;s online and in-store traffic trends.
            </li>
            <li>
              <strong>Data Visualization:</strong> Created visual models to highlight key discrepancies, revealing that in-store jewelry zones
              had significantly higher traffic, while online data indicated watches as the most viewed category.
            </li>
            <li>
              <strong>Problem Identification:</strong> Identified a disconnect between online engagement trends and in-store customer behavior,
              providing actionable insights for boutique traffic management.
            </li>
            <li>
              <strong>Data-Driven Recommendations:</strong> Leveraged insights and research on the psychology of zoning to propose boutique
              rezoning strategies aimed at optimizing customer flow and increasing engagement with key product categories.
            </li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">Python</span>
            <span className="project-tag">Pandas</span>
            <span className="project-tag">Matplotlib</span>
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="project"
          title="Raspberry Pi AI-Assisted Development Orchestrator"
          summary="A Raspberry Pi-hosted AI development orchestrator that lets me trigger Claude/OpenClaw coding tasks from Telegram, automatically create PRs from safe feature branches, run validation checks, and preview frontend changes privately over Tailscale before merging."
          buttonText="More details"
        >
          <h4>Overview</h4>
          <p>
            Built a private AI-assisted development infrastructure using a Raspberry Pi, Telegram, Tailscale, GitHub,
            Claude Code, OpenClaw, and custom Python/Bash orchestration scripts.
          </p>
          <h4>Key Highlights</h4>
          <ul>
            <li>
              Built a Raspberry Pi-based AI-assisted development orchestrator using Telegram, Tailscale, GitHub, Claude
              Code, OpenClaw, Python, and Bash.
            </li>
            <li>
              Designed a phone-first development workflow where Telegram commands trigger scoped AI coding tasks, branch
              creation, validation, PR generation, and private preview links.
            </li>
            <li>
              Implemented branch safety controls including dev-branch integration, protected main/master avoidance,
              task-specific branch prefixes, dirty-working-tree checks, and manual PR review boundaries.
            </li>
            <li>
              Integrated Tailscale to securely preview Vite/React frontend branches from a phone without exposing local
              development servers to the public internet.
            </li>
            <li>
              Added operational safeguards including AI task kill switches, model/cost control separation, timeout
              handling, agent prompt guardrails, and separation between bot-owned Telegram control and agent-owned code
              execution.
            </li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">Raspberry Pi</span>
            <span className="project-tag">Python</span>
            <span className="project-tag">Bash</span>
            <span className="project-tag">Telegram</span>
            <span className="project-tag">Tailscale</span>
            <span className="project-tag">GitHub</span>
            <span className="project-tag">Claude Code</span>
            <span className="project-tag">OpenClaw</span>
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="project"
          title="Raspberry Pi AI-Assisted Development Orchestrator"
          summary="A Raspberry Pi-hosted AI development orchestrator that lets me trigger Claude/OpenClaw coding tasks from Telegram, automatically create PRs from safe feature branches, run validation checks, and preview frontend changes privately over Tailscale before merging."
          buttonText="More details"
        >
          <p>
            Built a private AI-assisted development infrastructure using a Raspberry Pi, Telegram, Tailscale, GitHub,
            Claude Code, OpenClaw, and custom Python/Bash orchestration scripts. Highlights include:
          </p>
          <ul>
            <li>
              Built a Raspberry Pi-based AI-assisted development orchestrator using Telegram, Tailscale, GitHub, Claude
              Code, OpenClaw, Python, and Bash.
            </li>
            <li>
              Designed a phone-first development workflow where Telegram commands trigger scoped AI coding tasks, branch
              creation, validation, PR generation, and private preview links.
            </li>
            <li>
              Implemented branch safety controls including dev-branch integration, protected main/master avoidance,
              task-specific branch prefixes, dirty-working-tree checks, and manual PR review boundaries.
            </li>
            <li>
              Integrated Tailscale to securely preview Vite/React frontend branches from a phone without exposing local
              development servers to the public internet.
            </li>
            <li>
              Added operational safeguards including AI task kill switches, model/cost control separation, timeout
              handling, agent prompt guardrails, and separation between bot-owned Telegram control and agent-owned code
              execution.
            </li>
          </ul>
        </ExpandableItem>
      </div>
    </section>
  );
}

function ExperiencePage() {
  return (
    <section id="experience-page" className="content-page">
      <div className="page-actions">
        <a href="#projects">Back to Projects and Experience</a>
      </div>
      <h2>Experience</h2>
      <div className="timeline">
        <ExpandableItem
          variant="timeline"
          title="Quantitative Engineer (Graduate)"
          summary="Built quantitative and risk analytics applications across macroeconomic forecasting, fixed-income and FX strategy, and customer platforms, supporting trading, hedging, and exposure management decisions for Financial Markets and Treasury"
          buttonText="Click to reveal more details"
        >
          <h4>Treasury</h4>
          <ul>
            <li>
              Engineered a macroeconomic forecasting and analytics tool for the New Zealand line of business, integrating
              data pipelines from Bloomberg, Macrobond, and NZ Stats sources to transform economic data into
              forward-looking risk insights. Supported hedging and exposure management decisions through automated data
              ingestion, cleaning, modelling, and visualisation of macroeconomic indicators and forecast scenarios.
            </li>
            <li>
              Created and deployed a custom front-office analytics application for bond spread and OIS-linked
              fixed-income strategy analysis, automating the workflow from data ingestion and cleaning through business
              intelligence and frontend visualisation. The tool incorporated historical curve behaviour, free-float
              metrics, credit percentile projections, and regime-segmented regression analysis to streamline manual
              research workflows and support evaluation of relative-value opportunities in rates markets.
            </li>
            <li>
              Developed and deployed a systems maintenance and health-check application for the front-office technology
              team, supporting file validation, application availability checks, API monitoring, and custom Python-based
              checks executed in a sandboxed environment. Integrated email alerting and ServiceNow incident creation to
              proactively surface operational issues and support smoother technology operations across business-critical
              systems.
            </li>
          </ul>
          <h4>Financial Markets</h4>
          <ul>
            <li>
              Improved dealer productivity within a CRM platform by developing a tailored customer search API and
              full-text indexing strategy for financial markets customer data. Enhanced lookup speed and search
              relevance, reducing friction for dealers accessing client information during business interactions.
            </li>
            <li>
              Reduced release risk for a pre-trade check and post-trade exceptions CRM platform by developing an
              end-to-end Cypress regression testing suite covering critical user flows, form behaviours, and data
              consistency checks. Improved confidence in new platform features by helping ensure development changes did
              not regress workflows used by stakeholders in customer-facing financial markets interactions.
            </li>
            <li>
              Designed and built an end-to-end FX risk analytics application for the BCG line of business, implementing
              mark-to-market valuation, portfolio P&amp;L attribution, exposure aggregation and hedge scenario modelling
              for multi-currency forward and option portfolios.
            </li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">Python</span>
            <span className="project-tag">SQL</span>
            <span className="project-tag">Bloomberg API</span>
            <span className="project-tag">Macrobond</span>
            <span className="project-tag">Streamlit</span>
            <span className="project-tag">Java</span>
            <span className="project-tag">JavaScript</span>
            <span className="project-tag">TypeScript</span>
            <span className="project-tag">Cypress</span>
            <span className="project-tag">Git</span>
            <span className="project-tag">Linux</span>
            <span className="project-tag">ServiceNow</span>
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="Automation Engineer (Graduate)"
          summary="Built enterprise automation across application development and cloud platform operations, improving reliability and reducing manual toil"
          buttonText="Click to reveal more details"
        >
          <h4>Enterprise Automation App</h4>
          <ul>
            <li>
              Designed and built an enterprise production application in JavaScript that streamlined release management
              activities, reducing operational toil, improving process efficiency, and decreasing overtime requirements
              for the release team.
            </li>
          </ul>
          <h4>Platform Automation &amp; Reliability</h4>
          <ul>
            <li>
              Supported enterprise application reliability by building automation for Kubernetes and OpenShift cluster
              maintenance across Sydney and Western Australia environments. Developed health-checking, update, and
              operational workflows using AWX, Ansible, and shell scripting to improve visibility across clusters, reduce
              manual platform maintenance, and help ensure business-critical applications had a stable cloud platform to
              run on.
            </li>
            <li>
              Built and managed CI/CD pipelines in Jenkins, configuring and maintaining automated build, test, and
              deployment workflows.
            </li>
            <li>
              Strengthened enterprise security and operational resilience by automating secure access and secret-renewal
              workflows, including Vault-based credential management and certificate authority integrations. Helped
              standardise infrastructure operations through repeatable deployment processes, GitOps practices, and Linux
              administration across production cloud environments.
            </li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">Kubernetes</span>
            <span className="project-tag">OpenShift</span>
            <span className="project-tag">AWX</span>
            <span className="project-tag">Ansible</span>
            <span className="project-tag">Jenkins</span>
            <span className="project-tag">Vault</span>
            <span className="project-tag">CI/CD</span>
            <span className="project-tag">Shell Scripting</span>
            <span className="project-tag">Git</span>
            <span className="project-tag">Linux</span>
            <span className="project-tag">SSL / CA</span>
            <span className="project-tag">JavaScript</span>
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="The Youth Network - Operations Lead"
          summary="The Youth Network (TYN) at Westpac Group is an Employee Action Group supporting employees aged 35 and under, focused on fostering personal and professional growth through networking events, mentoring programs, and development opportunities. It aims to empower young professionals, nurture future leaders, and encourage intergenerational collaboration within the organization."
          buttonText="Click to reveal more details"
        >
          <h4>Responsibilities</h4>
          <ul>
            <li>
              Mastered Microsoft Power Automate (MPA) to create workflow bots on Teams and email, enhancing social
              morale and productivity.
            </li>
            <li>
              Developed a task tracker tool for TYN, integrating Trello with Outlook calendar via MPA. Automated task
              assignments, due dates, and descriptions based on calendar entries, with seamless integration into
              Microsoft Teams.
            </li>
            <li>
              Showcased and enhanced public speaking skills during the TYN vs. Execs debate on &quot;Will AI Replace
              Executive Jobs?&quot; as the first speaker for the negative team.
            </li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">Microsoft Power Automate</span>
            <span className="project-tag">Trello</span>
            <span className="project-tag">Microsoft Teams</span>
            <span className="project-tag">Outlook Calendar</span>
          </div>
        </ExpandableItem>
      </div>
    </section>
  );
}

const BLOG_POSTS = [
  {
    slug: 'trading-engine',
    title: 'trading engine',
    date: 'June 2026',
    summary: '',
    tags: [],
    body: [],
  },
  {
    slug: 'honours-thesis',
    title: 'Honours Thesis',
    date: 'June 2026',
    summary: '',
    tags: [],
    body: [],
  },
  {
    slug: 'phone-first-ai-workflow',
    title: 'Building a Phone-First AI Development Workflow',
    date: 'June 2026',
    summary: 'How I combined a Raspberry Pi, Telegram, Tailscale, Claude Code, OpenClaw, Python, Bash, and GitHub pull requests to create a private AI-assisted development workflow that I can use from my phone.',
    tags: ['Raspberry Pi', 'AI-Assisted Engineering', 'Telegram', 'Tailscale', 'Claude Code', 'OpenClaw', 'Python', 'Bash', 'GitHub Automation'],
    body: [
      'I wanted a development workflow that was available even when I was away from my laptop. The result was a Raspberry Pi-based orchestration system that acts as an always-on remote execution environment.',
      'Telegram provides the command interface. From my phone, I can trigger scoped AI-assisted coding tasks, create safe feature branches, run repository-specific validation commands, open pull requests, and start private frontend previews.',
      'Python and Bash scripts form the automation backbone. Claude Code and OpenClaw perform scoped code changes, while the orchestration layer controls branch creation, testing, commits, pushes, and pull request creation. This separation keeps the AI worker focused on implementation while the surrounding system enforces the workflow.',
      'Tailscale provides a private network between my phone and the Raspberry Pi. This lets me open Vite/React branch previews without exposing development servers to the public internet.',
      'GitHub pull requests remain the final review boundary. AI can generate and iterate on changes, but I still inspect the diff, test the result, and decide whether to merge or reject the work.',
      'The project started as a convenient way to make portfolio UI changes remotely, but it has developed into a broader experiment in controlled AI-assisted engineering, mobile-first development, and human-in-the-loop automation.',
    ],
  },
];

function BlogPage() {
  return (
    <section id="blog-page" className="content-page">
      <div className="page-actions">
        <a href="#projects">Back to Projects and Experience</a>
      </div>
      <h2>Blog</h2>
      <div className="blog-list">
        {BLOG_POSTS.map((post) => (
          <a key={post.slug} href={`#/blog/${post.slug}`} className="blog-index-card" aria-label={`Read: ${post.title}`}>
            <h3 className="blog-index-card__title">{post.title}</h3>
            <p className="blog-index-card__meta">{post.date}</p>
            <p className="blog-index-card__summary">{post.summary}</p>
            {post.tags && (
              <div className="project-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

function BlogPostPage({ slug }) {
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <section id="blog-post-page" className="content-page">
        <div className="page-actions">
          <a href="#/blog">← Back to Blog</a>
        </div>
        <p>Post not found.</p>
      </section>
    );
  }

  return (
    <section id="blog-post-page" className="content-page">
      <div className="page-actions">
        <a href="#/blog">← Back to Blog</a>
      </div>
      <article className="blog-post">
        <h2>{post.title}</h2>
        <p className="blog-post__date">{post.date}</p>
        <p className="blog-post__summary">{post.summary}</p>
        <div className="blog-post__body">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        {post.tags && (
          <div className="project-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

function ExpandableItem({ title, summary, buttonText, children, variant }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <article className={`content-card content-card-${variant} ${expanded ? 'content-card-open' : ''}`}>
      <div className="content-card-header">
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
      <button
        className={`toggle-btn ${expanded ? 'toggle-btn-open' : ''}`}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span>{buttonText}</span>
        <span className="toggle-icon" aria-hidden="true" />
      </button>
      <div id={panelId} className={`hidden-content ${expanded ? 'hidden-content-open' : ''}`} hidden={!expanded}>
        {children}
      </div>
    </article>
  );
}

function ContactSection() {
  return (
    <section id="contact">
      <h2>Contact</h2>
      <p>
        Email: <a href="mailto:parmanandkharka@protonmail.com">parmanandkharka@protonmail.com</a>
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <p>&copy; 2025 Kish Kharka</p>
    </footer>
  );
}

export default App;
