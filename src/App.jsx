import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [company, setCompany] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef(null)

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

  // Draw poster on Canvas and download
  const downloadPoster = async () => {
    if (!photoPreview) return
    
    setIsGenerating(true)
    
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      // Set canvas size (1080x1080 for HD)
      canvas.width = 1080
      canvas.height = 1080
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#0033cc')
      gradient.addColorStop(0.15, '#1a237e')
      gradient.addColorStop(0.3, '#311b92')
      gradient.addColorStop(0.45, '#4a148c')
      gradient.addColorStop(0.55, '#6a1b9a')
      gradient.addColorStop(0.65, '#8e24aa')
      gradient.addColorStop(0.75, '#ab47bc')
      gradient.addColorStop(0.85, '#c71585')
      gradient.addColorStop(0.95, '#e91e63')
      gradient.addColorStop(1, '#ff1493')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw decorative circles (background)
      ctx.globalAlpha = 0.1
      ctx.beginPath()
      ctx.arc(-100, canvas.height + 100, 400, 0, Math.PI * 2)
      ctx.fillStyle = '#c71585'
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(canvas.width + 100, -100, 350, 0, Math.PI * 2)
      ctx.fillStyle = '#0033cc'
      ctx.fill()
      
      ctx.globalAlpha = 1
      
      // Draw accent dots
      const dots = [
        { x: 950, y: 200, r: 10, color: '#ff1493' },
        { x: 1000, y: 380, r: 6, color: '#00d4ff' },
        { x: 1030, y: 550, r: 8, color: '#ffb73c' },
        { x: 920, y: 450, r: 5, color: '#4ba7aa' },
        { x: 980, y: 700, r: 7, color: '#ef5350' },
      ]
      dots.forEach(dot => {
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
        ctx.fillStyle = dot.color
        ctx.fill()
      })
      
      // Load and draw summit badge (white box with logo)
      await drawSummitBadge(ctx)
      
      // Draw attendee photo
      await drawAttendeePhoto(ctx, photoPreview)
      
      // Draw attendee details
      drawAttendeeDetails(ctx, name, designation, company)
      
      // Draw "I will be attending" section
      drawAttendingSection(ctx)
      
      // Draw event details
      drawEventDetails(ctx)
      
      // Draw white footer with logos
      await drawFooter(ctx)
      
      // Trigger download
      const dataUrl = canvas.toDataURL('image/png', 1.0)
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

  // Helper function to load image
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  // Draw summit badge
  const drawSummitBadge = async (ctx) => {
    // White rounded rectangle - extra wide to fit "UG SUMMIT" fully with padding
    const x = 36, y = 36, w = 310, h = 100, r = 16
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    ctx.fill()
    ctx.shadowColor = 'rgba(0,0,0,0.25)'
    ctx.shadowBlur = 20
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Draw logo
    try {
      const logo = await loadImage('/PUG_vertical.jpg')
      ctx.drawImage(logo, x + 16, y + 16, 68, 68)
    } catch (e) {
      console.log('Logo load failed')
    }
    
    // Draw text
    ctx.fillStyle = '#127173'
    ctx.font = 'bold 18px Montserrat, Arial'
    ctx.fillText('PAKISTAN', x + 95, y + 42)
    
    ctx.fillStyle = '#4b0082'
    ctx.font = 'bold 28px Montserrat, Arial'
    ctx.fillText('UG SUMMIT', x + 95, y + 72)
  }

  // Draw circular attendee photo
  const drawAttendeePhoto = async (ctx, photoSrc) => {
    const centerX = 200
    const centerY = 420
    const radius = 145
    
    // Draw outer gradient ring
    const gradient = ctx.createConicGradient(0, centerX, centerY)
    gradient.addColorStop(0, 'rgba(0, 51, 204, 0.5)')
    gradient.addColorStop(0.25, 'rgba(75, 0, 130, 0.5)')
    gradient.addColorStop(0.5, 'rgba(199, 21, 133, 0.5)')
    gradient.addColorStop(0.75, 'rgba(255, 20, 147, 0.5)')
    gradient.addColorStop(1, 'rgba(0, 51, 204, 0.5)')
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Draw pink accent ring
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2)
    ctx.strokeStyle = '#ff1493'
    ctx.lineWidth = 6
    ctx.globalAlpha = 0.7
    ctx.stroke()
    ctx.globalAlpha = 1
    
    // Draw white border
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.lineWidth = 8
    ctx.stroke()
    
    // Draw photo in circle
    try {
      const photo = await loadImage(photoSrc)
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2)
      ctx.clip()
      
      // Calculate aspect ratio to cover the circle
      const size = (radius - 8) * 2
      const scale = Math.max(size / photo.width, size / photo.height)
      const w = photo.width * scale
      const h = photo.height * scale
      ctx.drawImage(photo, centerX - w/2, centerY - h/2, w, h)
      ctx.restore()
    } catch (e) {
      console.log('Photo load failed')
    }
    
    // Draw ATTENDEE badge
    ctx.save()
    ctx.translate(centerX, centerY + radius + 10)
    
    // Badge background
    const badgeW = 140, badgeH = 36
    const badgeGradient = ctx.createLinearGradient(-badgeW/2, 0, badgeW/2, 0)
    badgeGradient.addColorStop(0, '#0033cc')
    badgeGradient.addColorStop(1, '#4b0082')
    
    ctx.fillStyle = badgeGradient
    ctx.beginPath()
    ctx.roundRect(-badgeW/2, -badgeH/2, badgeW, badgeH, 8)
    ctx.fill()
    
    // Badge border
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Badge text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Montserrat, Arial'
    ctx.textAlign = 'center'
    ctx.fillText('ATTENDEE', 0, 6)
    ctx.restore()
  }

  // Draw attendee details
  const drawAttendeeDetails = (ctx, name, designation, company) => {
    const x = 380
    const y = 350
    
    ctx.textAlign = 'left'
    
    // Name
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px Montserrat, Arial'
    ctx.fillText(name || 'Your Name', x, y)
    
    // Designation
    ctx.font = '600 28px Poppins, Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillText(designation || 'Your Designation', x, y + 50)
    
    // Company
    if (company) {
      ctx.font = '24px Poppins, Arial'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fillText(company, x, y + 90)
    }
  }

  // Draw "I will be attending" section
  const drawAttendingSection = (ctx) => {
    const centerX = 540
    const y = 580
    
    // Semi-transparent box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.beginPath()
    ctx.roundRect(40, y - 30, 1000, 180, 20)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 2
    ctx.stroke()
    
    ctx.textAlign = 'center'
    
    // "I will be attending"
    ctx.font = 'italic 44px "Dancing Script", cursive, Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.fillText('I will be attending', centerX, y + 20)
    
    // "Pakistan User Group"
    ctx.font = 'bold 44px Montserrat, Arial'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Pakistan User Group', centerX, y + 75)
    
    // "Summit 2026" with gradient effect
    ctx.font = 'bold 44px Montserrat, Arial'
    ctx.fillStyle = '#00d4ff'
    ctx.fillText('Summit 2026', centerX, y + 130)
  }

  // Draw event details
  const drawEventDetails = (ctx) => {
    const y = 820
    
    // Date
    ctx.textAlign = 'left'
    
    // Calendar icon background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.beginPath()
    ctx.roundRect(120, y - 25, 60, 60, 12)
    ctx.fill()
    
    // Calendar icon (simplified)
    ctx.fillStyle = '#00d4ff'
    ctx.font = '32px Arial'
    ctx.fillText('📅', 130, y + 18)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '18px Poppins, Arial'
    ctx.fillText('Saturday', 200, y)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px Poppins, Arial'
    ctx.fillText('10th January 2026', 200, y + 28)
    
    // Location icon background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.beginPath()
    ctx.roundRect(550, y - 25, 60, 60, 12)
    ctx.fill()
    
    // Location icon
    ctx.fillStyle = '#ff1493'
    ctx.font = '32px Arial'
    ctx.fillText('📍', 560, y + 18)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = '20px Poppins, Arial'
    ctx.fillText('Innovista Indus, DHA', 630, y)
    ctx.fillText('Library Karachi', 630, y + 28)
  }

  // Draw white footer with sponsor logos
  const drawFooter = async (ctx) => {
    const y = 925
    const height = 155
    
    // White footer background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, y, 1080, height)
    
    // Draw sponsor logos
    const logos = [
      { src: '/1dynamics1.jpg', x: 80, w: 120, h: 50 },
      { src: '/mazik.jpg', x: 250, w: 140, h: 55 },
    ]
    
    for (const logo of logos) {
      try {
        const img = await loadImage(logo.src)
        ctx.drawImage(img, logo.x, y + (height - logo.h) / 2, logo.w, logo.h)
      } catch (e) {
        console.log('Logo load failed:', logo.src)
      }
    }
    
    // Divider
    ctx.fillStyle = '#e0e0e0'
    ctx.fillRect(460, y + 30, 2, height - 60)
    
    // PUG logo - square aspect ratio to avoid distortion
    try {
      const pugLogo = await loadImage('/logo-header.png')
      // Draw as square to maintain proper aspect ratio
      const logoSize = 70
      ctx.drawImage(pugLogo, 490, y + (height - logoSize) / 2, logoSize, logoSize)
    } catch (e) {
      console.log('PUG logo load failed')
    }
    
    // Pakistan User Group text
    ctx.fillStyle = '#333333'
    ctx.font = 'bold 20px Montserrat, Arial'
    ctx.textAlign = 'left'
    ctx.fillText('PAKISTAN', 575, y + 50)
    ctx.fillText('USER GROUP', 575, y + 76)
    
    // Microsoft Tech Community
    ctx.fillStyle = '#666666'
    ctx.font = '14px Poppins, Arial'
    ctx.fillText('Microsoft Tech Community', 590, y + 110)
  }

  const isFormValid = name.trim() && designation.trim() && photoPreview

  return (
    <div className="app-container">
      {/* Hidden canvas for generating poster */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
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

          <p className="quality-note">✨ HD 1080×1080 for social media</p>
        </div>

        <div className="preview-section">
          <h2>Live Preview</h2>
          <div className="poster-wrapper">
            <div className="poster">
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
