"use client";

import { usePreviewSettings } from "@/hooks/usePreviewSettings";
import { Switch } from "@/components/ui/switch";

export const PreviewToggle = () => {
    const { previewsEnabled, togglePreviews } = usePreviewSettings();

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-figtree text-white/80">
                {previewsEnabled ? "Low Bandwidth? Disable Previews" : "Show Previews"}
            </span>
            <Switch
                checked={previewsEnabled}
                onCheckedChange={togglePreviews}
                aria-label="Toggle video previews"
                className="bg-gray-500 data-[state=checked]:bg-[#7B0B0B]"
            />
        </div>
    );
};
