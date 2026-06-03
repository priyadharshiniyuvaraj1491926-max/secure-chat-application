import React from 'react'
import { formatDate } from '../utils/format'

const PrivacyDashboard = ({ auditLogs = [] }) => {
  const securityAlerts = auditLogs.filter(log => 
    log.event_type.includes('SECURITY') || 
    log.event_type.includes('FAILED')
  )
  
  const privacyEvents = auditLogs.filter(log =>
    log.event_type.includes('SCREENSHOT') ||
    log.event_type.includes('RECORDING') ||
    log.event_type.includes('VIEW_ONCE')
  )

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-8">Privacy Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Security Alerts</h2>
          {securityAlerts.length === 0 ? (
            <p className="text-gray-500">No security alerts</p>
          ) : (
            <ul className="space-y-2">
              {securityAlerts.map((alert, idx) => (
                <li key={idx} className="text-sm text-red-600">
                  <strong>{alert.event_type}</strong><br />
                  <span className="text-xs text-gray-500">{formatDate(alert.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Privacy Events</h2>
          {privacyEvents.length === 0 ? (
            <p className="text-gray-500">No privacy events recorded</p>
          ) : (
            <ul className="space-y-2">
              {privacyEvents.map((event, idx) => (
                <li key={idx} className="text-sm text-orange-600">
                  <strong>{event.event_type}</strong><br />
                  <span className="text-xs text-gray-500">{formatDate(event.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrivacyDashboard
