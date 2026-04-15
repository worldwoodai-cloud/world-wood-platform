'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Info, Users, Scale, FileText, Zap, Award, CheckCircle } from 'lucide-react';

export default function StandardsPage() {
  const [activeRating, setActiveRating] = useState('G');

  const sections = [
    {
      icon: <Scale size={32} />,
      title: "Purpose & Mission",
      content: "WORLD WOOD is built on a foundation of trust. Our Digital Cinema Standards Board (DCSB) ensures that every film on our platform meets a high bar for quality, safety, and technological ethics. We create a professional environment for AI-native cinema where creators, audiences, and brands can thrive."
    },
    {
      icon: <Zap size={32} />,
      title: "Responsible AI Policy",
      content: "We strictly prohibit the use of a real person’s face, voice, or identity without explicit legal permission. Deepfakes used for misinformation, political manipulation, or harmful propaganda are strictly disallowed. Fiction, satire, and clearly labeled imaginary content are encouraged."
    },
    {
      icon: <Info size={32} />,
      title: "Classification System",
      content: "Every film carries a mandatory age rating (G, 12+, 16+, 18+) and specific content descriptors. This allows audiences to make informed decisions about what they watch, ensuring age-appropriate experiences across all cinematic halls."
    },
    {
      icon: <Award size={32} />,
      title: "Quality & Curation",
      content: "Unlike open video hosting, WORLD WOOD is a curated digital theater. The DCSB reviews films for cinematic merit, technical execution, and platform fit. Only the most exceptional works receive the 'WORLD WOOD Official Selection' badge."
    }
  ];

  const ratings = [
    {
      code: 'G',
      label: 'General / All Audiences',
      description: 'Suitable for all ages. No material likely to offend or alarm. Educational, animated, and general family content.',
      guidance: 'Parents can feel confident that G-rated films on World Wood represent family-safe environments. No profanity, violence, or mature themes are permitted under this tier.',
      descriptors: ['Educational', 'Wholesome', 'Animated', 'Non-Violent']
    },
    {
      code: '12+',
      label: 'Teen / Suitable for 12 and up',
      description: 'May contain mild action violence, suggestive themes, or infrequent mild language. Representative of most standard cinema.',
      guidance: 'Action-heavy sequences may be present. Themes of friendship, adventure, and mild conflict are common. Minimal stylized blood may be seen in historical contexts.',
      descriptors: ['Action', 'Thematic Elements', 'Mild Language', 'Fantasy Violence']
    },
    {
      code: '16+',
      label: 'Mature / Suitable for 16 and up',
      description: 'Intense sequences, psychological depth, and realistic depictions. Recommended for mature audiences only.',
      guidance: 'Films may contain intense psychological horror, moderate profanity, and stylistic depictions of societal issues. High technical fidelity makes these experiences very immersive.',
      descriptors: ['Moderate Language', 'Intensity', 'Complex Themes', 'Dark Concepts']
    },
    {
      code: '18+',
      label: 'Adult / Restricted to Adults',
      description: 'Content may include graphic violence, sexual themes, or strong language. Strict identity verification required.',
      guidance: 'Reserved for uncompromising creative visions. May contain graphic depictions and extreme concepts. Accessible only via DCSB-Verified adult credentials.',
      descriptors: ['Graphic Content', 'Strong Language', 'Restricted', 'Adult Themes']
    }
  ];

  return (
    <div className="standards-page">
      <section className="hero-section">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="title"
          >
            Digital Cinema <span className="accent-text">Standards Board</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="subtitle"
          >
            WORLD WOOD curates, classifies, and protects — preserving the integrity of the world's digital cinema industry.
          </motion.p>
        </div>
      </section>

      <div className="container">
        <div className="standards-grid">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="standard-card glass"
            >
              <div className="icon-box">{section.icon}</div>
              <h3>{section.title}</h3>
              <p>{section.content}</p>
              <ul className="card-details">
                <li>Verified by Human Audit</li>
                <li>Real-time Compliance Sync</li>
                <li>Industry Standard V2.4</li>
              </ul>
            </motion.div>
          ))}
        </div>

        <section className="audit-checklist glass">
          <div className="section-header">
            <h2 className="accent-text">DCSB Technical Audit Checklist</h2>
            <p>Every submission undergoes a mandatory 14-point check before achieving "Official Selection" status.</p>
          </div>
          <div className="checklist-grid">
            <div className="check-category">
              <h4>Identity Integrity</h4>
              <ul>
                <li><CheckCircle size={14} /> Biometric consent verification for real-world likeness.</li>
                <li><CheckCircle size={14} /> Voice-clone authorization certificates (.vauth).</li>
                <li><CheckCircle size={14} /> Prohibition of political/public figure manipulation.</li>
              </ul>
            </div>
            <div className="check-category">
              <h4>Technical Standards</h4>
              <ul>
                <li><CheckCircle size={14} /> Minimum 4K master (8K preferred for Premiere).</li>
                <li><CheckCircle size={14} /> Temporal consistency audit (Zero flicker/warp).</li>
                <li><CheckCircle size={14} /> Spatial Audio spatial positioning verified.</li>
              </ul>
            </div>
            <div className="check-category">
              <h4>Ethical Attribution</h4>
              <ul>
                <li><CheckCircle size={14} /> Model disclosure (Foundation model usage report).</li>
                <li><CheckCircle size={14} /> Training data ethics compliance (DCSB Whitepaper V3).</li>
                <li><CheckCircle size={14} /> Human-in-the-loop creative certification.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="certification-tiers glass">
          <h2>WW Certification Tiers</h2>
          <div className="tiers-table">
            <div className="t-row t-head">
              <span>Tier</span>
              <span>Requirement</span>
              <span>Benefit</span>
              <span>Badge</span>
            </div>
            <div className="t-row">
              <div className="t-cell"><strong>Verified Creator</strong></div>
              <div className="t-cell">Identity Verified</div>
              <div className="t-cell">2K Upload Cap</div>
              <div className="t-cell"><div className="t-badge blue">VC</div></div>
            </div>
            <div className="t-row">
              <div className="t-cell"><strong>Official Selection</strong></div>
              <div className="t-cell">DCSB Technical Audit Passed</div>
              <div className="t-cell">Global Premiere Eligible</div>
              <div className="t-cell"><div className="t-badge gold">OS</div></div>
            </div>
            <div className="t-row">
              <div className="t-cell"><strong>Master Selection</strong></div>
              <div className="t-cell">Cinematic Merit Award</div>
              <div className="t-cell">Hall Legacy Collection</div>
              <div className="t-cell"><div className="t-badge red">MS</div></div>
            </div>
          </div>
        </section>

        <section className="ratings-section glass">
          <div className="section-header">
            <h2>WW Classification System</h2>
            <p>Transparency in audience safety and content expectations. Click a rating to view detailed DCSB guidance.</p>
          </div>
          
          <div className="classification-container">
            <div className="ratings-tabs">
              {ratings.map(r => (
                <button 
                  key={r.code} 
                  className={`rating-tab ${activeRating === r.code ? 'active' : ''}`}
                  onClick={() => setActiveRating(r.code)}
                >
                  <div className="rating-code">{r.code}</div>
                  <span className="rating-label">{r.label.split('/')[0]}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeRating}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="rating-details-panel glass"
              >
                {ratings.find(r => r.code === activeRating) && (
                  <>
                    <div className="panel-header">
                      <h3 className="accent-text">DCSB {activeRating} Guidelines</h3>
                      <p className="description">{ratings.find(r => r.code === activeRating)?.description}</p>
                    </div>
                    
                    <div className="guidance-grid">
                      <div className="guidance-box">
                        <h5>AUDIENCE ADVICE</h5>
                        <p>{ratings.find(r => r.code === activeRating)?.guidance}</p>
                      </div>
                      <div className="guidance-box">
                        <h5>REPRESENTATIVE DESCRIPTORS</h5>
                        <div className="descriptor-tags">
                          {ratings.find(r => r.code === activeRating)?.descriptors.map(d => (
                            <span key={d} className="tag">{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className="ethics-policy">
          <div className="policy-content glass">
            <div className="policy-header">
              <ShieldCheck size={48} className="accent-text" />
              <h2>AI Ethics & Identity usage</h2>
            </div>
            <div className="policy-items">
              <div className="p-item">
                <CheckCircle size={20} className="accent-text" />
                <span><strong>No Unauthorized Identities:</strong> Use of AI to replicate real people without consent is a violation of platform policy.</span>
              </div>
              <div className="p-item">
                <CheckCircle size={20} className="accent-text" />
                <span><strong>Integrity of Reality:</strong> Deceptive misinformation presented as real-world news or facts is prohibited.</span>
              </div>
              <div className="p-item">
                <CheckCircle size={20} className="accent-text" />
                <span><strong>Intellectual Property:</strong> Creators must hold all rights or licenses to the assets used in their synthetic creations.</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .card-details { list-style: none; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 0.5rem; }
        .card-details li { font-size: 0.75rem; font-weight: 800; color: var(--grey); text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 0.5rem; }
        .card-details li::before { content: ""; width: 4px; height: 4px; background: var(--accent); border-radius: 50%; }

        .audit-checklist { padding: 5rem; border-radius: 20px; margin-bottom: 8rem; }
        .checklist-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem; margin-top: 4rem; }
        .check-category h4 { font-size: 1.1rem; font-weight: 900; margin-bottom: 1.5rem; color: white; border-bottom: 1px solid var(--accent); padding-bottom: 0.5rem; width: fit-content; }
        .check-category ul { list-style: none; display: flex; flex-direction: column; gap: 1.2rem; }
        .check-category li { display: flex; gap: 1rem; font-size: 0.9rem; color: #aaa; line-height: 1.4; }
        .check-category li strong { color: white; }

        .certification-tiers { padding: 5rem; border-radius: 20px; margin-bottom: 8rem; }
        .certification-tiers h2 { font-size: 2.5rem; font-weight: 950; margin-bottom: 3rem; text-align: center; }
        .tiers-table { display: flex; flex-direction: column; }
        .t-row { display: grid; grid-template-columns: 1.5fr 2fr 1.5fr 100px; padding: 1.5rem 2rem; border-bottom: 1px solid var(--glass-border); align-items: center; }
        .t-head { font-size: 0.75rem; font-weight: 900; color: var(--grey); text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid var(--glass-border); }
        .t-cell { font-size: 1rem; color: #ccc; }
        .t-badge { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 900; }
        .t-badge.blue { background: rgba(0, 194, 255, 0.1); color: #00c2ff; border: 1px solid #00c2ff; }
        .t-badge.gold { background: rgba(255, 172, 7, 0.1); color: #ffac07; border: 1px solid #ffac07; }
        .t-badge.red { background: rgba(255, 27, 28, 0.1); color: var(--accent); border: 1px solid var(--accent); }

        .standards-page {
          padding-top: 154px;
          padding-bottom: 100px;
        }
        .hero-section {
          text-align: center;
          margin-bottom: 8rem;
        }
        .hero-section .title {
          font-size: 5rem;
          font-weight: 950;
          line-height: 1;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }
        .hero-section .subtitle {
          font-size: 1.4rem;
          color: var(--grey);
          max-width: 800px;
          margin: 0 auto;
        }

        .standards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.5rem;
          margin-bottom: 8rem;
        }
        .standard-card {
          padding: 4rem;
          border-radius: 20px;
          transition: var(--transition);
        }
        .standard-card:hover { transform: translateY(-10px); background: rgba(255,255,255,0.05); }
        .icon-box {
          color: var(--accent);
          margin-bottom: 2rem;
        }
        .standard-card h3 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }
        .standard-card p {
          color: var(--grey);
          font-size: 1.1rem;
          line-height: 1.8;
        }

        .ratings-section {
          padding: var(--section-padding, 6rem);
          border-radius: 20px;
          margin-bottom: 8rem;
        }
        .ratings-section .section-header {
          margin-bottom: 4rem;
          text-align: center;
        }
        .ratings-section h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; }
        
        .classification-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 3rem;
          margin-top: 3rem;
        }

        .ratings-tabs {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .rating-tab {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          padding: 1.5rem 2rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 2rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          color: var(--grey);
        }

        .rating-tab .rating-code {
          min-width: 60px;
          height: 60px;
          border: 3px solid currentColor;
          font-size: 1.5rem;
          border-radius: 12px;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 950;
        }

        .rating-tab.active {
          background: rgba(255,27,28,0.1);
          border-color: var(--accent);
          color: white;
          transform: translateX(10px);
          box-shadow: 0 10px 30px rgba(255, 27, 28, 0.2);
        }

        .rating-tab .rating-label {
          font-weight: 800;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .rating-details-panel {
          padding: 4rem;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          background: rgba(255,255,255,0.02);
        }

        .panel-header h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: 1rem; }
        .panel-header .description { font-size: 1.1rem; color: #ccc; line-height: 1.6; }

        .guidance-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--glass-border);
        }

        .guidance-box h5 { font-size: 0.75rem; font-weight: 900; color: var(--grey); letter-spacing: 2px; margin-bottom: 1rem; }
        .guidance-box p { font-size: 0.95rem; color: #aaa; line-height: 1.6; }

        .descriptor-tags { display: flex; flex-wrap: wrap; gap: 0.8rem; }
        .tag {
          background: rgba(255,255,255,0.1);
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 800;
          color: white;
          text-transform: uppercase;
        }

        .ethics-policy .policy-content {
          padding: 8rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6rem;
        }
        .policy-header { min-width: 300px; }
        .policy-header h2 { font-size: 3rem; font-weight: 900; margin-top: 2rem; line-height: 1.1; }
        .policy-items {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .p-item {
          display: flex;
          gap: 1.5rem;
          font-size: 1.1rem;
          color: #ccc;
          line-height: 1.6;
        }
        .p-item strong { color: white; display: block; margin-bottom: 0.3rem; }

        @media (max-width: 1024px) {
          .standards-grid { grid-template-columns: 1fr; }
          .classification-container { grid-template-columns: 1fr; }
          .policy-content { flex-direction: column; gap: 4rem; padding: 4rem; }
          .hero-section .title { font-size: 3rem; }
          .checklist-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .t-row { grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1.5rem 0; }
          .t-head { display: none; }
        }
      `}</style>
    </div>
  );
}
