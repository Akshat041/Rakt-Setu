import { useMemo, useState } from "react";
import { bloodGroups, mockDonors } from "./data/donors";

const initialFilters = { bloodGroup: "", city: "", locality: "" };
const initialRegistration = {
  name: "",
  bloodGroup: "",
  city: "",
  locality: "",
  phone: "",
  available: true,
  consent: false,
};

function App() {
  const [filters, setFilters] = useState(initialFilters);
  const [donors, setDonors] = useState(mockDonors);
  const [hasSearched, setHasSearched] = useState(false);
  const [registration, setRegistration] = useState(initialRegistration);
  const [formErrors, setFormErrors] = useState({});
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDonors = useMemo(() => {
    if (!hasSearched) return donors;

    const matchesText = (value, filter) =>
      value.toLowerCase().includes(filter.trim().toLowerCase());

    return donors.filter((donor) => {
      if (filters.bloodGroup && donor.bloodGroup !== filters.bloodGroup) return false;
      if (filters.city && !matchesText(donor.city, filters.city)) return false;
      if (filters.locality && !matchesText(donor.locality, filters.locality)) return false;
      return true;
    });
  }, [donors, filters, hasSearched]);

  const handleSearch = (event) => {
    event.preventDefault();
    setHasSearched(true);
  };

  const clearSearch = () => {
    setFilters(initialFilters);
    setHasSearched(false);
  };

  const validateRegistration = () => {
    const errors = {};
    if (!registration.name.trim()) errors.name = "Please enter your full name.";
    if (!registration.bloodGroup) errors.bloodGroup = "Please select a blood group.";
    if (!registration.city.trim()) errors.city = "Please enter your city.";
    if (!registration.locality.trim()) errors.locality = "Please enter your locality.";
    if (!/^[6-9]\d{9}$/.test(registration.phone.replace(/\D/g, "").slice(-10))) {
      errors.phone = "Enter a valid 10-digit Indian phone number.";
    }
    if (!registration.consent) errors.consent = "Consent is required to display your details.";
    return errors;
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    const errors = validateRegistration();
    setFormErrors(errors);
    setRegistrationMessage("");

    if (Object.keys(errors).length || isSubmitting) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const nextDonor = {
      id: Date.now(),
      name: registration.name.trim(),
      bloodGroup: registration.bloodGroup,
      city: registration.city.trim(),
      locality: registration.locality.trim(),
      phone: registration.phone.trim(),
      available: registration.available,
    };
    setDonors((current) => [nextDonor, ...current]);
    setRegistration(initialRegistration);
    setRegistrationMessage("Registration complete. Your fictional profile is now searchable.");
    setIsSubmitting(false);
  };

  return (
    <>
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="RaktSetu home">
            <span className="brand-mark" aria-hidden="true">+</span>
            <span>Rakt<span>Setu</span></span>
          </a>
          <div className="nav-links">
            <a href="#search">Find a donor</a>
            <a href="#register">Become a donor</a>
            <a href="#how-it-works">How it works</a>
          </div>
          <a className="nav-button" href="#register">Register as donor</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span></span> Blood donor community</div>
              <h1>Find a donor.<br /><em>Make a difference.</em></h1>
              <p>Connect with voluntary blood donors near you. Search by blood group and location to find a potential match.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#search">Find a donor <span aria-hidden="true">→</span></a>
                <a className="button button-secondary" href="#register">Become a donor</a>
              </div>
            </div>
            <div className="hero-visual" aria-label="Community donation illustration">
              <div className="pulse-ring ring-one"></div>
              <div className="pulse-ring ring-two"></div>
              <div className="donor-avatar">
                <div className="avatar-head"></div>
                <div className="avatar-body"></div>
                <div className="avatar-badge">A+</div>
              </div>
              <div className="trust-card trust-card-one">
                <span className="trust-icon">✓</span>
                <div><strong>Verified directory</strong><small>Voluntary donors</small></div>
              </div>
              <div className="trust-card trust-card-two">
                <strong>{donors.length}</strong>
                <small>Fictional donors</small>
              </div>
            </div>
          </div>
        </section>

        <section className="search-section" id="search">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Find help nearby</span>
                <h2>Search for a blood donor</h2>
              </div>
              <span className="result-count">{filteredDonors.length} donors found</span>
            </div>

            <form className="search-panel" onSubmit={handleSearch}>
              <label>
                <span>Blood group</span>
                <select
                  value={filters.bloodGroup}
                  onChange={(event) => setFilters({ ...filters, bloodGroup: event.target.value })}
                >
                  <option value="">All blood groups</option>
                  {bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}
                </select>
              </label>
              <label>
                <span>City</span>
                <input
                  type="text"
                  placeholder="e.g. Kanpur"
                  value={filters.city}
                  onChange={(event) => setFilters({ ...filters, city: event.target.value })}
                />
              </label>
              <label>
                <span>Locality / Area</span>
                <input
                  type="text"
                  placeholder="e.g. Kalyanpur"
                  value={filters.locality}
                  onChange={(event) => setFilters({ ...filters, locality: event.target.value })}
                />
              </label>
              <button className="search-button" type="submit">Search donors <span aria-hidden="true">→</span></button>
              <button className="clear-button" type="button" onClick={clearSearch}>Clear filters</button>
            </form>

            {!hasSearched ? (
              <div className="initial-state">
                <span className="initial-icon" aria-hidden="true">⌕</span>
                <div>
                  <h3>Ready to find a donor?</h3>
                  <p>Choose filters above or browse all available fictional profiles below.</p>
                </div>
              </div>
            ) : filteredDonors.length === 0 ? (
              <div className="empty-state" role="status">
                <span aria-hidden="true">⌕</span>
                <h3>No matching donors found</h3>
                <p>Try another blood group or broaden your city or locality search.</p>
                <button type="button" onClick={clearSearch}>Clear filters</button>
              </div>
            ) : null}

            <div className="donor-grid" aria-live="polite">
              {filteredDonors.map((donor) => (
                <article className="donor-card" key={donor.id}>
                  <div className="donor-card-top">
                    <div className="donor-info">
                      <div className="blood-badge">{donor.bloodGroup}</div>
                      <div>
                        <h3>{donor.name}</h3>
                        <p>{donor.locality}, {donor.city}</p>
                      </div>
                    </div>
                    <span className={donor.available ? "status available" : "status unavailable"}>
                      {donor.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="donor-card-bottom">
                    <span className="location-icon" aria-hidden="true">⌖</span>
                    <span>{donor.city}</span>
                    <a
                      className="contact-button"
                      href={`tel:${donor.phone.replace(/\s/g, "")}`}
                      aria-label={`Call ${donor.name}`}
                    >
                      Call donor
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="register-section" id="register">
          <div className="container register-grid">
            <div className="register-copy">
              <span className="section-kicker">Join the community</span>
              <h2>Become a blood donor</h2>
              <p>Register your details to appear in this demonstration directory. You decide when you are open to being contacted.</p>
              <ul>
                <li><span>✓</span> Simple registration</li>
                <li><span>✓</span> You control your availability</li>
                <li><span>✓</span> Consent-based directory</li>
              </ul>
            </div>

            <form className="registration-form" onSubmit={handleRegistration} noValidate>
              {registrationMessage && <div className="success-message" role="status">{registrationMessage}</div>}
              <div className="form-row">
                <label>
                  <span>Full name</span>
                  <input
                    type="text"
                    value={registration.name}
                    onChange={(event) => setRegistration({ ...registration, name: event.target.value })}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && <small className="field-error">{formErrors.name}</small>}
                </label>
                <label>
                  <span>Blood group</span>
                  <select
                    value={registration.bloodGroup}
                    onChange={(event) => setRegistration({ ...registration, bloodGroup: event.target.value })}
                  >
                    <option value="">Select group</option>
                    {bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}
                  </select>
                  {formErrors.bloodGroup && <small className="field-error">{formErrors.bloodGroup}</small>}
                </label>
              </div>
              <div className="form-row">
                <label>
                  <span>City</span>
                  <input
                    type="text"
                    value={registration.city}
                    onChange={(event) => setRegistration({ ...registration, city: event.target.value })}
                    placeholder="Enter city"
                  />
                  {formErrors.city && <small className="field-error">{formErrors.city}</small>}
                </label>
                <label>
                  <span>Locality / Area</span>
                  <input
                    type="text"
                    value={registration.locality}
                    onChange={(event) => setRegistration({ ...registration, locality: event.target.value })}
                    placeholder="Enter area"
                  />
                  {formErrors.locality && <small className="field-error">{formErrors.locality}</small>}
                </label>
              </div>
              <label>
                <span>Phone number</span>
                <input
                  type="tel"
                  value={registration.phone}
                  onChange={(event) => setRegistration({ ...registration, phone: event.target.value })}
                  placeholder="10-digit demo number"
                />
                {formErrors.phone && <small className="field-error">{formErrors.phone}</small>}
              </label>
              <label className="toggle-row">
                <span>
                  <strong>Available for contact</strong>
                  <small>This does not confirm medical eligibility.</small>
                </span>
                <input
                  type="checkbox"
                  checked={registration.available}
                  onChange={(event) => setRegistration({ ...registration, available: event.target.checked })}
                />
              </label>
              <label className="consent-row">
                <input
                  type="checkbox"
                  checked={registration.consent}
                  onChange={(event) => setRegistration({ ...registration, consent: event.target.checked })}
                />
                <span>I consent to display these fictional details in the demo directory.</span>
              </label>
              {formErrors.consent && <small className="field-error">{formErrors.consent}</small>}
              <button className="submit-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Register as donor"}
              </button>
            </form>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="container">
            <div className="how-heading">
              <span className="section-kicker">Simple and transparent</span>
              <h2>How RaktSetu works</h2>
            </div>
            <div className="steps">
              <article>
                <div className="step-number">1</div>
                <h3>Set your search</h3>
                <p>Choose a blood group and optional city or locality filters.</p>
              </article>
              <article>
                <div className="step-number">2</div>
                <h3>Review profiles</h3>
                <p>Compare fictional donors and their self-reported availability.</p>
              </article>
              <article>
                <div className="step-number">3</div>
                <h3>Contact directly</h3>
                <p>Use the listed demo contact action and confirm details independently.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div>
            <a className="brand footer-brand" href="#top">
              <span className="brand-mark" aria-hidden="true">+</span>
              <span>Rakt<span>Setu</span></span>
            </a>
            <p>Educational blood donor finder prototype.</p>
          </div>
          <div className="footer-links">
            <a href="#search">Find a donor</a>
            <a href="#register">Register</a>
            <a href="#how-it-works">How it works</a>
          </div>
        </div>
        <div className="container disclaimer">
          <strong>Medical and emergency disclaimer</strong>
          <p>RaktSetu is a prototype for educational use and not a real emergency service or blood bank. All donor records are fictional. Availability does not confirm medical eligibility or blood compatibility. Always consult qualified medical professionals and use authorized blood bank channels.</p>
        </div>
        <div className="container copyright">© 2026 RaktSetu. Demo project only.</div>
      </footer>
    </>
  );
}

export default App;
