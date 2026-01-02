'use client'

import ThemeToggle from './toggle-theme'

export default function Demo() {
  return (
    <div className="flex flex-col gap-2">
      <div>This is a Demo</div>
      <div>
        click <ThemeToggle /> to toggle theme and the icon will change.
      </div>
    </div>
  )
}
