import { useEffect, useId, useState } from 'react';
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
        <h2>Projects and Experience</h2>
        <div className="section-picker" aria-label="Projects and experience navigation">
          <ShatterCard label="Projects" href="#/projects" />
          <ShatterCard label="Experience" href="#/experience" />
        </div>
      </section>
      <ContactSection />
    </>
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
          title="Systematic Trading Algorithm"
          summary="A modular quantitative research and backtesting platform for testing systematic bond ETF allocation strategies using macro regimes, price signals, volatility/covariance models, scenario factories, SQLite persistence, and Streamlit analytics dashboards."
          buttonText="More details"
        >
          <p>
            Built a modular quantitative research platform for testing systematic asset-allocation strategies across bond
            ETFs, macroeconomic regimes, volatility models, and portfolio construction rules. The platform ingests market
            and macroeconomic data, computes price and macro signals, classifies economic/monetary regimes, generates
            allocation decisions, applies risk-aware sizing and constraints, persists scenario results to SQLite, and
            surfaces performance analytics through a Streamlit dashboard.
          </p>
          <p>Key highlights include:</p>
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
          <p>Link to see publicly available code and README:</p>
          <ul>
            <li>
              <a href="https://github.com/mega-Slaking/systematic_trading_model" target="_blank" rel="noreferrer">
                https://github.com/mega-Slaking/systematic_trading_model
              </a>
            </li>
          </ul>
        </ExpandableItem>

        <ExpandableItem
          variant="project"
          title="Honours Thesis"
          summary="Computational Modelling of the effects of Oriented External Electric Fields on Glycine"
          buttonText="View More Details"
        >
          <p>
            The project focused on simulating the behavior of glycine molecules under varying external electric fields. Key
            highlights include:
          </p>
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
              such as water, as seen in the gif below.
            </li>
            <li>
              Check this file out{' '}
              <a href={thesisPdf} target="_blank" rel="noreferrer">
                here
              </a>{' '}
              to view the methods used to create these predictive models.
            </li>
          </ul>

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
          <p>Highlights of my work in this role include:</p>
          <ul>
            <li>
              Data Analysis and Insights: Analyzed customer engagement data using Pandas and Matplotlib to investigate
              inconsistencies between Cartier&apos;s online and in-store traffic trends.
            </li>
            <li>
              Data Visualization: Created visual models to highlight key discrepancies, revealing that in-store jewelry zones
              had significantly higher traffic, while online data indicated watches as the most viewed category.
            </li>
            <li>
              Problem Identification: Identified a disconnect between online engagement trends and in-store customer behavior,
              providing actionable insights for boutique traffic management.
            </li>
            <li>
              Data-Driven Recommendations: Leveraged insights and research on the psychology of zoning to propose boutique
              rezoning strategies aimed at optimizing customer flow and increasing engagement with key product categories.
            </li>
          </ul>
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
          <p>Highlights of my work in this role include:</p>
          <ul>
            <li>
              Frontend Development: Built interactive and maintainable UIs using vanilla JavaScript and TypeScript with a
              strong emphasis on object-oriented design. Designed and refactored custom UI components using event-driven
              patterns and modular architecture without relying on external frameworks.
            </li>
            <li>
              Backend Development: Developed robust backend logic in Java to support real-time APIs and complex business
              rules. Applied principles of clean code, encapsulation, and service separation, especially in data
              transformation and entitlement logic.
            </li>
            <li>
              Database &amp; Query Optimization: Wrote and optimized SQL queries to support batch data processing, customer
              lookup, and pre-trade status tracking, with a focus on performance and clarity.
            </li>
            <li>
              Cross-Layer Integration: Engineered seamless interactions between UI components and backend services,
              managing session-aware logic, role-based filters, and dynamic API responses tailored to the user context.
            </li>
            <li>
              Data Engineering &amp; Search Optimization: Designed and optimized data pipelines and full-text search
              strategies to improve query performance and accuracy. Applied indexing, batch processing, and filtering
              techniques to enhance scalability and user experience across high-volume customer datasets.
            </li>
            <li>
              Performed Linux administration to handle system configurations, performance monitoring, and troubleshooting
              for robust and stable infrastructure environments.
            </li>
            <li>
              Testing &amp; Debugging: Used Cypress and JavaScript-based test harnesses to verify form behaviors, event
              flows, and data consistency. Performed structured debugging and regression testing to improve UI reliability.
            </li>
            <li>
              Version Control &amp; Collaboration: Worked with Git to manage feature branches, integrate with team
              repositories, and maintain clear version histories. Contributed to documentation and maintainable code
              practices.
            </li>
          </ul>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="Westpac Treasury - Data Analytics"
          summary="Delivered models, dashboards, and analytical outputs directly supporting Treasury funding strategy, issuance planning, and trading decisions"
          buttonText="Things I have done working here"
        >
          <p>Highlights of my work in this role include:</p>
          <ul>
            <li>
              Database Design &amp; Architecture: Designed and implemented normalized relational schemas (3NF) to support
              data ingestion, improving scalability
            </li>
            <li>
              Automation &amp; Monitoring Systems: Designed and developed an end-to-end monitoring application that tracks
              files, APIs, and application states to ensure continuous data and system integrity. Integrated automated
              incident creation and alerting workflows with SNow to proactively identify and resolve update or availability
              failures.
            </li>
            <li>
              Pipeline Architecture: Engineered a modular, event-driven pipeline connecting Bloomberg API &rarr; validation
              &rarr; normalized data store &rarr; analytics computation &rarr; frontend visualization. Applied separation of
              concerns to enable CI/CD integration and future extensibility.
            </li>
            <li>
              Backend Development: Designed and implemented modular Python systems for analytics and data quality checks.
              Developed analytics modules for different trading strategies.
            </li>
            <li>
              Designed and implemented bond spread and OIS-linked fixed-income trading strategy models, leveraging
              historical curve behaviour, free-float metrics, credit percentile projections, and regime-segmented regression
              analysis to evaluate relative-value opportunities in rates markets.
            </li>
            <li>Frontend Development: Developed Streamlit dashboards for stakeholders to take insight from for trading decisions</li>
          </ul>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="Westpac Graduate - DevOps Engineer"
          summary="Responsible for the automation of Kubernetes cluster healthchecks and updates on the OpenShift platform via AWX"
          buttonText="Things I have done working here"
        >
          <p>Highlights of my work in this role include:</p>
          <ul>
            <li>
              Automated Kubernetes cluster health checks and updates on the OpenShift platform via AWX, leveraging Ansible
              for streamlined operations.
            </li>
            <li>Built and managed Kubernetes clusters on OpenShift with a focus on scalability and efficiency.</li>
            <li>
              Managed CI/CD pipelines, configuring and maintaining automated build, test, and deployment workflows to ensure
              faster and more reliable software delivery.
            </li>
            <li>
              Developed advanced automation tools using AWX and Ansible to streamline cluster health monitoring, updates,
              and maintenance tasks, improving operational reliability and reducing manual intervention.
            </li>
            <li>
              Configured Certificate Authority (CA) integrations to securely log into clusters using SSL, ensuring secure
              access and communication.
            </li>
            <li>
              Performed Linux administration to handle system configurations, performance monitoring, and troubleshooting
              for robust and stable infrastructure environments.
            </li>
            <li>
              Created and optimized shell scripts for process automation, cluster management, log analysis, and task
              execution across multiple servers.
            </li>
            <li>
              Developed playbooks to prompt for variables and credentials for secure deployments, integrating dynamic
              configurations for efficient AWX job templates.
            </li>
            <li>Maintained repository synchronization, branch management, and GitOps workflows for infrastructure as code practices.</li>
          </ul>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="Westpac Graduate - Software Engineer"
          summary="Created an SRE application in ServiceNow to reduce toil in the Service Management space"
          buttonText="Things I have done working here"
        >
          <p>Highlights of my work in this role include:</p>
          <ul>
            <li>
              Developed a centralized form in ServiceNow for submitting artifact details, eliminating manual email
              submissions. The form features interactive fields, mandatory inputs, and tooltips for user guidance.
            </li>
            <li>
              Automated the updating of description fields based on submitted artifacts, linked to JIRA IDs/change numbers,
              and ensured proper documentation via JavaScript in ServiceNow.
            </li>
            <li>
              Implemented automatic communication emails to stakeholders upon request resolution, formatted appropriately
              using JavaScript in ServiceNow.
            </li>
            <li>
              Enhanced user experience and workflow efficiency by integrating UI policies, client scripts, server scripts,
              business rules, variable sets, flows, and script actions using ServiceNow Studio tools and Flow Designer.
            </li>
            <li>Published multiple documentations on Confluence detailing ServiceNow development processes and application functionalities.</li>
          </ul>
        </ExpandableItem>

        <ExpandableItem
          variant="timeline"
          title="The Youth Network - Operations Lead"
          summary="The Youth Network (TYN) at Westpac Group is an Employee Action Group supporting employees aged 35 and under, focused on fostering personal and professional growth through networking events, mentoring programs, and development opportunities. It aims to empower young professionals, nurture future leaders, and encourage intergenerational collaboration within the organization."
          buttonText="Things I have done working here"
        >
          <p>Highlights of my work in this role include:</p>
          <ul>
            <li>
              Mastered Microsoft Power Automate (MPA) to create workflow bots on Teams and email, enhancing social morale
              and productivity.
            </li>
            <li>
              Developed a task tracker tool for TYN, integrating Trello with Outlook calendar via MPA. Automated task
              assignments, due dates, and descriptions based on calendar entries, with seamless integration into Microsoft
              Teams.
            </li>
            <li>
              Showcased and enhanced public speaking skills during the TYN vs. Execs debate on &quot;Will AI Replace Executive
              Jobs?&quot; as the first speaker for the negative team.
            </li>
          </ul>
        </ExpandableItem>
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
        Email: <a href="mailto:kish.kharka@westpac.com.au">kish.kharka@westpac.com.au</a>
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
