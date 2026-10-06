"use client";

import { FormEvent, useState } from "react";
import {
  getCountryCallingCode,
  type CountryCode
} from "libphonenumber-js";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CloudCog,
  Gauge,
  Link2,
  ListChecks,
  Menu,
  MessageSquareText,
  Network,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Zap
} from "lucide-react";

import { countries } from "./countries";

import {
  NetworkIcon,
  WorkflowIcon,
  CalendarIcon
} from "./icons";

const benefits = [
  {
    icon: NetworkIcon,
    title: "Centralize room and rate mappings",
    copy: "Keep PMS room types, rate plans and channel identifiers organized in one workspace."
  },
  {
    icon: CalendarIcon,
    title: "Manage availability with fewer conflicts",
    copy: "Review property inventory and stay dates before channel reservations enter daily operations."
  },
  {
    icon: WorkflowIcon,
    title: "Connect bookings to your PMS workflow",
    copy: "Move reservations into guest, front desk, invoicing and activity-record processes."
  }
];

const resources = [
  {
    eyebrow: "CHANNEL SETUP",
    title: "A practical guide to room and rate mapping",
    copy: "Structure room types and rate plans before connecting a distribution channel.",
    icon: Link2
  },
  {
    eyebrow: "HOTEL OPERATIONS",
    title: "How channel bookings move through DMS Desk",
    copy: "Follow a reservation from channel delivery to the front desk, invoice and audit trail.",
    icon: ListChecks
  }
];

const footerColumns = [
  { title: "Platform", links: ["Dashboard", "Front Desk", "Reservations", "Rooms & Rates"] },
  { title: "Operations", links: ["Housekeeping", "Night Audit", "Financials", "Reports"] },
  { title: "Distribution", links: ["Channel Manager", "Travel Agents", "Booking Engine"] },
  { title: "Company", links: ["About", "Contact", "Request Demo", "Sign in"] }
];

export default function ChannelManagerLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [country, setCountry] = useState<CountryCode>("LK");
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("LK");

  function submitDemoRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const storageKey = "dms-desk:landing:demo-requests";
      const current = JSON.parse(localStorage.getItem(storageKey) || "[]") as unknown[];
      localStorage.setItem(storageKey, JSON.stringify([...current, { ...payload, createdAt: new Date().toISOString() }]));
    } catch {
      // The success state still confirms the UI flow when browser storage is unavailable.
    }

    form.reset();
    setCountry("LK");
    setPhoneCountry("LK");
    setSubmitted(true);
  }

  return (
    <main className="siteShell">
      <header className="siteHeader">
        <div className="headerInner">
          <BrandLockup />

          <nav className={`mainNav ${menuOpen ? "mainNavOpen" : ""}`} aria-label="Primary navigation">
            <a href="#platform">Platform</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#resources">Resources</a>
          </nav>

          <div className="headerActions">
            <a className="textLink" href="/login">Sign in</a>
            <a className="primaryButton headerCta" href="#request-demo">Request a demo</a>
            <button
              className="menuButton"
              type="button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <section className="hero section referenceHero" id="top">
        <img
          className="hotelHeroBackground"
          src="/assets/hotel-room-hero-v2.png"
          alt=""
          aria-hidden="true"
        />
        <div className="heroCopy">

          <span className="eyebrow"></span>
          {/* <span className="eyebrow"><Layers3 /> Channel management</span> */}
          <h1>DMS Desk<br />Channel <br /> Management</h1>
          <p className="heroLead">Keep channel operations connected to your hotel&apos;s rooms, rates and reservation workflow.</p>
          <p className="heroSupport">Map distribution settings, review inventory activity and bring channel reservations into the same workspace your team uses every day.</p>
          <div className="heroPoints">
            <span><Check /> Property-aware setup</span>
            <span><Check /> PMS-connected workflow</span>
            <span><Check /> Built for independent hotels</span>
          </div>
        </div>

        <HeroChannelWorkspace />
        <form className="demoForm" id="request-demo" onSubmit={submitDemoRequest}>
          <div className="connectFormHeading"><h2>Connect your property</h2><p>Tell us a little about your hotel business.</p></div>
          <div className="formGrid">
            <label>
              <span className="srOnly">First name</span>
              <input name="firstName" required autoComplete="given-name" placeholder="First Name*" />
            </label>
            <label>
              <span className="srOnly">Last name</span>
              <input name="lastName" required autoComplete="family-name" placeholder="Last Name*" />
            </label>
            <label className="formWide">
              <span className="srOnly">Business email</span>
              <input name="email" required type="email" autoComplete="email" placeholder="Business Email*" />
            </label>
            <label className="formWide">
              <span className="srOnly">Company or hotel name</span>
              <input name="propertyName" required autoComplete="organization" placeholder="Company/Hotel Name*" />
            </label>
            <label className="floatingSelect propertyCountryField">
              <span>Country*</span>
              <select
                name="country"
                required
                value={country}
                onChange={(event) => {
                  const nextCountry = event.target.value as CountryCode;
                  setCountry(nextCountry);
                  setPhoneCountry(nextCountry);
                  setSubmitted(false);
                }}
              >
                {countries.map((option) => (
                  <option key={option.code} value={option.code}>{option.name}</option>
                ))}
              </select>
              <input
                type="hidden"
                name="countryName"
                value={countries.find((option) => option.code === country)?.name || country}
              />
            </label>

            <div className="formWide phoneRow">
              <label className="floatingSelect phoneCountrySelect">
                <span>Calling code*</span>
                <select
                  name="phoneCountry"
                  aria-label="Phone country and calling code"
                  value={phoneCountry}
                  onChange={(event) => setPhoneCountry(event.target.value as CountryCode)}
                >
                  {countries.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name} (+{getCountryCallingCode(option.code)})
                    </option>
                  ))}
                </select>
              </label>
              <label className="phoneNumberField">
                <span>Phone number*</span>
                <span className="phonePrefix">+{getCountryCallingCode(phoneCountry)}</span>
                <input
                  name="phoneNumber"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  aria-label="Phone number"
                />
                <input type="hidden" name="phoneCallingCode" value={`+${getCountryCallingCode(phoneCountry)}`} />
              </label>
            </div>

            <label className="formWide floatingSelect businessTypeField">
              <span>What&apos;s your business type?*</span>
              <select name="businessType" required defaultValue="">
                <option value="" disabled>Select business type</option>
                <option>Independent hotel</option>
                <option>Hotel group</option>
                <option>Resort</option>
                <option>Guest house or bed and breakfast</option>
                <option>Hostel</option>
                <option>Serviced apartment or aparthotel</option>
                <option>Property management company</option>
                <option>Other accommodation business</option>
              </select>
            </label>
          </div>

          <p className="formConsent">
            By submitting your details, you confirm that you would like to receive marketing emails from DMS Desk and you agree to the storing and processing of your personal data by DMS Desk as described in our{" "}
            <a href="https://dms.lk/privacy-policy" target="_blank" rel="noreferrer">privacy policy</a>.
          </p>

          <button className="primaryButton formSubmit" type="submit">
            <svg className="submitBorder" aria-hidden="true" focusable="false">
              <rect pathLength="100" />
            </svg>
            <span>Get started <ArrowRight /></span>
          </button>
          {submitted && (
            <p className="formSuccess" role="status">
              <Check /> Thank you. Your request has been saved.
            </p>
          )}
        </form>
      </section>

      <section className="benefits section" aria-label="DMS Desk benefits">
        {benefits.map(({ icon: Icon, title, copy }) => (
          <article className="benefitCard" key={title}>
            <span className="smallIcon"><Icon /></span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="section" id="platform">
        <div className="productBanner">
          <div className="bannerCopy">
            <span className="inverseEyebrow">ONE CONNECTED WORKSPACE</span>
            <h2>Run channel operations alongside your PMS</h2>
            <p>Move from a channel reservation to guest details, front desk tasks, invoices and reporting without losing operational context.</p>
            <a className="lightButton" href="#features">Explore the workflow <ArrowRight /></a>
          </div>
          <OperationsPreview />
        </div>
      </section>

      <section className="proofSection section" id="workflow">
        <div className="sectionIntro rowIntro">
          <div>
            <h2>A distribution workflow grounded in daily operations</h2>
          </div>
          <p>DMS Desk connects channel work with the records already used by reservations, rooms, rates and financial operations.</p>
        </div>

        <div className="proofCards">
          <article className="proofCard">
            <span className="quoteMark">“</span>
            <h3>From availability to arrival</h3>
            <p>A channel reservation should not stop at an inbox. DMS Desk is designed to carry the booking into inventory checks, guest records, invoicing and the front desk.</p>
            <span className="proofLabel">RESERVATION WORKFLOW</span>
          </article>
          <article className="proofCard blueProof">
            <span className="quoteMark">“</span>
            <h3>Property context stays attached</h3>
            <p>Room mappings, rates, reservations and operational records remain tied to the selected property so hotel teams can work with the right context.</p>
            <span className="proofLabel">PROPERTY-AWARE DESIGN</span>
          </article>
        </div>

        <div className="proofMetrics">
          <div><strong>01</strong><span>shared PMS workspace</span></div>
          <div><strong>Property-scoped</strong><span>rooms, rates and reservations</span></div>
          <div><strong>End-to-end</strong><span>operational booking flow</span></div>
        </div>
      </section>

      <section className="featureSection section" id="features">
        <div className="sectionIntro centeredIntro">
          <h2>Clear visibility, practical controls and fewer disconnected steps</h2>
          <p>Every section below reflects workflows planned for the DMS Desk Channel Manager preview and its connected PMS modules.</p>
        </div>

        <div
          className="featureGrid"
          onPointerMove={(event) => {
            if (event.pointerType === "touch") return;
            const target = event.target;
            if (!(target instanceof Element)) return;
            const card = target.closest<HTMLElement>(".featureCard");
            if (!card || !event.currentTarget.contains(card)) return;
            const bounds = card.getBoundingClientRect();
            card.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
            card.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
          }}
        >
          <article className="featureCard featureLarge">
            <div className="featureCopy">
              <span className="featureNumber">01</span>
              <h3>Room and rate mapping</h3>
              <p>Organize PMS room types, channel room codes, rate plans and inventory sources in one configuration view.</p>
            </div>
            <MappingPreview />
          </article>

          <article className="featureCard featureLarge">
            <div className="featureCopy">
              <span className="featureNumber">02</span>
              <h3>Inventory and sync overview</h3>
              <p>Review availability, pricing and update status by stay date before sending changes to connected providers.</p>
            </div>
            <InventoryPreview />
          </article>

          <article className="featureCard compactFeature">
            <span className="smallIcon"><ShieldCheck /></span>
            <h3>Validated reservation intake</h3>
            <p>Check availability, saved rates and duplicate references before a channel reservation enters the PMS.</p>
            <div className="miniStatusList">
              <span><Check /> Inventory checked</span>
              <span><Check /> Rate plan matched</span>
              <span><Check /> Duplicate protected</span>
            </div>
          </article>

          <article className="featureCard compactFeature">
            <span className="smallIcon"><BarChart3 /></span>
            <h3>Channel performance context</h3>
            <p>Compare booking sources with reservations, room nights, revenue, lead time and cancellation context.</p>
            <MiniChart />
          </article>

          <article className="featureCard compactFeature">
            <span className="smallIcon"><MessageSquareText /></span>
            <h3>Operational logs</h3>
            <p>Give hotel teams one place to review sync requests, messages, results and exceptions.</p>
            <div className="activityList">
              <span><i className="activityDot successDot" />Inventory update completed</span>
              <span><i className="activityDot" />Reservation received</span>
              <span><i className="activityDot mutedDot" />Room mapping reviewed</span>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="networkBanner">
          <div>
            <span className="inverseEyebrow">DMS DESK CHANNEL MANAGER</span>
            <h2>Prepare your property for connected distribution</h2>
            <p>See how rooms, rates, inventory and reservations can work together inside DMS Desk.</p>
            <a className="lightButton" href="#request-demo">Join the preview <ArrowRight /></a>
          </div>
          <ChannelNetwork />
        </div>
      </section>

      <section className="resourcesSection section" id="resources">
        <div className="sectionIntro rowIntro resourceHeading">
          <div>
            
            <h2>Practical guidance for connected hotel operations</h2>
          </div>
          <a className="secondaryButton" href="#request-demo">Talk to the team <ArrowRight /></a>
        </div>
        <div className="resourceGrid">
          {resources.map(({ eyebrow, title, copy, icon: Icon }) => (
            <article className="resourceCard" key={title}>
              <div className="resourceVisual"><Icon /></div>
              <div className="resourceBody">
                <span>{eyebrow}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <a href="#request-demo">Read the overview <ChevronRight /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerTop section">
          <div className="footerBrand">
            <BrandLockup />
            <p>Connect, manage and grow with one practical workspace for reservations, rooms, operations and connected distribution.</p>
            <a className="primaryButton" href="#request-demo">Request a demo <ArrowRight /></a>
          </div>
          <div className="footerLinks">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3>{column.title}</h3>
                {column.links.map((link) => <a href={link === "Channel Manager" ? "#top" : "#features"} key={link}>{link}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footerBottom section">
          <span>© 2026 DMS Desk. Individual project preview.</span>
          <div><a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Cookies</a></div>
        </div>
      </footer>
    </main>
  );
}

function HeroChannelWorkspace() {
  return (
    <figure className="channelHeroArt" aria-label="">
      <div className="heroChannelNetwork">
        <svg className="channelConnectors" viewBox="0 0 420 270" fill="none" aria-hidden="true">
          <path d="M167 56v63c0 12 10 22 22 22h63M347 72v48c0 12-10 22-22 22h-54M71 116v38c0 12 10 22 22 22h142M101 220h115c22 0 37-14 37-35v-22M274 153h27c14 0 24 10 24 24v93" />
        </svg>
        <div className="channelLogoCard bookingCard"><strong><span className="bookingWord">Booking</span><span className="bookingDot">.com</span></strong></div>
        <div className="channelLogoCard airbnbCard">
          <svg className="airbnbMark" viewBox="0 0 34 38" aria-hidden="true"><path d="M17 4c-2.8 0-4.9 2-6.1 4.8L3.7 25.1C2 29 4 33.6 8.2 34.5c3.1.7 6.1-1.3 8.8-4.7 2.7 3.4 5.7 5.4 8.8 4.7 4.2-.9 6.2-5.5 4.5-9.4L23.1 8.8C21.9 6 19.8 4 17 4Zm0 9.5c2.2 3.9 4.4 7.8 4.4 10.7 0 2.4-1.9 4.4-4.4 5.6-2.5-1.2-4.4-3.2-4.4-5.6 0-2.9 2.2-6.8 4.4-10.7Z" /></svg>
          <strong>airbnb</strong>
        </div>
        <div className="channelLogoCard expediaCard"><span className="expediaSymbol"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z" /><path d="m7 15 8-7m-6 0h6v6" /></svg></span><strong>Expedia</strong></div>
        <div className="channelLogoCard agodaCard"><span>agoda</span><div className="agodaDots">{["#ff3654", "#ffbb00", "#00ad76", "#b620cd", "#00a9ed"].map(color => <i key={color} style={{ background: color }} />)}</div></div>
        <div className="channelLogoCard deskCore"><img src="/assets/dms-desk-mark.png" alt="DMS Desk" /></div>
      </div>
      <div className="heroDashboard">
        <div className="dashboardChrome"><i /><i /><i /></div>
        <div className="dashboardInterior">
          <aside className="dashboardSidebar"><strong><img src="/assets/dms-desk-mark.png" alt="" /> DMS Desk</strong>{[{ icon: Building2, name: "Dashboard" }, { icon: Network, name: "Channel Manager" }, { icon: BedDouble, name: "Inventory" }, { icon: CalendarDays, name: "Reservations" }, { icon: BarChart3, name: "Reports" }].map(({ icon: Icon, name }) => <span className={name === "Channel Manager" ? "selected" : ""} key={name}><Icon />{name}</span>)}</aside>
          <div className="dashboardMain"><h3>Channel Management</h3>
            <table className="channelSampleTable"><thead><tr><th>Channel</th><th>Status</th><th>Rooms</th><th>Rate sync</th></tr></thead><tbody>{[{ name: "Booking.com", initial: "B", rooms: 120 }, { name: "Airbnb", initial: "A", rooms: 85 }, { name: "Expedia", initial: "E", rooms: 100 }, { name: "Agoda", initial: "a", rooms: 78 }].map((channel, index) => <tr key={channel.name}><td><span className={`tableChannelMark channelMark${index}`}>{channel.initial}</span>{channel.name}</td><td><i className="connectedDot" />Connected</td><td>{channel.rooms}</td><td><span className="sampleToggle" aria-label="Enabled in preview" /></td></tr>)}</tbody></table>
            <div className="dashboardSummary"><BarChart3 /><div><span>Total Channel Reservations</span><strong>324 <small>↑ 12%</small></strong></div><div className="dashboardSparkBars" aria-hidden="true">{[20, 32, 29, 45, 56, 70].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function BrandLockup() {
  return (
    <a className="brand" href="#top" aria-label="DMS Desk home">
      <span className="brandLockup" aria-hidden="true">
        <img src="/assets/dms-desk-lockup.png" alt="" />
      </span>
      <span className="srOnly">DMS Desk</span>
    </a>
  );
}

function OperationsPreview() {
  return (
    <div className="operationsPreview" aria-label="DMS Desk channel workflow preview">
      <div className="previewTopbar"><span /><span /><span /><b>Channel activity</b></div>
      <div className="previewBody">
        <div className="previewSide">
          <i className="activeSide"><Gauge /></i><i><BedDouble /></i><i><CalendarDays /></i><i><Network /></i>
        </div>
        <div className="previewContent">
          <div className="previewMetrics">
            <div><span>Mapped rooms</span><strong>14</strong></div>
            <div><span>Rate plans</span><strong>6</strong></div>
            <div><span>Updates</span><strong>Ready</strong></div>
          </div>
          <div className="previewPanel">
            <div className="previewPanelHead"><b>Distribution overview</b><span>Last 7 days</span></div>
            <div className="previewBars">
              {[74, 48, 88, 62, 91, 72, 84].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
            </div>
            <div className="previewLegend"><span><i className="blueLegend" />Availability</span><span><i className="greenLegend" />Reservations</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MappingPreview() {
  return (
    <div className="mappingPreview">
      <div className="mockToolbar"><span><Search /> Search mappings</span><button>+ Add mapping</button></div>
      <div className="mappingHeader"><span>PMS room</span><span>Channel room</span><span>Status</span></div>
      {[
        ["Deluxe Double", "Agoda - DLX", "Mapped"],
        ["Airport Transit", "Booking.com - ATR", "Mapped"],
        ["Family Room", "Expedia - FAM", "Review"]
      ].map((row) => (
        <div className="mappingRow" key={row[0]}><span>{row[0]}</span><span>{row[1]}</span><b className={row[2] === "Mapped" ? "mapped" : "review"}>{row[2]}</b></div>
      ))}
    </div>
  );
}

function InventoryPreview() {
  const cells = [8, 7, 7, 5, 4, 6, 8, 120, 120, 125, 130, 130, 135, 140];
  return (
    <div className="inventoryPreview">
      <div className="inventoryHead"><b>Deluxe Double</b>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="inventoryRow"><b>Available</b>{cells.slice(0, 7).map((cell, index) => <span key={index}>{cell}</span>)}</div>
      <div className="inventoryRow rateRow"><b>Rate</b>{cells.slice(7).map((cell, index) => <span key={index}>${cell}</span>)}</div>
      <div className="syncNotice"><RefreshCw /> Inventory preview ready <span>Review changes</span></div>
    </div>
  );
}

function MiniChart() {
  return (
    <div className="miniChart" aria-label="Channel performance sample chart">
      {[46, 71, 58, 86, 64].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
      <svg viewBox="0 0 250 90" preserveAspectRatio="none" aria-hidden="true"><path d="M4 74 C40 65, 48 45, 78 52 S130 28, 160 36 S205 12, 246 20" /></svg>
    </div>
  );
}

function ChannelNetwork() {
  return (
    <div className="channelNetwork" aria-label="Connected channel illustration">
      <span className="networkCore"><img src="/assets/dms-desk-mark.png" alt="" /></span>
      <span className="networkNode nodeA">A</span>
      <span className="networkNode nodeB">B</span>
      <span className="networkNode nodeE">E</span>
      <span className="networkNode nodeD"><Zap /></span>
      <i className="lineA" /><i className="lineB" /><i className="lineE" /><i className="lineD" />
    </div>
  );
}
