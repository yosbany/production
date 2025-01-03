import React from 'react';
import { translations } from '../constants/translations';

interface ProducerFilterProps {
  selectedProducer: string | null;
  onProducerChange: (producerId: string | null) => void;
}

export default function ProducerFilter({ selectedProducer, onProducerChange }: ProducerFilterProps) {
  return (
    <div className="w-full">
      <label htmlFor="producer" className="block text-sm font-medium text-gray-700 mb-1">
        {translations.production.producer}
      </label>
      <select
        id="producer"
        value={selectedProducer || ''}
        onChange={(e) => onProducerChange(e.target.value || null)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Todos los Productores</option>
      </select>
    </div>
  );
}