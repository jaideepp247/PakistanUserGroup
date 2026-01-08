import { useState, useRef } from 'react'
import { toPng } from 'html-to-image'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [company, setCompany] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const posterRef = useRef(null)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadPoster = async () => {
    if (!posterRef.current) return
    
    setIsGenerating(true)
    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        width: 540,
        height: 540,
      })
      
      const link = document.createElement('a')
      link.download = `PUG_Summit_2026_${name.replace(/\s+/g, '_') || 'Attendee'}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error generating poster:', error)
      alert('Error generating poster. Please try again.')
    }
    setIsGenerating(false)
  }

  const isFormValid = name.trim() && designation.trim() && photoPreview

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/logo-header.png" alt="PUG Logo" className="header-logo" />
            <div className="header-text">
              <h1>Pakistan UG Summit 2026</h1>
              <p>Attendee Poster Generator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="form-section">
          <h2>Create Your Poster</h2>
          <p className="form-description">
            Generate your personalized attendee poster for social media.
          </p>

          <div className="form-group">
            <label htmlFor="photo">Your Photo</label>
            <div className="photo-upload">
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-input"
              />
              <label htmlFor="photo" className="photo-label">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="photo-preview-small" />
                ) : (
                  <div className="photo-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span>Click to upload</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Jai Deep"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <input
              type="text"
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g., DevOps Engineer"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company (Optional)</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Geeks of Kolachi"
              className="text-input"
            />
          </div>

          <button
            onClick={downloadPoster}
            disabled={!isFormValid || isGenerating}
            className="download-btn"
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Poster
              </>
            )}
          </button>

          <p className="quality-note"> social media optimized</p>
        </div>

        <div className="preview-section">
          <h2>Live Preview</h2>
          <div className="poster-wrapper">
            <div className="poster" ref={posterRef}>
              {/* Multi-layer background */}
              <div className="poster-bg"></div>
              <div className="poster-gradient-overlay"></div>
              
              {/* Wave patterns */}
              <div className="wave-pattern wave-1"></div>
              <div className="wave-pattern wave-2"></div>
              <div className="wave-pattern wave-3"></div>
              
              {/* Decorative circles */}
              <div className="bg-circle circle-1"></div>
              <div className="bg-circle circle-2"></div>
              <div className="bg-circle circle-3"></div>
              <div className="bg-circle circle-4"></div>
              
              {/* Accent dots */}
              <div className="accent-dot dot-1"></div>
              <div className="accent-dot dot-2"></div>
              <div className="accent-dot dot-3"></div>
              <div className="accent-dot dot-4"></div>
              <div className="accent-dot dot-5"></div>
              <div className="accent-dot dot-6"></div>
              
              {/* Main content */}
              <div className="poster-content">
                {/* Top-left Summit Badge */}
                <div className="summit-badge">
                  <img src="/PUG_vertical.jpg" alt="PUG" className="badge-logo" />
                  <div className="badge-text">
                    <span className="badge-pakistan">PAKISTAN</span>
                    <span className="badge-summit">UG SUMMIT</span>
                  </div>
                </div>

                {/* TOP SECTION: Photo + Attendee Details */}
                <div className="top-section">
                  {/* Photo on left */}
                  <div className="photo-wrapper">
                    <div className="photo-ring-outer"></div>
                    <div className="photo-ring-accent"></div>
                    <div className="photo-ring-white"></div>
                    <div className="photo-container">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Attendee" className="attendee-photo" />
                      ) : (
                        <div className="photo-placeholder-poster">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="photo-badge">
                      <span>ATTENDEE</span>
                    </div>
                  </div>

                  {/* Attendee details on right */}
                  <div className="attendee-details">
                    <h2 className="attendee-name">{name || 'Your Name'}</h2>
                    <p className="attendee-designation">{designation || 'Your Designation'}</p>
                    {company && <p className="attendee-company">{company}</p>}
                  </div>
                </div>

                {/* MIDDLE SECTION: "I will be attending" text */}
                <div className="attending-section">
                  <p className="attending-text">I will be attending</p>
                  <h1 className="event-title">Pakistan User Group</h1>
                  <h1 className="event-title highlight">Summit 2026</h1>
                </div>

                {/* BOTTOM SECTION: Date & Venue - Horizontal */}
                <div className="event-details-horizontal">
                  <div className="detail-item">
                    <div className="detail-icon calendar">
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-day">Saturday</span>
                      <span className="detail-date">10th January 2026</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon location">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-venue">Innovista Indus, DHA</span>
                      <span className="detail-venue">Library Karachi</span>
                    </div>
                  </div>
                </div>

                {/* WHITE FOOTER with sponsor logos */}
                <div className="poster-footer-white">
                  <img src="/1dynamics1.jpg" alt="1Dynamics" className="sponsor-logo dynamics" />
                  <img src="/mazik.jpg" alt="Mazik Global" className="sponsor-logo mazik" />
                  <div className="footer-divider"></div>
                  <img src="/logo-header.png" alt="PUG" className="sponsor-logo pug" />
                  <span className="community-text">Microsoft Tech Community</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 Pakistan User Group. Made with ❤️ for the community.</p>
      </footer>
    </div>
  )
}

export default App
