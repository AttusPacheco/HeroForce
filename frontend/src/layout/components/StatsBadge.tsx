import {ProjectStatus} from "../../enums/project-status.enum.ts";

export function StatusBadge({status}: { status: string }) {
    const colors: Record<string, string> = ProjectStatus;

    return (
        <span
            className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}
        >
            {status.replace('_', ' ').toLocaleUpperCase()}
        </span>
    );
}