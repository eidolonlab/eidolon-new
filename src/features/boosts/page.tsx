import React from 'react';
import DailyBoostWidget from '@/components/DailyBoostWidget';
import BoostsTab from '@/../ui/BoostsTab';

export default function HomePage() {
  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <header>
        <h1>Eidolon</h1>
        <p style={{ opacity: 0.8 }}>Tiny actions. Real momentum. Non-medical focus support.</p>
      </header>
      <section>
        <DailyBoostWidget />
      </section>
      <section className="card">
        <h2>Boosts</h2>
        <BoostsTab />
      </section>
    </main>
  );
}