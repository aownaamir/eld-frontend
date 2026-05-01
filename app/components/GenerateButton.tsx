export default function GenerateButton({
  onSubmit,
  form,
  loading,
  isReady,
}: {
  onSubmit: (data: any) => void;
  form: any;
  loading?: boolean;
  isReady: boolean;
}) {
  return (
    <button
      onClick={() => onSubmit(form)}
      disabled={loading || !isReady}
      className={`
          w-full font-semibold py-3.5 transition-all text-sm tracking-wide
          flex items-center justify-center gap-2
          ${
            loading
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : isReady
                ? "bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white"
                : "bg-zinc-100 text-zinc-300 cursor-not-allowed border border-zinc-200"
          }
        `}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
          Generating Trip…
        </>
      ) : (
        <>Generate Trip</>
      )}
    </button>
  );
}
