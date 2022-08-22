import React, { useState, useEffect } from 'react'

export function useModal() {
  const [show, setShow] = useState(false)
  useEffect(() => {}, [])
  return { show, setShow }
}
