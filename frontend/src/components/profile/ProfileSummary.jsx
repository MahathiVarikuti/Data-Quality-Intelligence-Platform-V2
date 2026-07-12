import MetadataCard from "../dataset/MetadataCard";
import {
    Database,
    Columns3,
    AlertCircle,
    Copy,
} from "lucide-react";

export default function ProfileSummary({ profile }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <MetadataCard
                icon={<Database size={22} />}
                title="Rows"
                value={profile.rows}
            />

            <MetadataCard
                icon={<Columns3 size={22} />}
                title="Columns"
                value={profile.columns}
            />

            <MetadataCard
                icon={<AlertCircle size={22} />}
                title="Missing Values"
                value={profile.missing_total}
            />

            <MetadataCard
                icon={<Copy size={22} />}
                title="Duplicate Rows"
                value={profile.duplicate_rows}
            />

        </div>
    );
}