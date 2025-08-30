import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts'

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
    <div style={{ width: '100%', height: 150 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 24 }}>
          <YAxis
            domain={[0, 'dataMax + 10']}
            label={{ value: 'msg/sec', angle: -90, position: 'insideLeft', dy: 16, dx: 6, style: { fill: 'var(--td-muted)' } }}
            tick={{ fill: 'var(--td-muted)', fontSize: 12 }}
          />
          <XAxis
            dataKey="t"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            tick={{ fill: 'var(--td-muted)', fontSize: 12 }}
            label={{ value: 'timestamp', position: 'insideBottom', dy: 12, style: { fill: 'var(--td-muted)' } }}
          />
          <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--td-border)', color: 'var(--td-text)' }} labelFormatter={() => ''} formatter={(v) => [v, 'msg/s']} />
          <Line type="monotone" dataKey="v" stroke="#10a14b" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
