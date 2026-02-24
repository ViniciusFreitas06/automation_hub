'use client'

import { useEffect, useState } from 'react'
import { getDashboardMetrics } from '@/services/dashboard'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<{ total_scripts: number } | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboardMetrics()
        console.log('DATA:', data)
        setMetrics(data)
      } catch (error) {
        console.error('ERRO:', error)
      }
    }

    load()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6">
        <div className="bg-white rounded-xl shadow p-6 w-64">
          <span className="text-gray-500 text-sm">Total de Scripts</span>
          <p className="text-3xl font-bold">
            {metrics ? metrics.total_scripts : '...'}
          </p>
        </div>
      </div>
    </div>
  )
}