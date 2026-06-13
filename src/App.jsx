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
  if (window.location.hash === '#/projects') {
    return 'projects';
  }

  if (window.location.hash === '#/experience') {
    return 'experience';
  }

  if (window.location.hash === '#/blog') {
    return 'blog';
  }

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
      <div className="carousel-track">
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
          title="Westpac - Full-Stack Engineer (Financial Markets)"
          summary="Delivery of various requirements from Financial Markets Traders and Directors"
          buttonText="Things I have done working here"
        >
          <h4>Frontend Development</h4>
          <ul>
            <li>
              Built interactive and maintainable UIs using vanilla JavaScript and TypeScript with a strong emphasis on
              object-oriented design. Designed and refactored custom UI components using event-driven patterns and modular
              architecture without relying on external frameworks.
            </li>
          </ul>
          <h4>Backend Development</h4>
          <ul>
            <li>
              Developed robust backend logic in Java to support real-time APIs and complex business rules. Applied
              principles of clean code, encapsulation, and service separation, especially in data transformation and
              entitlement logic.
            </li>
          </ul>
          <h4>Database &amp; Data Engineering</h4>
          <ul>
            <li>
              Wrote and optimized SQL queries to support batch data processing, customer lookup, and pre-trade status
              tracking, with a focus on performance and clarity.
            </li>
            <li>
              Designed and optimized data pipelines and full-text search strategies to improve query performance and
              accuracy. Applied indexing, batch processing, and filtering techniques to enhance scalability and user
              experience across high-volume customer datasets.
            </li>
          </ul>
          <h4>Integration &amp; Infrastructure</h4>
          <ul>
            <li>
              Engineered seamless interactions between UI components and backend services, managing session-aware logic,
              role-based filters, and dynamic API responses tailored to the user context.
            </li>
            <li>
              Performed Linux administration to handle system configurations, performance monitoring, and troubleshooting
              for robust and stable infrastructure environments.
            </li>
          </ul>
          <h4>Testing &amp; Delivery</h4>
          <ul>
            <li>
              Used Cypress and JavaScript-based test harnesses to verify form behaviors, event flows, and data
              consistency. Performed structured debugging and regression testing to improve UI reliability.
            </li>
            <li>
              Worked with Git to manage feature branches, integrate with team repositories, and maintain clear version
              histories. Contributed to documentation and maintainable code practices.
            </li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">JavaScript</span>
            <span className="project-tag">TypeScript</span>
            <span className="project-tag">Java</span>
            <span className="project-tag">SQL</span>
            <span className="project-tag">Cypress</span>
            <span className="project-tag">Git</span>
            <span className="project-tag">Linux</span>
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="Westpac Treasury - Data Analytics"
          summary="Delivered models, dashboards, and analytical outputs directly supporting Treasury funding strategy, issuance planning, and trading decisions"
          buttonText="Things I have done working here"
        >
          <h4>Data Architecture &amp; Pipelines</h4>
          <ul>
            <li>
              Designed and implemented normalized relational schemas (3NF) to support data ingestion, improving
              scalability.
            </li>
            <li>
              Engineered a modular, event-driven pipeline connecting Bloomberg API &rarr; validation &rarr; normalized
              data store &rarr; analytics computation &rarr; frontend visualization. Applied separation of concerns to
              enable CI/CD integration and future extensibility.
            </li>
          </ul>
          <h4>Automation &amp; Monitoring</h4>
          <ul>
            <li>
              Designed and developed an end-to-end monitoring application that tracks files, APIs, and application states
              to ensure continuous data and system integrity. Integrated automated incident creation and alerting
              workflows with SNow to proactively identify and resolve update or availability failures.
            </li>
          </ul>
          <h4>Analytics &amp; Trading Models</h4>
          <ul>
            <li>
              Designed and implemented modular Python systems for analytics and data quality checks. Developed analytics
              modules for different trading strategies.
            </li>
            <li>
              Designed and implemented bond spread and OIS-linked fixed-income trading strategy models, leveraging
              historical curve behaviour, free-float metrics, credit percentile projections, and regime-segmented
              regression analysis to evaluate relative-value opportunities in rates markets.
            </li>
          </ul>
          <h4>Frontend &amp; Visualization</h4>
          <ul>
            <li>Developed Streamlit dashboards for stakeholders to take insight from for trading decisions.</li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">Python</span>
            <span className="project-tag">SQL</span>
            <span className="project-tag">Bloomberg API</span>
            <span className="project-tag">Streamlit</span>
            <span className="project-tag">ServiceNow</span>
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="Westpac Graduate - DevOps Engineer"
          summary="Responsible for the automation of Kubernetes cluster healthchecks and updates on the OpenShift platform via AWX"
          buttonText="Things I have done working here"
        >
          <h4>Kubernetes &amp; Infrastructure</h4>
          <ul>
            <li>
              Automated Kubernetes cluster health checks and updates on the OpenShift platform via AWX, leveraging
              Ansible for streamlined operations.
            </li>
            <li>Built and managed Kubernetes clusters on OpenShift with a focus on scalability and efficiency.</li>
            <li>
              Performed Linux administration to handle system configurations, performance monitoring, and troubleshooting
              for robust and stable infrastructure environments.
            </li>
          </ul>
          <h4>Automation &amp; CI/CD</h4>
          <ul>
            <li>
              Managed CI/CD pipelines, configuring and maintaining automated build, test, and deployment workflows to
              ensure faster and more reliable software delivery.
            </li>
            <li>
              Developed advanced automation tools using AWX and Ansible to streamline cluster health monitoring, updates,
              and maintenance tasks, improving operational reliability and reducing manual intervention.
            </li>
            <li>
              Created and optimized shell scripts for process automation, cluster management, log analysis, and task
              execution across multiple servers.
            </li>
            <li>
              Developed playbooks to prompt for variables and credentials for secure deployments, integrating dynamic
              configurations for efficient AWX job templates.
            </li>
          </ul>
          <h4>Security &amp; GitOps</h4>
          <ul>
            <li>
              Configured Certificate Authority (CA) integrations to securely log into clusters using SSL, ensuring
              secure access and communication.
            </li>
            <li>
              Maintained repository synchronization, branch management, and GitOps workflows for infrastructure as code
              practices.
            </li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">Kubernetes</span>
            <span className="project-tag">OpenShift</span>
            <span className="project-tag">AWX</span>
            <span className="project-tag">Ansible</span>
            <span className="project-tag">CI/CD</span>
            <span className="project-tag">Shell Scripting</span>
            <span className="project-tag">Git</span>
            <span className="project-tag">Linux</span>
            <span className="project-tag">SSL / CA</span>
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="Westpac Graduate - Software Engineer"
          summary="Created an SRE application in ServiceNow to reduce toil in the Service Management space"
          buttonText="Things I have done working here"
        >
          <h4>Responsibilities</h4>
          <ul>
            <li>
              Developed a centralized form in ServiceNow for submitting artifact details, eliminating manual email
              submissions. The form features interactive fields, mandatory inputs, and tooltips for user guidance.
            </li>
            <li>
              Automated the updating of description fields based on submitted artifacts, linked to JIRA IDs/change
              numbers, and ensured proper documentation via JavaScript in ServiceNow.
            </li>
            <li>
              Implemented automatic communication emails to stakeholders upon request resolution, formatted appropriately
              using JavaScript in ServiceNow.
            </li>
            <li>
              Enhanced user experience and workflow efficiency by integrating UI policies, client scripts, server
              scripts, business rules, variable sets, flows, and script actions using ServiceNow Studio tools and Flow
              Designer.
            </li>
            <li>
              Published multiple documentations on Confluence detailing ServiceNow development processes and application
              functionalities.
            </li>
          </ul>
          <h4>Technologies</h4>
          <div className="project-tags">
            <span className="project-tag">ServiceNow</span>
            <span className="project-tag">JavaScript</span>
            <span className="project-tag">Flow Designer</span>
            <span className="project-tag">JIRA</span>
            <span className="project-tag">Confluence</span>
          </div>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="The Youth Network - Operations Lead"
          summary="The Youth Network (TYN) at Westpac Group is an Employee Action Group supporting employees aged 35 and under, focused on fostering personal and professional growth through networking events, mentoring programs, and development opportunities. It aims to empower young professionals, nurture future leaders, and encourage intergenerational collaboration within the organization."
          buttonText="Things I have done working here"
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
          <ExpandableItem
            key={post.slug}
            variant="blog"
            title={post.title}
            summary={`${post.date} — ${post.summary}`}
            buttonText="Read post"
          >
            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <div className="project-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>
          </ExpandableItem>
        ))}
      </div>
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
