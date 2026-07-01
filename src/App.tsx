import { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Video
} from 'lucide-react';
import './App.css';

const OWNER_EMAIL = "san.uus27@gmail.com";

const sendBookingDetails = async (details: {
  name: string;
  email: string;
  date: Date;
  time: string;
  notes: string;
}) => {
  const formattedDate = details.date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const webhookUrl = import.meta.env.VITE_BOOKING_WEBHOOK_URL || "";

  if (webhookUrl) {
    let payload: any = {
      name: details.name,
      email: details.email,
      date: formattedDate,
      time: details.time,
      notes: details.notes
    };

    let targetUrl = webhookUrl;

    // Auto-detect Discord, Slack, Web3Forms, or Formspree/Generic webhook
    if (webhookUrl.includes("discord.com")) {
      payload = {
        embeds: [
          {
            title: "📅 New 1-on-1 Design Session Scheduled!",
            color: 3447003, // Soft blue
            fields: [
              { name: "Name", value: details.name, inline: true },
              { name: "Email", value: details.email, inline: true },
              { name: "Date", value: formattedDate, inline: true },
              { name: "Time", value: details.time, inline: true },
              { name: "Notes", value: details.notes || "None", inline: false }
            ],
            footer: {
              text: "Sandra's Portfolio Booking System"
            },
            timestamp: new Date().toISOString()
          }
        ]
      };
    } else if (webhookUrl.includes("slack.com") || webhookUrl.includes("hooks.slack.com")) {
      payload = {
        text: `📅 *New 1-on-1 Design Session Scheduled!*\n\n*Name:* ${details.name}\n*Email:* ${details.email}\n*Date:* ${formattedDate}\n*Time:* ${details.time}\n*Notes:* ${details.notes || "None"}`
      };
    } else if (!webhookUrl.startsWith("http")) {
      // If it's just a token/key (like a Web3Forms Access Key), send to Web3Forms API
      targetUrl = "https://api.web3forms.com/submit";
      payload = {
        access_key: webhookUrl,
        subject: `New Design Session Booking - ${details.name}`,
        from_name: "Portfolio Booking System",
        name: details.name,
        email: details.email,
        date: formattedDate,
        time: details.time,
        notes: details.notes || "None"
      };
    }

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        // Webhook succeeded, return immediately and don't trigger the mailto draft!
        return;
      }
      console.warn(`Webhook responded with status ${response.status}. Falling back to email client.`);
    } catch (error) {
      console.error("Webhook notification failed, falling back to email client:", error);
    }
  }

  // Fallback: Open user's email client if no webhook URL is defined or if the webhook request fails
  const subject = `Design Session Booking - ${details.name}`;
  const body = `Hi Sandra,

A user has scheduled a 1-on-1 design session with you.

--- Booking Details ---
Name: ${details.name}
Email: ${details.email}
Date: ${formattedDate}
Time: ${details.time}
Notes: ${details.notes || 'None'}

Please reply to this email to confirm the session or send the invite link.`;

  const mailtoUrl = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};

// --- Helper Functions for Calendar ---
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  const days: (number | null)[] = [];
  
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    days.push(d);
  }
  return days;
};

const isDateInPast = (day: number, currentMonth: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const testDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
  return testDate < today;
};

const isSelectedDate = (day: number, currentMonth: Date, selectedDate: Date | null) => {
  if (!selectedDate) return false;
  return selectedDate.getDate() === day &&
         selectedDate.getMonth() === currentMonth.getMonth() &&
         selectedDate.getFullYear() === currentMonth.getFullYear();
};

const formatSelectedDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const MOCK_TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM"
];

// --- Booking Modal Component ---
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'datetime' | 'form' | 'success'>('datetime');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const today = new Date();
  const calendarDays = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth()) {
      return;
    }
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    if (isDateInPast(day, currentMonth)) return;
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !selectedDate || !selectedTime) return;
    
    await sendBookingDetails({
      name,
      email,
      date: selectedDate,
      time: selectedTime,
      notes
    });

    setStep('success');
  };

  const resetModal = () => {
    setStep('datetime');
    setSelectedDate(null);
    setSelectedTime(null);
    setName('');
    setEmail('');
    setNotes('');
    onClose();
  };

  const isPrevMonthDisabled = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();

  return (
    <div className="booking-overlay" onClick={resetModal}>
      <div className="booking-card" onClick={(e) => e.stopPropagation()}>
        <button className="booking-close-btn" onClick={resetModal}>
          <X size={20} />
        </button>

        <div className="booking-grid">
          {/* Left Column: Booking details (Static) */}
          <div className="booking-left-panel">
            <div className="brand-logo-small" style={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>SANDRA UMUTONI</div>
            <div className="booking-host">Sandra UMUTONI</div>
            <h2 className="booking-session-title">1-on-1 Design Session</h2>
            
            <div className="booking-meta-list">
              <div className="booking-meta-item">
                <Clock size={16} />
                <span>30 min</span>
              </div>
              <div className="booking-meta-item">
                <Video size={16} />
                <span>Web conferencing details provided upon confirmation</span>
              </div>
            </div>

            {selectedDate && (
              <div className="booking-selected-summary">
                <CalendarIcon size={16} />
                <div>
                  <p className="summary-time">
                    {selectedTime ? `${selectedTime}, ` : ''}
                    {formatSelectedDate(selectedDate)}
                  </p>
                  <p className="summary-tz">Central European Time (CET)</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Step content */}
          <div className="booking-right-panel">
            {step === 'datetime' && (
              <div className="datetime-pane">
                <h3 className="pane-title">Select Date & Time</h3>
                
                <div className="datetime-split">
                  {/* Calendar view */}
                  <div className="calendar-container">
                    <div className="calendar-header">
                      <button 
                        className="cal-nav-btn" 
                        onClick={handlePrevMonth} 
                        disabled={isPrevMonthDisabled}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="current-month-label">
                        {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </span>
                      <button className="cal-nav-btn" onClick={handleNextMonth}>
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="calendar-weekdays">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((wd, i) => (
                        <div key={i} className="weekday-label">{wd}</div>
                      ))}
                    </div>

                    <div className="calendar-grid-cells">
                      {calendarDays.map((day, idx) => {
                        if (day === null) {
                          return <div key={`empty-${idx}`} className="grid-cell empty"></div>;
                        }
                        
                        const isPast = isDateInPast(day, currentMonth);
                        const isSelected = isSelectedDate(day, currentMonth, selectedDate);
                        
                        return (
                          <button
                            key={`day-${day}`}
                            className={`grid-cell day-btn ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectDay(day)}
                            disabled={isPast}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time list view */}
                  <div className="time-slots-container">
                    {selectedDate ? (
                      <>
                        <h4 className="time-slots-title">
                          {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </h4>
                        <div className="time-slots-list">
                          {MOCK_TIME_SLOTS.map((time) => {
                            const isTimeSelected = selectedTime === time;
                            return (
                              <div key={time} className="time-slot-row">
                                <button
                                  className={`time-slot-btn ${isTimeSelected ? 'selected' : ''}`}
                                  onClick={() => setSelectedTime(time)}
                                >
                                  {time}
                                </button>
                                {isTimeSelected && (
                                  <button 
                                    className="time-slot-confirm-btn animate-fade-in"
                                    onClick={() => setStep('form')}
                                  >
                                    Next
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="time-slots-placeholder">
                        Select a date to view available time slots
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="form-pane">
                <h3 className="pane-title">Enter Details</h3>
                
                <div className="form-group">
                  <label htmlFor="name-input">Name *</label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email-input">Email *</label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes-input">Add details/notes</label>
                  <textarea
                    id="notes-input"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Please share anything that will help prepare for our meeting."
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="form-back-btn" 
                    onClick={() => setStep('datetime')}
                  >
                    Back
                  </button>
                  <button type="submit" className="form-submit-btn">
                    Schedule Event
                  </button>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="success-pane">
                <div className="success-icon-box">
                  <CheckCircle size={48} className="success-icon" />
                </div>
                <h3 className="success-title">You are scheduled!</h3>
                <p className="success-desc">
                  A calendar invitation has been sent to your email address.
                </p>

                <div className="success-details-card">
                  <h4>1-on-1 Design Session</h4>
                  <div className="details-card-item">
                    <CalendarIcon size={16} />
                    <span>
                      {selectedTime}, {selectedDate && formatSelectedDate(selectedDate)}
                    </span>
                  </div>
                  <div className="details-card-item">
                    <Video size={16} />
                    <span>Web conferencing details provided via email</span>
                  </div>
                </div>

                <button className="success-close-btn" onClick={resetModal}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- App Component ---
function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <main className="portfolio-wrapper">
      {/* Left Side: Image & Bio */}
      <section className="left-column">
        <div className="hero-img-container">
          <img src="/Orange.jpg" alt="Sandra" className="hero-img" />
        </div>
        
        <div className="left-top">
          <h1 className="brand-name" style={{ fontSize: '1.4rem', whiteSpace: 'nowrap' }}>SANDRA UMUTONI</h1>
        </div>

        <div className="left-bottom">
          <h2 className="bio-title">Hallo, I'm Sandra UMUTONI.</h2>
          <p className="bio-text">
            I build my ideas, help others to shape theirs, and talk about everything design.
          </p>
        </div>
      </section>

      {/* Right Side: Content Sections */}
      <section className="right-column">
        {/* Top Header Row */}
        <div className="top-grid">
          <div className="top-item">
            <h3>Got a question?</h3>
            <p>Get in touch</p>
          </div>
          <div className="top-item">
            <h3>Stay in the loop</h3>
            <p>Subscribe</p>
          </div>
          <div className="top-item">
            <h3>I'm on socials</h3>
            <p>Follow me on x.com</p>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="main-content-grid">
          {/* Column 1: Projects & Features */}
          <div className="content-section">
            <div>
              <h2 className="section-header">Projects</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">10x Designers</span>
                  <span className="list-value">'22</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Off-Grid <span className="badge-new">new</span></span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Community Guide</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Kloffie</span>
                  <span className="list-value">'22</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Apex</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Design Gifts</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">365 Design tips</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Fridays with Fons</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Rise</span>
                  <span className="list-value">'23</span>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h2 className="section-header">Features</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">Config</span>
                  <span className="list-value">'22</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Hatch Conference</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Wall Street Journal</span>
                  <span className="list-value">'23</span>
                </li>
                <li className="list-item">
                  <span className="list-label">New York Times</span>
                  <span className="list-value">'22</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Macworld</span>
                  <span className="list-value">'23</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: Stack & Clients */}
          <div className="content-section">
            <div>
              <h2 className="section-header">Stack</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">Framer</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Typefully</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Overrrides</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Circle</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Iconists</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Screen Studio</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Relume</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Cleanshot</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Helpscout</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Figma</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Figma</span>
                  <span className="list-value">Web design</span>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h2 className="section-header">Clients</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">Bluesky</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Diagram</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Figma</span>
                  <span className="list-value">Visual design</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Channels */}
          <div className="content-section">
            <div>
              <h2 className="section-header">Channels</h2>
              <ul className="links-list">
                <li className="list-item">
                  <span className="list-label">Twitter</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">LinkedIn</span>
                  <span className="list-value">Web design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Medium</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Substack</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Threads</span>
                  <span className="list-value">Visual design</span>
                </li>
                <li className="list-item">
                  <span className="list-label">Apple Music</span>
                  <span className="list-value">Visual design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <a 
          href="#book" 
          onClick={(e) => {
            e.preventDefault();
            setIsBookingOpen(true);
          }}
          className="book-session-btn"
        >
          Book a session
        </a>
      </section>

      {/* Booking Overlay Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </main>
  );
}

export default App;
