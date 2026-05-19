import UploadCard from "../components/UploadCard";

export default function UploadLogs() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-200">Upload Logs</p>
        <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Log Ingestion Workflow</h1>
      </div>
      <UploadCard />
    </div>
  );
}
