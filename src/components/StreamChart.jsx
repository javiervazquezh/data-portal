import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

export default function StreamChart({ value }) {
  const [data, setData] = useState([])
  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => {
        const next = [...d, { t: Date.now(), v: value + Math.round((Math.random() - 0.5) * value * 0.2) }]
        return next.slice(-30)
      })
    }, 1000)
    return () => clearInterval(id)
  }, [value])
  return (
    <div style={{ width: '100%', height: 120 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <YAxis hide domain={[0, 'dataMax + 10']} />
          <Tooltip contentStyle={{ background: '#0e1315', border: '1px solid var(--td-border)' }} labelFormatter={() => ''} formatter={(v) => [v, 'msg/s']} />
          <Line type="monotone" dataKey="v" stroke="#10a14b" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
