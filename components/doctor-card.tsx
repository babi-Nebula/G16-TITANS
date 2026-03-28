import { Psychiatrist } from "@/lib/types";

interface DoctorCardProps {
  doctor: Psychiatrist;
  onSelect: (doctorId: string) => void;
  selected?: boolean;
}

export default function DoctorCard({ doctor, onSelect, selected }: DoctorCardProps) {
  return (
    <article
      className={`rounded-2xl border p-4 transition ${
        selected ? "border-blue-400 bg-blue-50/80" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-900">{doctor.fullName}</h4>
          <p className="text-sm text-slate-600">{doctor.specialty}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          ⭐ {doctor.rating}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">{doctor.bio}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {doctor.languages.map((language) => (
          <span key={language} className="rounded-full bg-sky-50 px-2 py-1 text-sky-700">
            {language.toUpperCase()}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-slate-700">Fee: ETB {doctor.consultationFeeEtb}</p>
        <button
          type="button"
          onClick={() => onSelect(doctor.id)}
          className="rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
        >
          {selected ? "Selected" : "View Profile"}
        </button>
      </div>
    </article>
  );
}
