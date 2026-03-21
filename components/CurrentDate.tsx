'use client'; // Obligatoire ici

import { useEffect, useState } from 'react';

export default function CurrentDate() {
  const [date, setDate] = useState('');

  useEffect(() => {
    // Ce code ne s'exécute QUE sur le navigateur du client
    setDate(new Date().toLocaleDateString('fr-FR'));
  }, []);

  return <span>{date}</span>;
}