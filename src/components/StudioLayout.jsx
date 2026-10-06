import { useState, useRef, useEffect } from "react";
import "./StudioLayout.css";

const VIEWS = [
  { id: "front", label: "Chính diện" },
  { id: "zoom", label: "Phóng to" },
];

function HarmonyRing({ value }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const safeVal = Math.min(100, Math.max(0, Number(value) || 0));
  const offset = c * (1 - safeVal / 100);

  return (
    <svg className="vp-ring" viewBox="0 0 80 80" role="img" aria-label={`Độ hài hòa ${safeVal} trên 100`}>
      <circle cx="40" cy="40" r={r} className="vp-ring__track" />
      <circle
        cx="40"
        cy="40"
        r={r}
        className="vp-ring__bar"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <text x="40" y="46" textAnchor="middle" className="vp-ring__num">
        {safeVal}
      </text>
    </svg>
  );
}

export default function StudioLayout({
  outfitName = "Áo dài truyền thống",
  subtitle = "Cả ba miền • Lụa tơ tằm Vạn Phúc",
  harmony = 95,
  harmonyNote = "Tông màu chính và màu phụ có độ tương phản nhã nhặn, tôn vinh ngũ hành truyền thống.",
  culturalWarnings = [],
  onApplyWarningFix,
  facePhoto = null,
  onPickFace,
  onClearFace,
  models = [],
  activeModel = "female_1",
  onPickModel,
  palette = [],
  accessories = [],
  view = "front",
  onViewChange,
  onFullscreen,
  controls,
  stage,
  meaning,
  sources,
  onGenerate,
  isGenerating = false,
}) {
  const [noteOpen, setNoteOpen] = useState(true);
  const stageRef = useRef(null);

  // Mỗi lần có ảnh mặt mới: cho mặt trời trống đồng "nổ" hào quang một lần
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !facePhoto) return;
    el.classList.remove("burst");
    // Trigger reflow to restart css animation
    void el.offsetWidth;
    el.classList.add("burst");
  }, [facePhoto]);

  return (
    <div className="vp">
      {/* ── Trái: bộ điều khiển (Controls) ── */}
      <aside className="vp-panel vp-controls" aria-label="Tùy chỉnh trang phục">
        {controls}
      </aside>

      {/* ── Giữa: sân khấu (Stage) ── */}
      <main className="vp-stage" ref={stageRef}>
        {/* Chữ lớn tên trang phục mờ ảo sau lưng */}
        <span className="vp-stage__mark" aria-hidden="true">
          {outfitName}
        </span>

        {/* Chùm đèn chiếu sân khấu từ trên xuống */}
        <div className="vp-stage__light" aria-hidden="true" />

        {/* Thanh điều khiển góc nhìn trên sân khấu */}
        <header className="vp-stage__top">
          <div className="vp-seg" role="tablist" aria-label="Góc nhìn">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={view === v.id}
                className={view === v.id ? "is-on" : ""}
                onClick={() => onViewChange && onViewChange(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>

          {onFullscreen && (
            <button
              type="button"
              className="vp-fullscreen-trigger"
              onClick={onFullscreen}
              title="Phóng to toàn màn hình"
            >
              🔍 Phóng to
            </button>
          )}
        </header>

        {/* Trái tim sân khấu: Cặp bài trùng mặt của bạn + trang phục */}
        <div className="vp-stage__model">
          <div className="vp-duo">
            {/* Khung khuôn mặt với vầng hào quang trống đồng */}
            <figure className="vp-facewrap">
              <div className="vp-sun" aria-hidden="true" />
              <div className="vp-drum" aria-hidden="true" />
              <div className="vp-glow" aria-hidden="true" />

              <div className="vp-facecard">
                {facePhoto ? (
                  <>
                    <img src={facePhoto} alt="Khuôn mặt của bạn" />
                    <div className="vp-faceact">
                      <button type="button" onClick={onPickFace}>Đổi ảnh</button>
                      <button type="button" onClick={onClearFace}>Bỏ ảnh</button>
                    </div>
                  </>
                ) : (
                  <button type="button" className="vp-facecard__empty" onClick={onPickFace}>
                    <span aria-hidden="true">+</span>
                    Thêm ảnh mặt của bạn
                  </button>
                )}
              </div>
              <figcaption className="vp-cap">Mặt của bạn</figcaption>
            </figure>

            {/* Dấu cầu nối biểu trưng */}
            <div className="vp-bridge" aria-hidden="true">+</div>

            {/* Khung ma-nơ-canh trang phục */}
            <div className={"vp-body" + (view === "zoom" ? " is-zoom" : "")}>
              <div className="vp-body__fig">{stage}</div>
              <span className="vp-cap">Trang phục</span>
            </div>
          </div>
        </div>

        {/* Chân sân khấu: Dải màu đang dùng + Bộ chọn người mẫu mẫu */}
        <footer className="vp-stage__bottom">
          <ul className="vp-palette" aria-label="Màu đang dùng">
            {palette.map((c) => (
              <li key={c.label}>
                <i style={{ background: c.color }} />
                <span>{c.label}</span>
              </li>
            ))}
          </ul>

          <div className="vp-models" role="radiogroup" aria-label="Chọn người mẫu">
            {models.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={activeModel === m.id && !facePhoto}
                className={activeModel === m.id && !facePhoto ? "is-on" : ""}
                onClick={() => onPickModel && onPickModel(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </footer>
      </main>

      {/* ── Phải: tóm tắt & đánh giá (Summary) ── */}
      <aside className="vp-panel vp-summary" aria-label="Tóm tắt phối đồ">
        <div className="vp-summary__scroll">
          <h1 className="vp-title">{outfitName}</h1>
          <p className="vp-sub">{subtitle}</p>

          {/* Vòng tròn đo độ hài hòa */}
          <section className="vp-harmony">
            <HarmonyRing value={harmony} />
            <div>
              <h2>Độ hài hòa màu sắc</h2>
              <p>{harmonyNote}</p>
            </div>
          </section>

          {/* Cảnh báo hoặc nhận định văn hóa di sản */}
          <section className="vp-culture-box">
            {culturalWarnings.length === 0 ? (
              <div className="vp-culture-pass">
                <span>🌿 Nhận định di sản</span>
                <p>Tuyệt vời! Set đồ phối hợp hài hòa, chuẩn mực và tôn trọng bản sắc di sản.</p>
              </div>
            ) : (
              <div className="vp-warnings-list">
                {culturalWarnings.map((w, idx) => (
                  <div key={idx} className="vp-warning-item">
                    <strong>{w.title}</strong>
                    <p>{w.message}</p>
                    {w.suggestion && (
                      <span className="vp-warning-sug">Gợi ý: {w.suggestion}</span>
                    )}
                    {w.fixAction && onApplyWarningFix && (
                      <button
                        type="button"
                        className="vp-warning-fix-btn"
                        onClick={() => onApplyWarningFix(w)}
                      >
                        Áp dụng gợi ý
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Phụ kiện kết hợp */}
          {accessories.length > 0 && (
            <section className="vp-block">
              <h2>Phụ kiện kết hợp ({accessories.length})</h2>
              <ul className="vp-chips">
                {accessories.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Ý nghĩa di sản Accordion */}
          {meaning && (
            <section className="vp-block">
              <button
                type="button"
                className="vp-fold"
                aria-expanded={noteOpen}
                onClick={() => setNoteOpen((o) => !o)}
              >
                Ý nghĩa di sản
                <span aria-hidden="true">{noteOpen ? "−" : "+"}</span>
              </button>
              {noteOpen && (
                <div className="vp-note">
                  {meaning}
                  {sources && <div className="vp-sources">{sources}</div>}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Nút hành động chính bám đáy */}
        <div className="vp-cta">
          <button
            type="button"
            className="vp-cta__btn"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating
              ? "⏳ Tơ lụa đang dệt..."
              : facePhoto
              ? "✨ Tạo ảnh AI (Ghép mặt bạn)"
              : "✨ Tạo ảnh AI (Dùng mẫu)"}
          </button>
          <small>Poster nghệ thuật và so sánh phương án ở bước 4.</small>
        </div>
      </aside>
    </div>
  );
}
