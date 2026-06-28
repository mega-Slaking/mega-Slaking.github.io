import { Fragment, useEffect, useId, useRef, useState } from 'react';
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
        <OrbitNav />
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

function OrbitNav() {
  const [selected, setSelected] = useState(0);
  const touchStartRef = useRef(null);
  const n = NAV_ITEMS.length;

  const go = (dir) => setSelected((s) => (s + dir + n) % n);

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
    // Require a mostly-horizontal swipe past a threshold
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  // Position relative to the selected card: centre, or peripheral left/right
  const slotClass = (idx) => {
    const rel = (idx - selected + n) % n;
    if (rel === 0) return 'is-center';
    if (rel === 1) return 'is-right';
    return 'is-left';
  };

  return (
    <div className="orbit">
      <button className="orbit-arrow" onClick={() => go(-1)} aria-label="Previous" type="button">
        ‹
      </button>
      <div
        className="orbit-stage"
        role="group"
        aria-label="Projects, experience, and blog navigation"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="orbit-photo">
          <img src={profileImage} alt="Kish Kharka" />
        </div>
        <div className="orbit-ring">
          {NAV_ITEMS.map((item, idx) => (
            <div key={item.label} className={`orbit-slot ${slotClass(idx)}`}>
              <ShatterCard label={item.label} href={item.href} className="orbit-card" />
            </div>
          ))}
        </div>
      </div>
      <button className="orbit-arrow" onClick={() => go(1)} aria-label="Next" type="button">
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
            I am a science-trained technologist with a First Class Honours background in Physics and Chemistry from the
            University of Sydney, focused on building data, analytics, and automation systems for financial markets. My
            work spans predictive analytics, front-office tooling, infrastructure automation, and decision-support
            applications across trading, hedging, CRM, and enterprise technology environments.
          </p>
          <p>
            I am working toward becoming a quantitative researcher, combining my background in scientific problem-solving
            with software engineering, market data pipelines, systematic strategy research, and financial modelling.
          </p>
        </div>
      </div>
    </section>
  );
}

// Projects render as uniform preview cards; clicking one swaps the grid for an
// in-page detail view via local state (no routing) so navigation stays self-
// contained. A highlight may be a plain string or a { term, text } labelled point.
const PROJECTS = [
  {
    slug: 'systematic-trading-platform',
    title: 'Systematic Quantitative Research & Backtesting Platform',
    flagship: true,
    category: 'Quantitative Research',
    year: '',
    impact:
      'A full-stack research platform for designing, testing, and analysing systematic bond ETF allocation strategies across macro regimes, volatility models, and risk-aware portfolio construction.',
    tags: ['Python', 'SQLite', 'Streamlit', 'FastAPI', 'React', 'C++ / pybind11', 'EWMA', 'GARCH', 'FRED'],
    sections: [
      {
        heading: 'Overview',
        paragraphs: [
          'Systematic strategy research becomes unreliable when data ingestion, signal logic, portfolio construction, performance analysis, and experiment tracking are handled through disconnected scripts or ad hoc notebooks. I built this platform to solve that problem: an end-to-end research environment that transforms raw market and macroeconomic data into reproducible strategy decisions, backtest results, diagnostics, and interactive analytics.',
          'The platform functions as a small quantitative research lab for testing market hypotheses, comparing strategy assumptions, and analysing how systematic allocation rules behave across changing macro and market environments. It focuses on bond ETF rotation across TLT, AGG, and SHY, using macroeconomic conditions, price momentum, volatility estimates, covariance models, and portfolio constraints to evaluate how a strategy should rotate across duration exposure in different regimes.',
          'The core research question was: can macro and market signals be converted into a disciplined, repeatable allocation process rather than a collection of discretionary observations? Answering that required more than calculating returns. The system needed to show why each allocation was made, how decisions changed across regimes, how transaction costs and turnover affected performance, and whether different volatility and covariance assumptions materially changed the portfolio outcome.',
        ],
      },
      {
        heading: 'Platform Architecture',
        paragraphs: [
          'The Python research engine handles data ingestion, signal generation, regime classification, portfolio construction, cost modelling, and scenario execution. A FastAPI backend exposes research runs, scenario outputs, analytics, and stored results through a clean API layer. A React frontend provides an interactive interface for exploring strategy behaviour, comparing scenarios, inspecting allocations, and interpreting performance diagnostics.',
          'Backtest outputs, decision traces, costs, turnover, regime labels, NAV series, scenario metadata, and performance analytics are persisted to SQLite, creating a reproducible experiment-tracking layer for comparing research assumptions over time.',
        ],
      },
      {
        heading: 'Key Contributions',
        bullets: [
          'Built a decision-centric backtesting engine that traces the full path from raw data to final portfolio allocation, covering signal generation, regime classification, base allocation, volatility-aware sizing, portfolio constraints, turnover, transaction costs, and NAV calculation.',
          'Designed a modular strategy architecture supporting systematic experimentation across macro logic, price signals, rolling/EWMA/GARCH volatility models, sample and EWMA covariance scaling, conviction weighting, and portfolio volatility targeting.',
          'Developed a FastAPI backend to expose backtest runs, scenario metadata, analytics outputs, decision traces, and portfolio diagnostics through structured API endpoints, separating the research engine from the user-facing application layer.',
          'Built a React frontend that separates strategy exploration from the research engine, allowing scenario comparison, allocation inspection, and performance diagnostics without re-running backtests.',
          'Implemented reproducible scenario factories that persist backtest results, regime labels, decision traces, costs, turnover, NAV, and analytics outputs to SQLite, creating an experiment-tracking system rather than relying on one-off notebook outputs.',
          'Added explainability through allocation traces and regime summaries, allowing each portfolio decision to be inspected in terms of the macro, price, volatility, covariance, and constraint logic that produced it.',
          'Built analytics and tearsheet functionality covering NAV comparison, return analysis, drawdowns, Sharpe, Sortino, Calmar, VaR, CVaR, turnover, cost drag, benchmark comparison, exposure inspection, regime performance, and ETF price analysis.',
          'Optimised expensive covariance and repeated scenario-testing workflows using C++/pybind11, precomputed return views, and caching, improving performance for iterative research and parameter sweeps.',
          'Refactored macro data handling to store raw FRED series while computing derived indicators at runtime, improving data lineage, reproducibility, and flexibility when testing alternative feature definitions.',
        ],
      },
    ],
    media: [],
    links: [
      {
        label: 'View source code & README ↗',
        href: 'https://github.com/mega-Slaking/systematic_trading_model',
      },
    ],
  },
  {
    slug: 'honours-thesis',
    title: 'Honours Thesis',
    flagship: false,
    category: 'Computational Chemistry',
    year: '',
    impact:
      "Computational modelling of the effects of oriented external electric fields on glycine, including the first full 24-dimensional potential-energy model for a molecule larger than three atoms.",
    tags: ['Python', 'Shepard Interpolation', 'Potential Energy Surfaces', 'Rotation Matrices'],
    sections: [
      {
        heading: 'The Problem',
        paragraphs: [
          "Quantum-chemistry calculations describe a molecule's energy and charge distribution one geometry at a time, in a vacuum. But real molecules live inside electric fields, such as those in enzyme active sites, solvents, and charged interfaces, and those fields reshape molecular conformation and can drive reactions such as proton transfer. Characterising that response by brute force is intractable: every new field direction and magnitude would demand re-running expensive electronic-structure calculations across a configuration space with dozens of degrees of freedom. The field of oriented-external-field (OEEF) chemistry lacked a tractable, general way to model this.",
        ],
      },
      {
        heading: 'The Approach',
        paragraphs: [
          'I reframed the problem as a surrogate-modelling task built on a first-order linear-response expansion, V(E) ≈ V₀ − μ·E. This decouples an otherwise coupled problem: build two geometry-dependent surfaces once, the zero-field potential-energy surface (PES) and the dipole-moment surface (DMS), and the effect of any field direction or strength collapses to a cheap analytic evaluation, with no further quantum chemistry required.',
        ],
        bullets: [
          'Generated the training data from 1,369 constrained geometry optimisations (HF/6-31+G(d,p)) on a 36×36 dihedral-angle grid, orchestrated as batch jobs on the NCI Gadi supercomputer via a Python/Fortran pipeline.',
          'Implemented modified Shepard interpolation, scattered-data interpolation using distance-weighted local Taylor expansions, to reconstruct the surfaces from sampled geometries. Built both zeroth- and first-order (derivative-corrected) variants, in C++ and Fortran, with analytic and numerical first/second-order derivatives.',
          'Calibrated the model by sweeping the inverse-distance weighting exponent p and benchmarking zeroth- vs. first-order expansions against held-out data, training on 324 geometries and validating on 1,045 unseen points.',
          'Scaled from a 2-D proof of concept to full dimensionality: a 24-dimensional PES and a 30-dimensional Cartesian DMS, with rotation-matrix standardisation of molecular orientation and permutational symmetry exploited to extend the effective dataset.',
        ],
      },
      {
        heading: 'The Outcome',
        bullets: [
          'First-order interpolation cut out-of-sample RMSE by ~30% across all dipole components versus the zeroth-order baseline; the full-dimensional PES reproduced exact quantum energies to < 0.3 kJ/mol.',
          'Delivered the first full-dimensional dipole-moment surface for a molecule as large as glycine (10 atoms, 30 Cartesian dimensions), extending a method previously demonstrated only on triatomics.',
          'Quantified a controllable physical effect: a field aligned with the proton-transfer reaction axis stabilises the reactive (zwitterionic) conformation by ~70 kJ/mol, while a reversed field suppresses it, a proof of concept for field-driven control of molecular reactivity.',
          "Validated against known physiology: the model correctly recovers the stabilisation of glycine's zwitterionic form in high-field environments such as water and enzyme active sites.",
        ],
      },
      {
        heading: 'What It Demonstrates',
        paragraphs: [
          'End-to-end quantitative modelling: framing an intractable simulation problem as a tractable surrogate, building and calibrating high-dimensional interpolation models, rigorous train/validation methodology, and a multi-language numerical pipeline (Python, C++, Fortran) running at HPC scale.',
        ],
      },
    ],
    media: [
      { src: yFieldGif, alt: 'Application of y-electric field' },
      { src: xFieldGif, alt: 'Application of x-electric field' },
      { src: zFieldGif, alt: 'Application of z-electric field' },
      { src: yzFieldGif, alt: 'Application of yz-electric field' },
      { src: waterGif, alt: 'Modelling Glycine in water' },
    ],
    links: [{ label: 'View the thesis methods (PDF)', href: thesisPdf }],
  },
  {
    slug: 'raspberry-pi-ai-orchestrator',
    title: 'Raspberry Pi Agentic Development Orchestrator',
    flagship: false,
    category: 'AI Infrastructure',
    year: '',
    impact:
      'A private AI-assisted development orchestration platform for running controlled agentic coding workflows from a Raspberry Pi, with Telegram-based task control, GitHub pull-request boundaries, Tailscale previews, validation gates, and operational guardrails.',
    tags: ['Raspberry Pi', 'Python', 'Bash', 'Telegram', 'Tailscale', 'GitHub', 'Claude Code', 'OpenClaw'],
    sections: [
      {
        heading: 'Overview',
        paragraphs: [
          'Agentic coding tools are powerful, but they introduce a different class of engineering risk from ordinary automation. An agent may edit the wrong files, loop unnecessarily, exceed cost limits, touch secrets, modify protected branches, skip validation, or produce changes that are difficult to review. Rather than treating AI as an unrestricted coding assistant, this project treats it as a worker inside a governed delivery pipeline, and builds the infrastructure to make that practical.',
          'The system runs on a Raspberry Pi as a lightweight private development server, connected to Telegram, GitHub, Tailscale, Claude Code, OpenClaw, Python, and Bash automation. From a phone, I can trigger scoped coding tasks that create isolated feature branches, run AI-assisted code changes, execute validation steps, generate pull requests, and expose private frontend previews, without opening local development services to the public internet.',
        ],
      },
      {
        heading: 'Platform Architecture',
        paragraphs: [
          'The Raspberry Pi acts as the orchestration host. Telegram provides the phone-first control interface, while Python and Bash scripts coordinate repository selection, branch creation, task execution, validation, pull request creation, and preview management.',
          'Claude Code and OpenClaw operate as coding agents within the workflow, but they do not own the delivery boundary. GitHub remains the review and integration layer, Tailscale provides private network access for frontend previews, and the orchestrator enforces operational controls around task execution, branch safety, cost exposure, and human approval before any changes are merged.',
        ],
      },
      {
        heading: 'Key Contributions',
        bullets: [
          'Designed the core orchestration model: AI agents perform scoped coding work inside controlled task envelopes, but cannot independently plan across repositories, modify protected branches, access sensitive files, or bypass the pull-request review boundary.',
          'Implemented a phone-first control interface via Telegram, separating task dispatch from code execution and keeping agents constrained to repository-specific execution paths.',
          'Built guardrails for agentic loops: repository allowlists, branch isolation, dirty-working-tree checks, sensitive-file protections, execution timeouts, kill switches, cost controls, and prompt guardrails.',
          'Integrated Tailscale to privately preview Vite/React frontend changes from a phone without exposing local development servers to the public internet.',
          'Created a prototype framework for human-in-the-loop agentic software delivery, where AI agents perform useful development work but merge, deployment, and review authority remain with the engineer.',
        ],
      },
      {
        heading: 'What It Demonstrates',
        paragraphs: [
          'Agentic coding systems need orchestration, not just prompts. This project demonstrates an understanding of the infrastructure required to make AI-assisted development safe, observable, and reviewable, combining private infrastructure, Git workflow controls, validation gates, network isolation, and human review boundaries to integrate AI agents into real software delivery without giving up engineering discipline.',
        ],
      },
    ],
    media: [],
    links: [{ label: 'Related write-up: Building a Phone-First AI Development Workflow', href: '#/blog/phone-first-ai-workflow' }],
  },
  {
    slug: 'cartier-data-analysis',
    title: 'Cartier Data Analysis Project',
    flagship: false,
    category: 'Data Analysis',
    year: '',
    impact:
      "An interdisciplinary team project analysing Cartier's online vs in-store traffic to recommend boutique re-zoning strategies that improve customer flow.",
    tags: ['Python', 'Pandas', 'Matplotlib'],
    overview: '',
    highlights: [
      {
        term: 'Data Analysis and Insights',
        text: "Analyzed customer engagement data using Pandas and Matplotlib to investigate inconsistencies between Cartier's online and in-store traffic trends.",
      },
      {
        term: 'Data Visualization',
        text: 'Created visual models to highlight key discrepancies, revealing that in-store jewelry zones had significantly higher traffic, while online data indicated watches as the most viewed category.',
      },
      {
        term: 'Problem Identification',
        text: 'Identified a disconnect between online engagement trends and in-store customer behavior, providing actionable insights for boutique traffic management.',
      },
      {
        term: 'Data-Driven Recommendations',
        text: 'Leveraged insights and research on the psychology of zoning to propose boutique rezoning strategies aimed at optimizing customer flow and increasing engagement with key product categories.',
      },
    ],
    media: [],
    links: [],
  },
];

function ProjectMeta({ project }) {
  return (
    <div className="project-meta">
      {project.flagship ? <span className="project-flag">Flagship</span> : null}
      <span className="project-category">{project.category}</span>
      {project.year ? <span className="project-year">{project.year}</span> : null}
    </div>
  );
}

function ProjectHighlight({ item }) {
  if (typeof item === 'string') {
    return <li>{item}</li>;
  }

  return (
    <li>
      <strong>{item.term}:</strong> {item.text}
    </li>
  );
}

function ProjectDetail({ project }) {
  return (
    <article className="project-detail">
      <ProjectMeta project={project} />
      <h2>{project.title}</h2>
      <p className="project-detail__lead">{project.impact}</p>

      {project.links?.length ? (
        <div className="project-detail__actions">
          {project.links.map((link) =>
            link.href.startsWith('http') ? (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ) : (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ),
          )}
        </div>
      ) : null}

      {project.sections?.length
        ? project.sections.map((section, i) => (
            <Fragment key={i}>
              <h4>{section.heading}</h4>
              {section.paragraphs?.map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((item, j) => (
                    <ProjectHighlight key={j} item={item} />
                  ))}
                </ul>
              ) : null}
            </Fragment>
          ))
        : (
          <>
            {project.overview ? (
              <>
                <h4>Overview</h4>
                <p>{project.overview}</p>
              </>
            ) : null}

            {project.highlights?.length ? (
              <>
                <h4>Key Highlights</h4>
                <ul>
                  {project.highlights.map((item, i) => (
                    <ProjectHighlight key={i} item={item} />
                  ))}
                </ul>
              </>
            ) : null}
          </>
        )}

      {project.media?.length ? (
        <>
          <h4>Visualisations</h4>
          <div className="project-media-grid">
            {project.media.map((m) => (
              <img key={m.alt} src={m.src} alt={m.alt} className="project-gif" />
            ))}
          </div>
        </>
      ) : null}

      {project.tags?.length ? (
        <>
          <h4>Technologies</h4>
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
        </>
      ) : null}
    </article>
  );
}

function ProjectsPage() {
  const [openSlug, setOpenSlug] = useState(null);
  const openProject = openSlug ? PROJECTS.find((p) => p.slug === openSlug) : null;

  const openDetail = (slug) => {
    setOpenSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="projects-page" className="content-page">
      <div className="page-actions">
        {openProject ? (
          <button type="button" className="project-back" onClick={() => setOpenSlug(null)}>
            ← Back to Projects
          </button>
        ) : (
          <a href="#projects">← Back to Home</a>
        )}
      </div>

      {openProject ? (
        <ProjectDetail project={openProject} />
      ) : (
        <>
          <h2>Projects</h2>
          <div className="project-grid">
            {PROJECTS.map((project) => (
              <button
                key={project.slug}
                type="button"
                className={`project-card ${project.flagship ? 'project-card--flagship' : ''}`}
                onClick={() => openDetail(project.slug)}
                aria-label={`View project: ${project.title}`}
              >
                <ProjectMeta project={project} />
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__impact">{project.impact}</p>
                <div className="project-tags project-card__tags">
                  {project.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                  {project.tags.length > 5 ? (
                    <span className="project-tag project-tag--more">+{project.tags.length - 5}</span>
                  ) : null}
                </div>
                <span className="project-card__cta">View project →</span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ExperiencePage() {
  return (
    <section id="experience-page" className="content-page">
      <div className="page-actions">
        <a href="#projects">← Back to Home</a>
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
        <a href="#projects">← Back to Home</a>
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
      <div className="contact-links">
        <a
          className="contact-icon"
          href="mailto:parmanandkharka@protonmail.com"
          aria-label="Email Kish Kharka"
          title="parmanandkharka@protonmail.com"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 6L2 7" />
          </svg>
        </a>
        <a
          className="contact-icon"
          href="https://github.com/mega-Slaking"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile (opens in a new tab)"
          title="github.com/mega-Slaking"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
      </div>
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
