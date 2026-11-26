import { useEffect, useState } from "react";
import { bloodGroups } from "./data/donors";
import { apiRequest } from "./api";

const initialFilters = { bloodGroup: "", city: "", locality: "", available: "" };
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
  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [lastSearchFilters, setLastSearchFilters] = useState(initialFilters);
  const [registration, setRegistration] = useState(initialRegistration);
  const [formErrors, setFormErrors] = useState({});
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDonors = async (searchFilters = initialFilters) => {
    setIsLoading(true);
    setSearchError("");

    const params = new URLSearchParams();
    if (searchFilters.bloodGroup) params.set("bloodGroup", searchFilters.bloodGroup);
    if (searchFilters.city.trim()) params.set("city", searchFilters.city.trim());
    if (searchFilters.locality.trim()) params.set("locality", searchFilters.locality.trim());
    if (searchFilters.available) params.set("available", searchFilters.available);

    try {
      const data = await apiRequest(`/api/donors${params.size ? `?${params}` : ""}`);
      setDonors(data.donors);
    } catch (error) {
      setDonors([]);
      setSearchError(
        error.message === "Failed to fetch"
          ? "The API is unavailable. Check that the backend is running and try again."
          : error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors(initialFilters);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setHasSearched(true);
    setLastSearchFilters(filters);
    fetchDonors(filters);
  };

  const clearSearch = () => {
    setFilters(initialFilters);
    setLastSearchFilters(initialFilters);
    setHasSearched(false);
    fetchDonors(initialFilters);
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
    setRegistrationError("");

    if (Object.keys(errors).length || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = await apiRequest("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration),
      });

      setRegistration(initialRegistration);
      setFormErrors({});
      setRegistrationMessage(
        `${data.donor.name} was registered successfully. Their profile is now stored in the directory.`,
      );
      await fetchDonors(lastSearchFilters);
    } catch (error) {
      if (error.details) {
        const mappedErrors = {};
        Object.entries(error.details).forEach(([field, message]) => {
          mappedErrors[field] =
            field === "consent"
              ? "Consent is required to display your details."
              : message;
        });
        setFormErrors(mappedErrors);
      }
      setRegistrationError(
        error.status === 400
          ? "Please correct the highlighted registration details."
          : error.message === "Failed to fetch"
            ? "The API is unavailable. The registration could not be submitted."
            : error.message,
      );
    } finally {
      setIsSubmitting(false);
    }
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
              <span className="result-count">{donors.length} donors found</span>
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
              <label>
                <span>Availability</span>
                <select
                  value={filters.available}
                  onChange={(event) => setFilters({ ...filters, available: event.target.value })}
                >
                  <option value="">Any availability</option>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </label>
              <button className="search-button" type="submit">Search donors <span aria-hidden="true">→</span></button>
              <button className="clear-button" type="button" onClick={clearSearch}>Clear filters</button>
            </form>

            {isLoading ? (
              <div className="initial-state" role="status">
                <span className="initial-icon" aria-hidden="true">⌕</span>
                <div>
                  <h3>Loading donors…</h3>
                  <p>Fetching the latest directory from RaktSetu.</p>
                </div>
              </div>
            ) : searchError ? (
              <div className="empty-state error-state" role="alert">
                <span aria-hidden="true">!</span>
                <h3>Unable to load donors</h3>
                <p>{searchError}</p>
                <button type="button" onClick={() => fetchDonors(hasSearched ? lastSearchFilters : initialFilters)}>
                  Try again
                </button>
              </div>
            ) : !hasSearched ? (
              <div className="initial-state">
                <span className="initial-icon" aria-hidden="true">⌕</span>
                <div>
                  <h3>Ready to find a donor?</h3>
                  <p>Choose filters above or browse all available fictional profiles below.</p>
                </div>
              </div>
            ) : donors.length === 0 ? (
              <div className="empty-state" role="status">
                <span aria-hidden="true">⌕</span>
                <h3>No matching donors found</h3>
                <p>Try another blood group or broaden your city or locality search.</p>
                <button type="button" onClick={clearSearch}>Clear filters</button>
              </div>
            ) : null}

            <div className="donor-grid" aria-live="polite">
              {donors.map((donor) => (
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
              {registrationError && <div className="error-message" role="alert">{registrationError}</div>}
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
