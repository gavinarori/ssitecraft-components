'use client'

import UnlockPanel from '@component/UnlockPanel'

/** Takes the place of the code view for a Pro component. The real code is never sent to this browser. */
export default function LockedCode({ hidden, pack, single = null }) {
  // Fake, harmless lines so the panel looks like code behind glass
  const bars = [62, 40, 78, 55, 30, 70, 48, 66, 36, 58]

  return (
    <div hidden={hidden} className="relative h-[400px] overflow-hidden rounded-xl bg-neutral-950 ring-1 ring-slate-200 lg:h-[600px]">
      <div className="space-y-3 p-6 opacity-40 blur-[2px]" aria-hidden="true">
        {bars.map((width, index) => (
          <div key={index} className="h-3 rounded bg-neutral-600" style={{ width: `${width}%`, marginLeft: `${(index % 3) * 4}%` }} />
        ))}
      </div>
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="w-full max-w-md space-y-3 rounded-[20px] bg-white p-6 shadow-[rgba(0,0,0,0.25)_0_6px_27px]">
          <p className="text-lg font-semibold tracking-tight text-neutral-950">Unlock the code</p>
          <p className="text-sm text-neutral-600">
            Copy-paste HTML, JSX and Vue. Buy this component, or the whole {pack.title} pack. One payment, yours to keep.
          </p>
          <UnlockPanel pack={pack} single={single} compact />
        </div>
      </div>
    </div>
  )
}