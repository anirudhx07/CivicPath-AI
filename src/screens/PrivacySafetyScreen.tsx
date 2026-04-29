interface PrivacySafetyScreenProps {
  onBack: () => void;
}

export const PrivacySafetyScreen = ({ onBack }: PrivacySafetyScreenProps) => (
    <div className="screen-shell screen-shell-sm min-h-screen">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1"><span className="material-symbols-outlined text-sm">arrow_back</span> Records</button>
        <h2 className="text-4xl font-serif italic font-bold mb-8">Neutrality Audit</h2>
        <div className="space-y-12">
            <div className="screen-card p-5 sm:p-8 border-2 border-ink space-y-6">
                <h3 className="text-2xl font-serif italic font-bold">The CivicPath AI Covenant</h3>
                <p className="text-lg font-serif italic text-muted leading-relaxed">
                    CivicPath AI is strictly an educational tool. We do not store political preferences, recommend candidates, or influence voting choices. Our data comes from official, non-partisan election commissions.
                </p>
                <div className="text-[10px] font-black uppercase tracking-widest p-2 bg-ink text-white inline-block">Verified Source Protocol</div>
            </div>
            <div className="grid grid-cols-1 gap-8 opacity-80">
                {[
                    { title: "Data Privacy", desc: "Your progress is stored locally or securely in your private cloud account. We never harvest identity data." },
                    { title: "AI Moderation", desc: "Our AI is restricted to election process facts only. Political opinions are strictly gated." },
                    { title: "Report Inaccuracy", desc: "Help us keep the guide accurate by reporting errors to our audit team." },
                ].map(it => (
                    <div key={it.title} className="space-y-2 pb-6 border-b border-border">
                        <h4 className="font-bold text-sm tracking-tight uppercase">{it.title}</h4>
                        <p className="text-sm text-muted leading-relaxed">{it.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
