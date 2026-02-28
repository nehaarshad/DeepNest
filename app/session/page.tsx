"use client"
import SessionContent from './content'
import { Suspense } from 'react'


export default function SessionPage() {

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SessionContent />
    </Suspense>
   
  )
}