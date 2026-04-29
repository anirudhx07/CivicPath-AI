import type { UserProfile } from "../types";

interface SavedItemsScreenProps {
  user: UserProfile;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const SavedItemsScreen = ({ user, onBack, onDelete }: SavedItemsScreenProps) => (
    <div className="min-h-screen pt-20 px-8 pb-32 max-w-3xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-ink font-bold mb-12 uppercase text-[10px] tracking-widest border-b-2 border-ink pb-1 w-fit">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return
        </button>
        <h1 className="text-4xl font-serif italic font-bold mb-4">Saved Records</h1>
        <p className="text-muted mb-12">Personal archives of essential civic data and AI clarifications.</p>

        {user.savedItems.length === 0 ? (
            <div className="border border-dashed border-border p-20 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl text-muted mb-6">history_edu</span>
                <h3 className="text-2xl font-serif italic mb-2">No Records Found</h3>
                <p className="text-muted max-w-sm mx-auto leading-relaxed underline decoration-accent/30 decoration-2 underline-offset-4">Your personal repository is currently empty. Bookmark essential findings while interacting with the AI Guide.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {user.savedItems.map(item => (
                    <div key={item.id} className="p-8 bg-white border border-border group hover:border-ink transition-colors flex items-center gap-8">
                        <div className="w-12 h-12 border border-ink flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">{item.type === "ai" ? "smart_toy" : "menu_book"}</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-serif italic font-bold">{item.title}</h4>
                            <div className="flex gap-4 mt-2">
                                <span className="text-[9px] text-muted uppercase font-bold tracking-widest">{item.date}</span>
                                <span className="text-[9px] text-accent uppercase font-bold tracking-widest">{item.category}</span>
                            </div>
                        </div>
                        <button onClick={() => onDelete(item.id)} className="text-red-900 opacity-20 hover:opacity-100 transition-opacity"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                ))}
            </div>
        )}
    </div>
);
