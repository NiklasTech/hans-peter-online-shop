'use client';

import { useState } from 'react';

export function EmailSendButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'lucaeliasgerhards@web.de',
          subject: 'Test E-Mail',
          html: '<h1>Hallo!</h1><p>Dies ist eine Test-E-Mail.</p>',
        }),
      });

      const result = await response.json();
      setStatus(result.message);
    } catch (error) {
      setStatus('Fehler beim Versenden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleClick}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Wird gesendet...' : 'E-Mail versenden'}
        </button>
      </div>
      {status && (
        <p className={`mt-2 ${status.includes('erfolgreich') ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </p>
      )}
    </div>
  );
}