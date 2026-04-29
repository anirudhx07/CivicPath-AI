interface AccessibilityScreenProps {
  onBack: () => void;
}

export const AccessibilityScreen = ({ onBack }: AccessibilityScreenProps) => (
    <div className="min-h-screen pt-20 px-8 pb-20 max-w-2xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1"><span className="material-symbols-outlined text-sm">arrow_back</span> Settings</button>
        <h2 className="text-4xl font-serif italic font-bold mb-8">Accessibility</h2>
        <div className="border border-border divide-y divide-border">
            {[
                { label: "Large Text", desc: "Increase font size for better readability", icon: "format_size" },
                { label: "High Contrast", desc: "Use high contrast colors for the UI", icon: "contrast" },
                { label: "Read Aloud", desc: "Automatically read AI responses", icon: "volume_up" },
                { label: "Reduce Animations", desc: "Minimize screen transitions", icon: "motion_photos_off" },
            ].map(it => (
                <div key={it.label} className="p-8 bg-white flex items-center justify-between hover:bg-paper transition-colors">
                    <div className="flex gap-6">
                        <span className="material-symbols-outlined text-muted">{it.icon}</span>
                        <div>
                            <h4 className="font-bold text-sm tracking-tight">{it.label}</h4>
                            <p className="text-[11px] text-muted uppercase font-bold tracking-widest mt-1">{it.desc}</p>
                        </div>
                    </div>
                    <div className="w-12 h-6 bg-border rounded-none relative border border-ink"><div className="absolute left-1 top-1 w-4 h-4 bg-ink" /></div>
                </div>
            ))}
        </div>
    </div>
);
