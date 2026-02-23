// meeting-prep-app.jsx
// Meeting preparation system for boss briefings

const { useState } = React;


function MeetingPrepApp() {
  // Who is preparing the meeting
  const [preparedBy, setPreparedBy] = useState('');

  // Add briefing type (NEW)
  const [briefingType, setBriefingType] = useState('');

  // Meeting details
  const [meetingInfo, setMeetingInfo] = useState({
    datum: '',
    tid: ''
  });

  // Customer info
  const [kundInfo, setKundInfo] = useState({
    foretag: '',
    organisationsnummer: '',
    antalAnstallda: '',
    omsattning: '',
    vdNamn: '',
    vdTelefon: ''
  });

  // Discussion details
  const [diskussionInfo, setDiskussionInfo] = useState({
    forstaKontakt: '',
    nuvarandeSituation: '',
    viFokuserar: '',
    helhetsPaket: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!preparedBy) newErrors.preparedBy = 'Välj ditt namn';
    if (!briefingType) newErrors.briefingType = 'Välj situation'; // NEW

    // Only require meeting date if it's a meeting (NEW)
    if (briefingType === 'meeting' && !meetingInfo.datum) newErrors.datum = 'Välj mötesdatum';

    if (!kundInfo.foretag) newErrors.foretag = 'Företagsnamn krävs';
    if (!kundInfo.organisationsnummer) newErrors.organisationsnummer = 'Org.nummer krävs';
    if (!kundInfo.vdNamn) newErrors.vdNamn = 'VD namn krävs';

    // Make "nuvarandeSituation" required (NEW)
    if (!diskussionInfo.nuvarandeSituation) newErrors.nuvarandeSituation = 'Beskriv nuvarande situation';

    if (!diskussionInfo.viFokuserar) newErrors.viFokuserar = 'Beskriv vad ni ska fokusera på';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateEmailBody = () => {
    let body = '';

    const typeLabels = {
      meeting: '📅 MÖTESBRIEFING',
      stuck: '🔴 FASTNAT - BEHÖVER HJÄLP',
      uncertain: '🤔 OSÄKER KUND',
      follow_up: '📞 UPPFÖLJNING',
      rescue: '🚨 RÄDDA DEAL',
      other: '💬 BRIEFING'
    };

    body += `${typeLabels[briefingType] || 'BRIEFING'}\n`;
    body += `Förberedd av: ${preparedBy}\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Only show meeting info if it's a meeting (NEW)
    if (briefingType === 'meeting' && (meetingInfo.datum || meetingInfo.tid)) {
      body += `📅 MÖTE\n\n`;
      body += `Datum: ${meetingInfo.datum || '_'}\n`;
      body += `Tid: ${meetingInfo.tid || '_'}\n\n`;
    }

    // Customer info
    body += `🏢 KUNDUPPGIFTER\n\n`;
    body += `Företag: ${kundInfo.foretag}\n`;
    body += `Org.nummer: ${kundInfo.organisationsnummer}\n`;
    body += `Antal anställda: ${kundInfo.antalAnstallda || '_'}\n`;
    body += `Omsättning: ${kundInfo.omsattning || '_'}\n`;
    body += `VD: ${kundInfo.vdNamn}\n`;
    body += `Telefon: ${kundInfo.vdTelefon || '_'}\n\n`;

    // Discussion
    body += `💬 SITUATION & FOKUS\n\n`;
    body += `Första kontakt: ${diskussionInfo.forstaKontakt || '_'}\n\n`;
    body += `Nuvarande situation:\n${diskussionInfo.nuvarandeSituation || '_'}\n\n`;
    body += `Vi fokuserar på:\n${diskussionInfo.viFokuserar || '_'}\n\n`;

    if (diskussionInfo.helhetsPaket) {
      body += `Övrig info:\n${diskussionInfo.helhetsPaket}\n\n`;
    }

    return body;
  };

  const handleSend = () => {
    if (!validateForm()) {
      alert('Vänligen fyll i alla obligatoriska fält.');
      return;
    }

    const typeLabels = {
      meeting: 'Möte',
      stuck: 'HJÄLP - Fastnat',
      uncertain: 'Osäker kund',
      follow_up: 'Uppföljning',
      rescue: 'RÄDDA - Deal',
      other: 'Briefing'
    };

    const subjectPrefix = "[EP-BRIEF] ";

    const subject = `${subjectPrefix}${typeLabels[briefingType]} - ${kundInfo.foretag}`;
    const body = generateEmailBody();

    const mailtoLink =
      `mailto:adam.mazze@easypartner.se` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  const completionPercentage = () => {
    let total = 9; // UPDATED
    let filled = 0;

    if (preparedBy) filled++;
    if (briefingType) filled++; // NEW

    // Only count meeting date if it's a meeting (NEW)
    if (briefingType === 'meeting') {
      if (meetingInfo.datum) filled++;
    } else {
      // If not a meeting, treat "meeting field" as not applicable but still keep the same total logic:
      // We'll count it as filled so the progress doesn't punish non-meeting flows.
      filled++;
    }

    if (kundInfo.foretag) filled++;
    if (kundInfo.organisationsnummer) filled++;
    if (kundInfo.vdNamn) filled++;
    if (diskussionInfo.forstaKontakt) filled++;
    if (diskussionInfo.nuvarandeSituation) filled++;
    if (diskussionInfo.viFokuserar) filled++;

    return Math.round((filled / total) * 100);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: '"DM Sans", -apple-system, sans-serif',
      color: '#e2e8f0'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }

        .form-section {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .input-field {
          width: 100%;
          padding: 12px 16px;
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid rgba(148, 163, 184, 0.2);
          border-radius: 8px;
          color: #e2e8f0;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #55c7db;
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 0 3px rgba(85, 199, 219, 0.1);
        }
        .input-field.error { border-color: #ef4444; }
        select.input-field { cursor: pointer; }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary {
          background: linear-gradient(135deg, #55c7db 0%, #a39acb 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(85, 199, 219, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(85, 199, 219, 0.4);
        }

        .progress-bar {
          height: 8px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #55c7db, #a39acb);
          border-radius: 999px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 12px rgba(85, 199, 219, 0.5);
        }

        .error-text { color: #fca5a5; font-size: 13px; margin-top: 4px; }
        textarea.input-field { min-height: 110px; resize: vertical; }

        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(64%) sepia(36%) saturate(1021%) hue-rotate(146deg) brightness(93%) contrast(87%);
          cursor: pointer;
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '24px 0',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                background: 'linear-gradient(135deg, #55c7db 0%, #a39acb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Space Mono, monospace'
              }}>
                Mötesbriefing
              </h1>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
                Förbered chefen inför kundmöten
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="progress-bar" style={{ width: '200px' }}>
                <div className="progress-fill" style={{ width: `${completionPercentage()}%` }} />
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontFamily: 'Space Mono, monospace' }}>
                {completionPercentage()}% komplett
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Vem förbereder */}
        <div className="form-section">
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #55c7db 0%, #a39acb 100%)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>👤</span>
            Vem förbereder mötet?
          </h2>

          <select
            className={`input-field ${errors.preparedBy ? 'error' : ''}`}
            style={{ maxWidth: '400px', fontSize: '16px' }}
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
          >
            <option value="">-- Välj ditt namn --</option>
            <option value="Abbe">Abbe</option>
            <option value="Kosrat">Kosrat</option>
            <option value="Kevin">Kevin</option>
          </select>

          {errors.preparedBy && <div className="error-text">{errors.preparedBy}</div>}
        </div>

        {/* Typ av briefing (NEW) */}
        <div className="form-section">
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #55c7db 0%, #a39acb 100%)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>📋</span>
            Vad handlar briefingen om?
          </h2>

          <select
            className={`input-field ${errors.briefingType ? 'error' : ''}`}
            style={{ maxWidth: '600px', fontSize: '16px' }}
            value={briefingType}
            onChange={(e) => setBriefingType(e.target.value)}
          >
            <option value="">-- Välj situation --</option>
            <option value="meeting">📅 Möte med kund</option>
            <option value="stuck">🔴 Fastnat - behöver hjälp att stänga</option>
            <option value="uncertain">🤔 Osäker - vet inte om Jag kan sälja</option>
            <option value="follow_up">📞 Uppföljning behövs</option>
            <option value="rescue">🚨 Rädda deal - kund tvekar</option>
            <option value="other">💬 Annat</option>
          </select>

          {errors.briefingType && <div className="error-text">{errors.briefingType}</div>}
        </div>

        {/* Mötesinfo - only show if briefing type is meeting (UPDATED) */}
        {briefingType === 'meeting' && (
          <div className="form-section">
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #55c7db 0%, #a39acb 100%)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>📅</span>
              När är mötet?
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                  Datum *
                </label>
                <input
                  type="date"
                  className={`input-field ${errors.datum ? 'error' : ''}`}
                  value={meetingInfo.datum}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setMeetingInfo({ ...meetingInfo, datum: e.target.value })}
                />
                {errors.datum && <div className="error-text">{errors.datum}</div>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                  Tid
                </label>
                <input
                  type="time"
                  className="input-field"
                  value={meetingInfo.tid}
                  onChange={(e) => setMeetingInfo({ ...meetingInfo, tid: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Kunduppgifter */}
        <div className="form-section">
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #55c7db 0%, #a39acb 100%)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>🏢</span>
            Kunduppgifter
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Företag *
              </label>
              <input
                className={`input-field ${errors.foretag ? 'error' : ''}`}
                value={kundInfo.foretag}
                onChange={(e) => setKundInfo({ ...kundInfo, foretag: e.target.value })}
                placeholder="Lassen Construction AB"
              />
              {errors.foretag && <div className="error-text">{errors.foretag}</div>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Organisationsnummer *
              </label>
              <input
                className={`input-field ${errors.organisationsnummer ? 'error' : ''}`}
                value={kundInfo.organisationsnummer}
                onChange={(e) => setKundInfo({ ...kundInfo, organisationsnummer: e.target.value })}
                placeholder="556670-8722"
              />
              {errors.organisationsnummer && <div className="error-text">{errors.organisationsnummer}</div>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Antal anställda
              </label>
              <input
                type="number"
                className="input-field"
                value={kundInfo.antalAnstallda}
                onChange={(e) => setKundInfo({ ...kundInfo, antalAnstallda: e.target.value })}
                placeholder="16"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Omsättning (mkr)
              </label>
              <input
                className="input-field"
                value={kundInfo.omsattning}
                onChange={(e) => setKundInfo({ ...kundInfo, omsattning: e.target.value })}
                placeholder="35 miljoner"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                VD Namn *
              </label>
              <input
                className={`input-field ${errors.vdNamn ? 'error' : ''}`}
                value={kundInfo.vdNamn}
                onChange={(e) => setKundInfo({ ...kundInfo, vdNamn: e.target.value })}
                placeholder="Jonas Lassen"
              />
              {errors.vdNamn && <div className="error-text">{errors.vdNamn}</div>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Telefon (VD)
              </label>
              <input
                className="input-field"
                value={kundInfo.vdTelefon}
                onChange={(e) => setKundInfo({ ...kundInfo, vdTelefon: e.target.value })}
                placeholder="040 630 80 01"
              />
            </div>
          </div>
        </div>

        {/* Situationsbeskrivning (UPDATED from "Diskussion") */}
        <div className="form-section">
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #55c7db 0%, #a39acb 100%)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>💬</span>
            Situationsbeskrivning
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Första kontakten
              </label>
              <input
                className="input-field"
                value={diskussionInfo.forstaKontakt}
                onChange={(e) => setDiskussionInfo({ ...diskussionInfo, forstaKontakt: e.target.value })}
                placeholder="Ex: För 2 veckor sedan..."
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Nuvarande situation *
              </label>
              <textarea
                className={`input-field ${errors.nuvarandeSituation ? 'error' : ''}`}
                value={diskussionInfo.nuvarandeSituation}
                onChange={(e) => setDiskussionInfo({ ...diskussionInfo, nuvarandeSituation: e.target.value })}
                placeholder={
                  briefingType === 'stuck' ? 'Varför har Du fastnat? Vad är hindret?' :
                  briefingType === 'uncertain' ? 'Varför är Du osäkra? Vad saknas?' :
                  briefingType === 'rescue' ? 'Varför tvekar kunden? Vad hände?' :
                  'Beskriv situationen...'
                }
                style={{ minHeight: '120px' }}
              />
              {errors.nuvarandeSituation && <div className="error-text">{errors.nuvarandeSituation}</div>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Vad behöver Du hjälp med? *
              </label>
              <textarea
                className={`input-field ${errors.viFokuserar ? 'error' : ''}`}
                value={diskussionInfo.viFokuserar}
                onChange={(e) => setDiskussionInfo({ ...diskussionInfo, viFokuserar: e.target.value })}
                placeholder={
                  briefingType === 'meeting' ? 'Vad ska Du fokusera på i mötet?' :
                  briefingType === 'stuck' ? 'Hur kan chefen hjälpa till att stänga dealen?' :
                  briefingType === 'uncertain' ? 'Vad behöver chefen bedöma?' :
                  briefingType === 'rescue' ? 'Hur räddar vi detta?' :
                  'Vad behöver vi göra?'
                }
                style={{ minHeight: '120px' }}
              />
              {errors.viFokuserar && <div className="error-text">{errors.viFokuserar}</div>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Övrig info
              </label>
              <textarea
                className="input-field"
                value={diskussionInfo.helhetsPaket}
                onChange={(e) => setDiskussionInfo({ ...diskussionInfo, helhetsPaket: e.target.value })}
                placeholder="Allt annat som är bra att veta..."
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>
        </div>

        {/* Send Button */}
        <div style={{
          position: 'sticky',
          bottom: '24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '2px solid rgba(85, 199, 219, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.3), 0 0 40px rgba(85, 199, 219, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                Redo att skicka briefing?
              </div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                Mejl skickas till Adam
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSend}
              style={{ fontSize: '16px', padding: '16px 32px' }}
            >
              📨 Skicka briefing
            </button>
          </div>

          {Object.keys(errors).length > 0 && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fca5a5'
            }}>
              <span>⚠️</span>
              <span>Vänligen fyll i alla obligatoriska fält</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MeetingPrepApp />);