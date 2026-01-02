'use client'

import { useState, useEffect } from 'react'
import { useLatest } from 'ahooks'

export default function Demo1() {
  const [useLatestCount, setUseLatestCount] = useState(0)
  const [defaultCount, setDefaultCount] = useState(0)

  const latestCountRef = useLatest(useLatestCount)

  useEffect(() => {
    const interval = setInterval(() => {
      setUseLatestCount(latestCountRef.current + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  useEffect(() => {
    const interval = setInterval(() => {
      setDefaultCount(defaultCount + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <>
      <p>count(useLatest): {useLatestCount}</p>
      <p>count(default): {defaultCount}</p>
    </>
  )
}
