import { useAppStore } from '@/store/appStore';
import { Icon } from '@/ui/Icon';

/* Always the inverse of the canvas, so it reads in both light and dark —
   the .vrf-toast rule in theme.css. */
export function ToastHost() {
  const toasts = useAppStore((s) => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <>
      {toasts.map((t, i) => (
        <div
          key={t.id}
          className="vrf-toast fixed left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold anim-scalein"
          style={{ bottom: `${6 + i * 3.5}rem` }}
        >
          <Icon name={t.icon} className="w-4 h-4" style={{ color: 'var(--gold)' }} />
          <span>{t.msg}</span>
        </div>
      ))}
    </>
  );
}
