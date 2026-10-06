"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  getCountryCallingCode,
  type CountryCode
} from "libphonenumber-js";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CloudCog,
  Gauge,
  Inbox,
  Layers3,
  Link2,
  ListChecks,
  Menu,
  Network,
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
    title: "How channel bookings move through the DMS platform",
    copy: "Follow a reservation from channel delivery to the front desk, invoice and audit trail.",
    icon: ListChecks
  }
];

const faqs = [
  {
    question: "What is Destination Management System?",
    answer: "DMS is designed to bring hotel reservations, rooms, rates and channel operations into one connected workspace. This preview shows how room mapping, inventory reviews and channel bookings fit into your property's daily workflow."
  },
  {
    question: "How does channel management work with the PMS?",
    answer: "The workflow starts by matching your PMS room types and rate plans to their channel equivalents. Your team can then review availability, update status and imported reservations with the relevant property context attached."
  },
  {
    question: "Can I connect Booking.com, Agoda and Expedia?",
    answer: "Booking.com, Agoda and Expedia are the channels featured in this preview. Connection availability and setup requirements need to be confirmed for your property. During a demo, ask the team to review the channels and accounts you already use."
  },
  {
    question: "What should I prepare before setting up my property?",
    answer: "Start with your room types, rate plans, inventory sources and existing channel property codes. Having these details ready makes it easier to review the mappings and identify any differences between your PMS and channel listings."
  },
  {
    question: "What reservation and performance information is shown?",
    answer: "The previews show reservation status, booking source, channel identifiers and revision details, alongside a booking-source report comparing reservation counts, booking value and revenue share. Ask for a walkthrough of the information relevant to your team's workflow."
  },
  {
    question: "Does DMS support direct bookings and payments?",
    answer: "Direct Bookings & Payments is part of the platform direction shown on this page. Confirm the booking flow, supported payment providers and availability with the team before planning your rollout."
  },
  {
    question: "How can I explore DMS for my hotel?",
    answer: "Use the Request a demo form above to enter your property details and the workflows you want to explore. This website is currently a preview; submitting the form saves the request in this browser only and does not yet send it to the DMS team."
  }
];

const businessTypes = [
  { icon: "/assets/business-types/independent-hotel.png", value: "Independent hotel", label: "Independent hotel" },
  { icon: "/assets/business-types/hotel-group.png", value: "Hotel group", label: "Hotel group" },
  { icon: "/assets/business-types/resort.png", value: "Resort", label: "Resort" },
  { icon: "/assets/business-types/guest-house.png", value: "Guest house or bed and breakfast", label: "Guest house or B&B" },
  { icon: "/assets/business-types/hostel.png", value: "Hostel", label: "Hostel" },
  { icon: "/assets/business-types/serviced-apartment.png", value: "Serviced apartment or aparthotel", label: "Serviced apartment" },
  { icon: "/assets/business-types/property-management.png", value: "Property management company", label: "Property management company" },
  { icon: "/assets/business-types/other.png", value: "Other accommodation business", label: "Other accommodation" }
];

const footerColumns = [
  { title: "Platform", links: ["Dashboard", "Front Desk", "Reservations", "Rooms & Rates"] },
  { title: "Operations", links: ["Housekeeping", "Night Audit", "Financials", "Reports"] },
  { title: "Distribution", links: ["Channel Manager", "Travel Agents", "Booking Engine"] },
  { title: "Company", links: ["About", "Contact", "FAQ", "Request Demo", "Sign in"] }
];

export default function ChannelManagerLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [country, setCountry] = useState<CountryCode>("LK");
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("LK");
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;

    const updateHeader = () => {
      frame = 0;
      const currentY = window.scrollY;
      setHeaderScrolled(currentY > 64);

      if (currentY < 100 || menuOpen || document.activeElement?.closest(".siteHeader")) {
        setHeaderVisible(true);
        previousY = currentY;
        return;
      }

      const movement = currentY - previousY;
      if (Math.abs(movement) >= 8) {
        setHeaderVisible(movement < 0);
        previousY = currentY;
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  function submitDemoRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const storageKey = "dms:landing:demo-requests";
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

  // The demo form is split into three short steps; each step must be valid before the next one shows.
  function stepIsValid(stepNumber: number) {
    const pane = formRef.current?.querySelector(`[data-step="${stepNumber}"]`);
    const fields = pane ? Array.from(pane.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select")) : [];
    const invalid = fields.find((field) => !field.checkValidity());
    invalid?.reportValidity();
    return !invalid;
  }

  function nextStep() {
    if (!stepIsValid(step)) return;
    setSubmitted(false);
    setStep(step + 1);
  }

  function submitStepForm(event: FormEvent<HTMLFormElement>) {
    if (!stepIsValid(3)) {
      event.preventDefault();
      return;
    }
    submitDemoRequest(event);
    setStep(1);
  }

  return (
    <main className="siteShell">
      <header
        className={`siteHeader ${headerVisible ? "" : "siteHeaderHidden"} ${headerScrolled ? "siteHeaderScrolled" : ""}`}
        style={{ backdropFilter: "blur(22px) saturate(1.35)", WebkitBackdropFilter: "blur(22px) saturate(1.35)" }}
        onFocusCapture={() => setHeaderVisible(true)}
      >
        <div className="headerInner">
          <BrandLockup />

          <nav className={`mainNav ${menuOpen ? "mainNavOpen" : ""}`} aria-label="Primary navigation" style={{ backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)" }} onClick={() => setMenuOpen(false)}>
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

      <section className="stepHero" id="top">
        <div className="stepHeroInner">
          <div className="stepHeroCopy">
            <span className="stepHeroBadge"><span className="stepHeroBadgeIcon"><img src="/assets/dms-mark.png" alt="" /></span>Destination Management System</span>
            <h1>Run your whole<br />hotel from<br /><span>one workspace.</span></h1>
            <p className="stepHeroLead">Keep channel operations connected to your hotel&apos;s rooms, rates and reservation workflow.</p>
            <ul className="stepHeroPoints">
              <li><span><Check aria-hidden="true" /></span>Property-aware setup</li>
              <li><span><Check aria-hidden="true" /></span>PMS-connected workflow</li>
              <li><span><Check aria-hidden="true" /></span>Built for independent hotels</li>
            </ul>
            <div className="stepHeroChannels">
              <span>Channel tools for</span>
              <span className="stepChannelMark stepChannelBooking" role="img" aria-label="Booking.com">B.</span>
              <span className="stepChannelMark stepChannelExpedia" role="img" aria-label="Expedia">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 18 11-11M9 7h8v8" stroke="#0b1b3f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><rect x="4.5" y="16.5" width="3" height="3" rx=".6" fill="#0b1b3f" /></svg>
              </span>
              <span className="stepChannelMark stepChannelAgoda" role="img" aria-label="Agoda"><img src="/assets/agoda-mark.png" alt="" /></span>
            </div>
          </div>

          <div className="stepHeroStage">
            <div className="stepHeroShot" aria-hidden="true">
              <div className="stepHeroFrame">
                <div className="stepHeroFrameBar"><i /><i /><i /><span>Channel Manager · Hotel DMS</span></div>
                <img src="/assets/shot-overview.webp" alt="" width={1800} height={963} />
              </div>
            </div>

            <form ref={formRef} className="stepForm" id="request-demo" onSubmit={submitStepForm} noValidate>
              <h2>Connect your property</h2>
              <p className="stepFormSub">Tell us a little about your hotel business.</p>
              <div className="stepProgress" aria-hidden="true">
                {[1, 2, 3].map((number) => <i key={number} className={number <= step ? "on" : ""} />)}
              </div>
              <span className="stepCount" aria-live="polite">Step {step} of 3</span>

              <div className="stepPane" data-step="1" hidden={step !== 1}>
                <p className="stepQuestion" id="business-type-question">What&apos;s your business type?</p>
                <div className="typeTiles" role="radiogroup" aria-labelledby="business-type-question">
                  {businessTypes.map(({ icon, value, label }, index) => (
                    <label className="typeTile" key={value}>
                      <input type="radio" name="businessType" value={value} required={index === 0} />
                      <span className="typeTileIcon" aria-hidden="true"><span className="typeTileGlyph" style={{ WebkitMaskImage: `url(${icon})`, maskImage: `url(${icon})` }} /></span>
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="stepPane" data-step="2" hidden={step !== 2}>
                <p className="stepQuestion">About you</p>
                <div className="stepGrid">
                  <label className="stepField">
                    <span className="srOnly">First name</span>
                    <input name="firstName" required autoComplete="given-name" placeholder="First Name*" />
                  </label>
                  <label className="stepField">
                    <span className="srOnly">Last name</span>
                    <input name="lastName" required autoComplete="family-name" placeholder="Last Name*" />
                  </label>
                  <label className="stepField stepWide">
                    <span className="srOnly">Business email</span>
                    <input name="email" required type="email" autoComplete="email" placeholder="Business Email*" />
                  </label>
                  <label className="stepField stepWide">
                    <span className="srOnly">Company or hotel name</span>
                    <input name="propertyName" required autoComplete="organization" placeholder="Company/Hotel Name*" />
                  </label>
                </div>
              </div>

              <div className="stepPane" data-step="3" hidden={step !== 3}>
                <p className="stepQuestion">Where is your property?</p>
                <div className="stepGrid">
                  <label className="stepField stepFieldLabelled stepWide">
                    <span className="stepFieldLabel">Country*</span>
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
                    <input type="hidden" name="countryName" value={countries.find((option) => option.code === country)?.name || country} />
                  </label>
                  <label className="stepField stepFieldLabelled">
                    <span className="stepFieldLabel">Calling code*</span>
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
                  <label className="stepField stepFieldLabelled stepPhone">
                    <span className="stepFieldLabel">Phone number*</span>
                    <span className="stepPhonePrefix">+{getCountryCallingCode(phoneCountry)}</span>
                    <input name="phoneNumber" required type="tel" inputMode="tel" autoComplete="tel-national" aria-label="Phone number" />
                    <input type="hidden" name="phoneCallingCode" value={`+${getCountryCallingCode(phoneCountry)}`} />
                  </label>
                </div>
                <p className="formConsent">
                  By submitting your details, you confirm that you would like to receive marketing emails from Destination Management System and you agree to the storing and processing of your personal data by Destination Management System as described in our{" "}
                  <a href="https://dms.lk/privacy-policy" target="_blank" rel="noreferrer">privacy policy</a>.
                </p>
              </div>

              <div className="stepNav">
                {step > 1 && (
                  <button className="stepBack" type="button" aria-label="Back" onClick={() => setStep(step - 1)}>
                    <ArrowLeft aria-hidden="true" />
                  </button>
                )}
                {/* Separate keys so React swaps the button instead of flipping its type mid-click (which would submit early). */}
                {step < 3 ? (
                  <button key="next" className="primaryButton stepNext" type="button" onClick={nextStep}>
                    Continue <ArrowRight aria-hidden="true" />
                  </button>
                ) : (
                  <button key="submit" className="primaryButton stepNext" type="submit">
                    Get started <ArrowRight aria-hidden="true" />
                  </button>
                )}
              </div>
              {submitted && (
                <p className="formSuccess" role="status">
                  <Check /> Thank you. Your request has been saved.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="benefits section" aria-label="Destination Management System benefits">
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
          <div className="operationsStack" aria-label="Destination Management System Channel Manager screens">
            <figure className="operationsShot operationsShotOverview">
              <img
                src="/assets/channel-manager-overview.png"
                alt="Channel Manager overview showing active channels, reservations, revenue and booking sources"
              />
            </figure>
            <figure className="operationsShot operationsShotSync">
              <img
                src="/assets/channel-manager-sync.png"
                alt="Channel Manager availability, rate synchronization and integration status"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="workflowSection section" id="workflow">
        <div className="workflowIntro">
          <h2>Channel bookings go straight into your daily hotel work</h2>
          <p>DMS is built to link the bookings you get from Booking.com, Expedia and Agoda to the same rooms, prices, guest records and invoices your team already uses.</p>
        </div>
        <ul className="workflowPoints">
          <li>
            <span className="workflowIcon"><Inbox aria-hidden="true" /></span>
            <h3>Bookings don&rsquo;t wait in an inbox</h3>
            <p>When a guest books on Agoda or Booking.com, DMS is designed to carry that booking into your availability, guest list, invoices and front desk, instead of someone copying it across by hand.</p>
          </li>
          <li>
            <span className="workflowIcon"><Building2 aria-hidden="true" /></span>
            <h3>Each hotel keeps its own data</h3>
            <p>If you run more than one property, the room setup, prices, bookings and records for each hotel stay with that hotel, so your staff always see the right information.</p>
          </li>
        </ul>
      </section>

      <section className="featureSection section" id="features">
        <div className="sectionIntro centeredIntro">
          <h2>Clear visibility, practical controls and fewer disconnected steps</h2>
          <p>Every section below reflects workflows planned for Destination Management System and its connected PMS modules.</p>
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
              <h3>Room, rate and inventory mapping</h3>
              <p>Connect PMS room types with channel room codes, rate plans and inventory sources in one configuration workflow.</p>
            </div>
            <div className="moduleArtwork"><MappingPreview /></div>
          </article>

          <article className="featureCard featureLarge">
            <div className="featureCopy">
              <span className="featureNumber">02</span>
              <h3>Inventory and sync overview</h3>
              <p>Review availability, pricing and update status by stay date before sending changes to connected providers.</p>
            </div>
            <div className="moduleArtwork"><InventoryPreview /></div>
          </article>

          <article className="featureCard compactFeature">
            <div className="moduleCopy">
            <span className="smallIcon"><ListChecks /></span>
            <h3>Channel reservation review</h3>
            <p>Turn every imported reservation into a clear next step—review guest details, stay dates, acknowledgement status and revision history.</p>
            </div>
            <div className="moduleArtwork"><div className="reservationScreenshotPreview">
              <img
                src="/assets/channel-reservation-review.png"
                alt="Reservation details showing status, OTA source, channel, reservation and revision identifiers"
              />
            </div></div>
          </article>

          <article className="featureCard compactFeature">
            <div className="moduleCopy">
            <span className="smallIcon"><BarChart3 /></span>
            <h3>Channel performance context</h3>
            <p>Compare booking sources by reservation volume, booking value and revenue share.</p>
            </div>
            <div className="moduleArtwork"><div className="performanceScreenshotPreview">
              <img
                src="/assets/booking-sources.png"
                alt="Booking Sources report comparing reservation count, booking value and revenue share by channel"
              />
            </div></div>
          </article>

          <article className="featureCard compactFeature directBookingCard">
            <div className="moduleCopy">
            <span className="smallIcon"><NetworkIcon /></span>
            <h3>Direct Bookings &amp; Payments</h3>
            <p>Reduce commission and simplify guest transactions.</p>
            </div>
            <div className="moduleArtwork"><div className="directBookingVisual" aria-label="Direct booking connections to Booking.com, Agoda and Expedia">
              <span className="directOrbit directOrbitOuter" aria-hidden="true" />
              <span className="directOrbitTrack" aria-hidden="true" />
              <span className="directOrbit directOrbitInner" aria-hidden="true" />
              <span className="directOrbit directOrbitCenter" aria-hidden="true" />
              <span className="directOrbitPlus directPlusLeft" aria-hidden="true" />
              <span className="directOrbitPlus directPlusRight" aria-hidden="true" />
              <span className="directBrand directBrandExpedia"><img src="/assets/expedia-icon.png" alt="Expedia" /></span>
              <span className="directBrand directBrandBooking"><img src="/assets/booking-icon.png" alt="Booking.com" /></span>
              <span className="directBrand directBrandAgoda"><img src="/assets/agoda-icon.png" alt="Agoda" /></span>
              <span className="directOrbitCore"><img src="/assets/dms-mark.png" alt="Destination Management System" /></span>
            </div></div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="networkBanner">
          <div>
            
            <h2><span>Prepare your</span><span>property for</span><span>connected distribution</span></h2>
            <p>See how rooms, rates, inventory and reservations can work together inside Destination Management System.</p>
            <a className="lightButton" href="#request-demo">Join the preview <ArrowRight /></a>
          </div>
          <div className="bannerLaptop">
            <div className="bannerLaptopScreen">
              <video
                src="/assets/dms-tour.mp4"
                poster="/assets/dms-tour-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Product tour of Destination Management System"
              />
            </div>
            <div className="bannerLaptopBase" aria-hidden="true" />
          </div>
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

      <section className="faqSection section" id="faq" aria-labelledby="faq-heading">
        <div className="faqIntro">
          <span className="eyebrow">A LITTLE MORE CLARITY</span>
          <h2 id="faq-heading">Frequently asked questions</h2>
          <p>Get to know DMS, your channel connections and the steps to getting started.</p>
        </div>
        <div className="faqList">
          {faqs.map(({ question, answer }, index) => (
            <div className="faqItem" data-open={openFaq === index} key={question}>
              <h3 className="faqQuestion">
                <button className="faqTrigger" type="button"
                  id={`faq-question-${index}`} aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenFaq((current) => current === index ? null : index)}>
                  <span className="faqToggle" aria-hidden="true" />
                  <span>{question}</span>
                </button>
              </h3>
              <div className="faqPanel" id={`faq-answer-${index}`} role="region"
                aria-labelledby={`faq-question-${index}`} aria-hidden={openFaq !== index}
                inert={openFaq !== index}>
                <div className="faqPanelClip">
                  <div className="faqAnswer"><p>{answer}</p></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="faqHelp">
          <p>Want to see how the pieces fit together?</p>
          <a href="#features">Explore the modules <ArrowRight aria-hidden="true" /></a>
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
                {column.links.map((link) => <a href={link === "FAQ" ? "#faq" : link === "Channel Manager" ? "#top" : "#features"} key={link}>{link}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footerBottom section">
          <span>© 2026 Destination Management System. Individual project preview.</span>
          <div><a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Cookies</a></div>
        </div>
      </footer>

    </main>
  );
}

function HeroChannelNetwork() {
  return (
    <div className="heroChannelNetwork stepHeroNetwork" role="img" aria-label="Booking.com, Airbnb, Expedia and Agoda connected to DMS">
      <svg className="channelConnectors" viewBox="0 0 420 270" fill="none" aria-hidden="true">
        <path d="M167 56v63c0 12 10 22 22 22h63M347 72v48c0 12-10 22-22 22h-54M71 116v38c0 12 10 22 22 22h142M101 220h115c22 0 37-14 37-35v-22" />
      </svg>
      <div className="channelLogoCard bookingCard"><strong><span className="bookingWord">Booking</span><span className="bookingDot">.com</span></strong></div>
      <div className="channelLogoCard airbnbCard">
        <svg className="airbnbMark" viewBox="0 0 34 38" aria-hidden="true"><path d="M17 4c-2.8 0-4.9 2-6.1 4.8L3.7 25.1C2 29 4 33.6 8.2 34.5c3.1.7 6.1-1.3 8.8-4.7 2.7 3.4 5.7 5.4 8.8 4.7 4.2-.9 6.2-5.5 4.5-9.4L23.1 8.8C21.9 6 19.8 4 17 4Zm0 9.5c2.2 3.9 4.4 7.8 4.4 10.7 0 2.4-1.9 4.4-4.4 5.6-2.5-1.2-4.4-3.2-4.4-5.6 0-2.9 2.2-6.8 4.4-10.7Z" /></svg>
        <strong>airbnb</strong>
      </div>
      <div className="channelLogoCard expediaCard"><span className="expediaSymbol"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z" /><path d="m7 15 8-7m-6 0h6v6" /></svg></span><strong>Expedia</strong></div>
      <div className="channelLogoCard agodaCard"><span>agoda</span><div className="agodaDots">{["#ff3654", "#ffbb00", "#00ad76", "#b620cd", "#00a9ed"].map(color => <i key={color} style={{ background: color }} />)}</div></div>
      <div className="channelLogoCard deskCore"><img src="/assets/dms-mark.png" alt="" /></div>
    </div>
  );
}

function BrandLockup() {
  return (
    <a className="brand brandFull" href="#top" aria-label="Destination Management System home">
      <img className="brandFullLogo" src="/assets/dms-full-logo.png" alt="" aria-hidden="true" />
      <span className="srOnly">Destination Management System</span>
    </a>
  );
}

function OperationsPreview() {
  return (
    <div className="operationsPreview" aria-label="Destination Management System channel workflow preview">
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
    <div className="mappingScreenshotPreview">
      <img src="/assets/room-rate-mapping.png" alt="Room and rate mapping controls and mapped PMS room types" />
      
    </div>
  );
}

function InventoryPreview() {
  return (
    <div className="inventoryPreview inventoryScreenshotPreview">
      <img
        src="/assets/inventory-sync-overview.png"
        alt="Inventory availability and rate synchronization by room and stay date"
      />
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
      <span className="networkCore"><img src="/assets/dms-mark.png" alt="" /></span>
      <span className="networkNode nodeA">A</span>
      <span className="networkNode nodeB">B</span>
      <span className="networkNode nodeE">E</span>
      <span className="networkNode nodeD"><Zap /></span>
      <i className="lineA" /><i className="lineB" /><i className="lineE" /><i className="lineD" />
    </div>
  );
}
